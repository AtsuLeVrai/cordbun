import type { REST } from "../rest/index.js";

/**
 * Application role connection metadata types.
 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#application-role-connection-metadata-object-application-role-connection-metadata-type}
 */
export enum ApplicationRoleConnectionMetadataType {
	/** The metadata value (integer) is less than or equal to the guild's configured value */
	IntegerLessThanOrEqual = 1,
	/** The metadata value (integer) is greater than or equal to the guild's configured value */
	IntegerGreaterThanOrEqual = 2,
	/** The metadata value (integer) is equal to the guild's configured value */
	IntegerEqual = 3,
	/** The metadata value (integer) is not equal to the guild's configured value */
	IntegerNotEqual = 4,
	/** The metadata value (ISO8601 string) is less than or equal to the guild's configured value */
	DatetimeLessThanOrEqual = 5,
	/** The metadata value (ISO8601 string) is greater than or equal to the guild's configured value */
	DatetimeGreaterThanOrEqual = 6,
	/** The metadata value (integer) is equal to the guild's configured value (1) */
	BooleanEqual = 7,
	/** The metadata value (integer) is not equal to the guild's configured value (1) */
	BooleanNotEqual = 8,
}

/**
 * Represents application role connection metadata.
 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#application-role-connection-metadata-object}
 */
export interface ApplicationRoleConnectionMetadata {
	/** Type of metadata value */
	type: ApplicationRoleConnectionMetadataType;
	/** Dictionary key for the metadata field (a-z, 0-9, or _; 1-50 characters) */
	key: string;
	/** Name of the metadata field (1-100 characters) */
	name: string;
	/** Translations of the name */
	name_localizations?: Record<string, string>;
	/** Description of the metadata field (1-200 characters) */
	description: string;
	/** Translations of the description */
	description_localizations?: Record<string, string>;
}

/**
 * API methods for interacting with Discord application role connection metadata.
 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata}
 */
export class ApplicationRoleConnectionMetadataAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns a list of application role connection metadata objects for the given application.
	 *
	 * @param applicationId - The ID of the application
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records}
	 */
	async get(applicationId: string): Promise<ApplicationRoleConnectionMetadata[]> {
		return this.rest.get(`/applications/${applicationId}/role-connections/metadata`);
	}

	/**
	 * Updates and returns a list of application role connection metadata objects for the given application.
	 *
	 * @param applicationId - The ID of the application
	 * @param records - The metadata records to update (max 5)
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records}
	 */
	async update(
		applicationId: string,
		records: ApplicationRoleConnectionMetadata[],
	): Promise<ApplicationRoleConnectionMetadata[]> {
		return this.rest.put(`/applications/${applicationId}/role-connections/metadata`, { body: records });
	}
}
