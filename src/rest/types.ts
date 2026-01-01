import type { ApiVersion, JsonErrorCode } from "../constants/index.js";
import type { ApiErrorResponse } from "../resources/errors.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RouteLike = `/${string}`;

export type AuthType = "Bot" | "Bearer";

export interface RESTOptions {
	authType?: AuthType;
	version?: ApiVersion;
	userAgent?: string;
	retries?: number;
	timeout?: number;
	invalidRequestWarningInterval?: number;
	sweepInterval?: number;
}

export type QueryValue = string | number | boolean | undefined;

export type BodyValue = string | Buffer | ArrayBuffer | Uint8Array | object;

export interface RequestOptions {
	body?: BodyValue;
	files?: FileData[];
	query?: { [key: string]: QueryValue };
	reason?: string;
	auth?: boolean;
	headers?: Record<string, string>;
}

export interface FileData {
	name: string;
	data: Blob | ArrayBuffer | Uint8Array;
	contentType?: string;
}

export interface RateLimitData {
	limit: number;
	remaining: number;
	reset: number;
	resetAfter: number;
	bucket: string;
	global: boolean;
	scope?: RateLimitScope | undefined;
}

export type RateLimitScope = "user" | "global" | "shared";

export interface RateLimitResponse {
	message: string;
	retry_after: number;
	global: boolean;
	code?: JsonErrorCode;
}

export interface RESTResponse<T> {
	data: T;
	status: number;
	headers: Headers;
	rateLimit: RateLimitData | null;
}

export class RESTError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: JsonErrorCode,
		message: string,
		public readonly errors?: ApiErrorResponse["errors"],
		public readonly rateLimit?: RateLimitData,
	) {
		super(message);
		this.name = "RESTError";
	}

	static fromResponse(response: ApiErrorResponse, status: number, rateLimit?: RateLimitData): RESTError {
		return new RESTError(status, response.code, response.message, response.errors, rateLimit);
	}
}

export class RateLimitError extends Error {
	constructor(
		public readonly retryAfter: number,
		public readonly global: boolean,
		public readonly scope?: RateLimitScope,
	) {
		super(`Rate limited for ${retryAfter}s${global ? " (global)" : ""}`);
		this.name = "RateLimitError";
	}
}

export class CloudflareError extends Error {
	constructor(public readonly status: number) {
		super(`Cloudflare error: ${status}`);
		this.name = "CloudflareError";
	}
}

export class FileTooLargeError extends Error {
	constructor(
		public readonly fileName: string,
		public readonly size: number,
		public readonly maxSize: number,
	) {
		super(
			`File "${fileName}" exceeds max size: ${(size / 1024 / 1024).toFixed(2)} MiB > ${maxSize / 1024 / 1024} MiB`,
		);
		this.name = "FileTooLargeError";
	}
}

export interface RateLimitBucket {
	limit: number;
	remaining: number;
	reset: number;
}

export class TimeoutError extends Error {
	constructor(public readonly timeout: number) {
		super(`Request timed out after ${timeout}ms`);
		this.name = "TimeoutError";
	}
}
