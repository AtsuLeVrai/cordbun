export interface PaginationParams {
	before?: string;
	after?: string;
	limit?: number;

	[key: string]: string | number | boolean | undefined;
}

export interface PaginationWithCountParams extends PaginationParams {
	with_counts?: boolean;
}

export interface PaginationWithMemberParams extends PaginationParams {
	with_member?: boolean;
}

export type PartialWithNullable<T, K extends keyof T = never> = {
	[P in keyof T]?: P extends K ? T[P] | null : T[P];
};

export type RequiredNonNullable<T, K extends keyof T> = {
	[P in K]-?: NonNullable<T[P]>;
};
