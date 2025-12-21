import type { JsonErrorCode } from "../constants/index.js";

export interface ApiErrorDetail {
	code: string;
	message: string;
}

export interface ApiFieldError {
	_errors: ApiErrorDetail[];
}

export type ApiErrorField = ApiFieldError | ApiNestedErrors;

export interface ApiNestedErrors {
	[key: string]: ApiErrorField;
}

export interface ApiErrorResponse {
	code: JsonErrorCode;
	message: string;
	errors?: ApiNestedErrors;
}
