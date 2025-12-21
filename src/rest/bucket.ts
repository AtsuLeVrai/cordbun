import type { RateLimitBucket, RateLimitData } from "./types.js";

export interface BucketManager {
	get: (key: string) => RateLimitBucket | undefined;
	set: (key: string, bucket: RateLimitBucket) => void;
	update: (key: string, data: RateLimitData) => void;
	acquire: (key: string) => Promise<void>;
	isLimited: (key: string) => boolean;
	getDelay: (key: string) => number;
	globalReset: number;
	setGlobalReset: (reset: number) => void;
}

export const createBucketManager = (): BucketManager => {
	const buckets = new Map<string, RateLimitBucket>();
	const bucketKeys = new Map<string, string>();
	let globalReset = 0;

	const get = (key: string): RateLimitBucket | undefined => {
		const bucketKey = bucketKeys.get(key) ?? key;
		return buckets.get(bucketKey);
	};

	const set = (key: string, bucket: RateLimitBucket): void => {
		buckets.set(key, bucket);
	};

	const update = (key: string, data: RateLimitData): void => {
		if (data.bucket) {
			bucketKeys.set(key, data.bucket);
		}

		const bucketKey = data.bucket ?? key;
		const existing = buckets.get(bucketKey);

		buckets.set(bucketKey, {
			limit: data.limit,
			remaining: data.remaining,
			reset: data.reset * 1000,
			processing: existing?.processing ?? null,
		});
	};

	const getDelay = (key: string): number => {
		const now = Date.now();

		if (globalReset > now) {
			return globalReset - now;
		}

		const bucket = get(key);
		if (!bucket) return 0;

		if (bucket.remaining <= 0 && bucket.reset > now) {
			return bucket.reset - now;
		}

		return 0;
	};

	const isLimited = (key: string): boolean => getDelay(key) > 0;

	const acquire = async (key: string): Promise<void> => {
		const delay = getDelay(key);
		if (delay > 0) {
			await Bun.sleep(delay);
		}

		const bucket = get(key);
		if (bucket?.processing) {
			await bucket.processing;
			return acquire(key);
		}
	};

	const setGlobalReset = (reset: number): void => {
		globalReset = reset;
	};

	return {
		get,
		set,
		update,
		acquire,
		isLimited,
		getDelay,
		get globalReset() {
			return globalReset;
		},
		setGlobalReset,
	};
};

export const getRouteKey = (method: string, route: string): string => {
	const majorParams = route.match(/\/(channels|guilds|webhooks)\/(\d+)/);
	const majorId = majorParams?.[2] ?? "";
	const routeWithoutIds = route.replace(/\/\d+/g, "/:id");
	return `${method}:${routeWithoutIds}:${majorId}`;
};
