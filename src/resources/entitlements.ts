import type { REST } from "../rest/index.js";
import type { PaginationParams } from "./utils.js";

/**
 * Types of entitlements.
 * @see {@link https://discord.com/developers/docs/resources/entitlement#entitlement-object-entitlement-types}
 */
export enum EntitlementType {
	/** Entitlement was purchased by user */
	Purchase = 1,
	/** Entitlement for Discord Nitro subscription */
	PremiumSubscription = 2,
	/** Entitlement was gifted by developer */
	DeveloperGift = 3,
	/** Entitlement was purchased by a dev in application test mode */
	TestModePurchase = 4,
	/** Entitlement was granted when the SKU was free */
	FreePurchase = 5,
	/** Entitlement was gifted by another user */
	UserGift = 6,
	/** Entitlement was claimed by user for free as a Nitro Subscriber */
	PremiumPurchase = 7,
	/** Entitlement was purchased as an app subscription */
	ApplicationSubscription = 8,
}

/**
 * Owner types for entitlements.
 * @see {@link https://discord.com/developers/docs/resources/entitlement#create-test-entitlement-json-params}
 */
export enum EntitlementOwnerType {
	/** Guild subscription */
	Guild = 1,
	/** User subscription */
	User = 2,
}

/**
 * Represents an entitlement in Discord.
 * Entitlements represent that a user or guild has access to a premium offering in your application.
 * @see {@link https://discord.com/developers/docs/resources/entitlement#entitlement-object}
 */
export interface Entitlement {
	/** ID of the entitlement */
	id: string;
	/** ID of the SKU */
	sku_id: string;
	/** ID of the parent application */
	application_id: string;
	/** ID of the user that is granted access to the entitlement's SKU */
	user_id?: string;
	/** Type of entitlement */
	type: EntitlementType;
	/** Entitlement was deleted */
	deleted: boolean;
	/** Start date at which the entitlement is valid */
	starts_at: string | null;
	/** Date at which the entitlement is no longer valid */
	ends_at: string | null;
	/** ID of the guild that is granted access to the entitlement's SKU */
	guild_id?: string;
	/** For consumable items, whether or not the entitlement has been consumed */
	consumed?: boolean;
}

/**
 * Query parameters for listing entitlements.
 * @see {@link https://discord.com/developers/docs/resources/entitlement#list-entitlements-query-string-params}
 */
export type ListEntitlementsParams = PaginationParams &
	Partial<Pick<Entitlement, "user_id" | "guild_id">> & {
		/** Optional list of SKU IDs to check entitlements for (comma-delimited) */
		sku_ids?: string;
		/** Whether or not ended entitlements should be omitted */
		exclude_ended?: boolean;
		/** Whether or not deleted entitlements should be omitted */
		exclude_deleted?: boolean;
	};

/**
 * Parameters for creating a test entitlement.
 * @see {@link https://discord.com/developers/docs/resources/entitlement#create-test-entitlement-json-params}
 */
export type CreateTestEntitlementParams = Pick<Entitlement, "sku_id"> & {
	/** ID of the guild or user to grant the entitlement to */
	owner_id: string;
	/** Type of owner (guild or user) */
	owner_type: EntitlementOwnerType;
};

/**
 * API methods for interacting with Discord entitlements.
 * @see {@link https://discord.com/developers/docs/resources/entitlement}
 */
export class EntitlementsAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns all entitlements for a given app, active and expired.
	 *
	 * @param applicationId - The ID of the application
	 * @param params - Query parameters for filtering
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#list-entitlements}
	 */
	async list(applicationId: string, params: ListEntitlementsParams = {}): Promise<Entitlement[]> {
		return this.rest.get(`/applications/${applicationId}/entitlements`, { query: params });
	}

	/**
	 * Returns an entitlement by ID.
	 *
	 * @param applicationId - The ID of the application
	 * @param entitlementId - The ID of the entitlement
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#get-entitlement}
	 */
	async get(applicationId: string, entitlementId: string): Promise<Entitlement> {
		return this.rest.get(`/applications/${applicationId}/entitlements/${entitlementId}`);
	}

	/**
	 * For One-Time Purchase consumable SKUs, marks a given entitlement for the user as consumed.
	 *
	 * @param applicationId - The ID of the application
	 * @param entitlementId - The ID of the entitlement
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#consume-an-entitlement}
	 */
	async consume(applicationId: string, entitlementId: string): Promise<void> {
		return this.rest.post(`/applications/${applicationId}/entitlements/${entitlementId}/consume`);
	}

	/**
	 * Creates a test entitlement to a given SKU for a given guild or user.
	 * Returns a partial entitlement object without `subscription_id`, `starts_at`, or `ends_at`.
	 *
	 * @param applicationId - The ID of the application
	 * @param params - The parameters for creating the test entitlement
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#create-test-entitlement}
	 */
	async createTestEntitlement(applicationId: string, params: CreateTestEntitlementParams): Promise<Entitlement> {
		return this.rest.post(`/applications/${applicationId}/entitlements`, { body: params });
	}

	/**
	 * Deletes a currently-active test entitlement.
	 *
	 * @param applicationId - The ID of the application
	 * @param entitlementId - The ID of the entitlement
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#delete-test-entitlement}
	 */
	async deleteTestEntitlement(applicationId: string, entitlementId: string): Promise<void> {
		return this.rest.delete(`/applications/${applicationId}/entitlements/${entitlementId}`);
	}
}
