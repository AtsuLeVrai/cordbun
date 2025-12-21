import { DISCORD_EPOCH } from "../constants/api.js";

export type Snowflake = `${bigint}`;

export interface DeconstructedSnowflake {
	id: bigint;
	timestamp: bigint;
	workerId: bigint;
	processId: bigint;
	increment: bigint;
	date: Date;
}

const toBigInt = (snowflake: Snowflake | bigint): bigint =>
	typeof snowflake === "bigint" ? snowflake : BigInt(snowflake);

export const getTimestamp = (snowflake: Snowflake | bigint): bigint =>
	(toBigInt(snowflake) >> 22n) + DISCORD_EPOCH;

export const getWorkerId = (snowflake: Snowflake | bigint): bigint =>
	(toBigInt(snowflake) & 0x3e0000n) >> 17n;

export const getProcessId = (snowflake: Snowflake | bigint): bigint =>
	(toBigInt(snowflake) & 0x1f000n) >> 12n;

export const getIncrement = (snowflake: Snowflake | bigint): bigint =>
	toBigInt(snowflake) & 0xfffn;

export const getDate = (snowflake: Snowflake | bigint): Date =>
	new Date(Number(getTimestamp(snowflake)));

export const deconstruct = (
	snowflake: Snowflake | bigint,
): DeconstructedSnowflake => {
	const id = toBigInt(snowflake);
	const timestamp = getTimestamp(id);
	return {
		id,
		timestamp,
		workerId: getWorkerId(id),
		processId: getProcessId(id),
		increment: getIncrement(id),
		date: new Date(Number(timestamp)),
	};
};

export const fromTimestamp = (timestamp: number | Date): Snowflake => {
	const ms = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	return `${(BigInt(ms) - DISCORD_EPOCH) << 22n}`;
};

export const isSnowflake = (value: string): value is Snowflake => {
	if (!/^\d{17,20}$/.test(value)) return false;
	try {
		const id = BigInt(value);
		return id >= 0n && id <= 0xffffffffffffffffn;
	} catch {
		return false;
	}
};

export const compare = (
	a: Snowflake | bigint,
	b: Snowflake | bigint,
): -1 | 0 | 1 => {
	const bigA = toBigInt(a);
	const bigB = toBigInt(b);
	if (bigA < bigB) return -1;
	if (bigA > bigB) return 1;
	return 0;
};

export const isOlderThan = (
	snowflake: Snowflake | bigint,
	other: Snowflake | bigint,
): boolean => compare(snowflake, other) < 0;

export const isNewerThan = (
	snowflake: Snowflake | bigint,
	other: Snowflake | bigint,
): boolean => compare(snowflake, other) > 0;

export const timestampFrom = (snowflake: Snowflake | bigint): number =>
	Number(getTimestamp(snowflake));
