import { API_BASE_URL, ApiVersion } from "../constants/index.js";
import type { ApiErrorResponse } from "../resources/index.js";
import { buildMultipartBody, createFileAttachment } from "../utils/index.js";
import { createBucketManager, getRouteKey } from "./bucket.js";
import {
	type HttpMethod,
	type RateLimitData,
	RateLimitError,
	type RateLimitResponse,
	type RateLimitScope,
	type RequestOptions,
	RestError,
	type RestOptions,
	type RestResponse,
} from "./types.js";

const DEFAULT_OPTIONS: Required<Omit<RestOptions, "userAgent">> = {
	authType: "Bot",
	version: 10,
	retries: 3,
	timeout: 15000,
};

const LIB_VERSION = "0.0.1";
const LIB_URL = "https://github.com/cordbun/cordbun";

const VALID_API_VERSIONS = Object.values(ApiVersion).filter(
	(v) => typeof v === "number",
) as ApiVersion[];
const VALID_AUTH_TYPES = ["Bot", "Bearer"] as const;

const validateOptions = (options: RestOptions): void => {
	if (
		options.authType !== undefined &&
		!VALID_AUTH_TYPES.includes(options.authType)
	) {
		throw new TypeError(
			`Invalid authType: ${options.authType}. Must be one of: ${VALID_AUTH_TYPES.join(", ")}`,
		);
	}

	if (options.version !== undefined) {
		if (
			!Number.isInteger(options.version) ||
			!VALID_API_VERSIONS.includes(
				options.version as (typeof VALID_API_VERSIONS)[number],
			)
		) {
			throw new TypeError(
				`Invalid version: ${options.version}. Must be one of: ${VALID_API_VERSIONS.join(", ")}`,
			);
		}
	}

	if (options.retries !== undefined) {
		if (!Number.isInteger(options.retries) || options.retries < 0) {
			throw new TypeError(
				`Invalid retries: ${options.retries}. Must be a non-negative integer`,
			);
		}
	}

	if (options.timeout !== undefined) {
		if (typeof options.timeout !== "number" || options.timeout <= 0) {
			throw new TypeError(
				`Invalid timeout: ${options.timeout}. Must be a positive number`,
			);
		}
	}

	if (options.userAgent !== undefined) {
		if (
			typeof options.userAgent !== "string" ||
			options.userAgent.trim() === ""
		) {
			throw new TypeError("Invalid userAgent: Must be a non-empty string");
		}
	}
};

export interface Rest {
	get: <T>(route: string, options?: RequestOptions) => Promise<T>;
	post: <T>(route: string, options?: RequestOptions) => Promise<T>;
	put: <T>(route: string, options?: RequestOptions) => Promise<T>;
	patch: <T>(route: string, options?: RequestOptions) => Promise<T>;
	delete: <T>(route: string, options?: RequestOptions) => Promise<T>;
	request: <T>(
		method: HttpMethod,
		route: string,
		options?: RequestOptions,
	) => Promise<RestResponse<T>>;
	setToken: (token: string) => void;
}

export const createRest = (token: string, options: RestOptions = {}): Rest => {
	validateOptions(options);

	const config = { ...DEFAULT_OPTIONS, ...options };
	const buckets = createBucketManager();
	let currentToken = token;

	const baseUrl = `${API_BASE_URL}/v${config.version}`;
	const userAgent =
		config.userAgent ?? `DiscordBot (${LIB_URL}, ${LIB_VERSION})`;

	const buildHeaders = (opts: RequestOptions): Headers => {
		const headers = new Headers({
			"User-Agent": userAgent,
		});

		if (opts.auth !== false) {
			headers.set("Authorization", `${config.authType} ${currentToken}`);
		}

		if (opts.reason) {
			headers.set("X-Audit-Log-Reason", encodeURIComponent(opts.reason));
		}

		if (opts.headers) {
			for (const [key, value] of Object.entries(opts.headers)) {
				headers.set(key, value);
			}
		}

		return headers;
	};

	const buildUrl = (route: string, query?: RequestOptions["query"]): string => {
		const url = new URL(`${baseUrl}${route}`);

		if (query) {
			for (const [key, value] of Object.entries(query)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		return url.toString();
	};

	const buildBody = (
		opts: RequestOptions,
		headers: Headers,
	): string | FormData | undefined => {
		if (opts.files?.length) {
			const files = opts.files.map((file, i) =>
				createFileAttachment(i, file.name, file.data, file.contentType),
			);
			const payload = (opts.body ?? {}) as Record<string, unknown>;
			return buildMultipartBody(payload, files);
		}

		if (opts.body) {
			headers.set("Content-Type", "application/json");
			return JSON.stringify(opts.body);
		}

		return undefined;
	};

	const parseRateLimitHeaders = (headers: Headers): RateLimitData | null => {
		const limit = headers.get("X-RateLimit-Limit");
		if (!limit) return null;

		const scope = headers.get("X-RateLimit-Scope") as RateLimitScope | null;

		return {
			limit: Number(limit),
			remaining: Number(headers.get("X-RateLimit-Remaining") ?? 0),
			reset: Number(headers.get("X-RateLimit-Reset") ?? 0),
			resetAfter: Number(headers.get("X-RateLimit-Reset-After") ?? 0),
			bucket: headers.get("X-RateLimit-Bucket") ?? "",
			global: headers.get("X-RateLimit-Global") === "true",
			...(scope && { scope }),
		};
	};

	const handleRateLimit = async (
		response: Response,
		routeKey: string,
	): Promise<never> => {
		const data = (await response.json()) as RateLimitResponse;
		const rateLimit = parseRateLimitHeaders(response.headers);

		if (data.global) {
			buckets.setGlobalReset(Date.now() + data.retry_after * 1000);
		}

		if (rateLimit) {
			buckets.update(routeKey, rateLimit);
		}

		throw new RateLimitError(data.retry_after, data.global, rateLimit?.scope);
	};

	const request = async <T>(
		method: HttpMethod,
		route: string,
		opts: RequestOptions = {},
		retryCount = 0,
	): Promise<RestResponse<T>> => {
		const routeKey = getRouteKey(method, route);

		await buckets.acquire(routeKey);

		const headers = buildHeaders(opts);
		const url = buildUrl(route, opts.query);
		const body = buildBody(opts, headers);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), config.timeout);

		try {
			const response = await fetch(url, {
				method,
				headers,
				body,
				signal: controller.signal,
			});

			const rateLimit = parseRateLimitHeaders(response.headers);
			if (rateLimit) {
				buckets.update(routeKey, rateLimit);
			}

			if (response.status === 429) {
				await handleRateLimit(response, routeKey);
			}

			if (response.status === 204) {
				return {
					data: undefined as T,
					status: response.status,
					headers: response.headers,
					rateLimit,
				};
			}

			const responseData = await response.json();

			if (!response.ok) {
				throw RestError.fromResponse(
					responseData as ApiErrorResponse,
					response.status,
					rateLimit ?? undefined,
				);
			}

			return {
				data: responseData as T,
				status: response.status,
				headers: response.headers,
				rateLimit,
			};
		} catch (error) {
			if (error instanceof RateLimitError && retryCount < config.retries) {
				await Bun.sleep(error.retryAfter * 1000);
				return request(method, route, opts, retryCount + 1);
			}

			if (
				error instanceof RestError &&
				error.status >= 500 &&
				retryCount < config.retries
			) {
				await Bun.sleep(1000 * (retryCount + 1));
				return request(method, route, opts, retryCount + 1);
			}

			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	};

	const get = async <T>(route: string, opts?: RequestOptions): Promise<T> =>
		(await request<T>("GET", route, opts)).data;

	const post = async <T>(route: string, opts?: RequestOptions): Promise<T> =>
		(await request<T>("POST", route, opts)).data;

	const put = async <T>(route: string, opts?: RequestOptions): Promise<T> =>
		(await request<T>("PUT", route, opts)).data;

	const patch = async <T>(route: string, opts?: RequestOptions): Promise<T> =>
		(await request<T>("PATCH", route, opts)).data;

	const del = async <T>(route: string, opts?: RequestOptions): Promise<T> =>
		(await request<T>("DELETE", route, opts)).data;

	const setToken = (newToken: string): void => {
		currentToken = newToken;
	};

	return {
		get,
		post,
		put,
		patch,
		delete: del,
		request,
		setToken,
	};
};
