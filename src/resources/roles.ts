/**
 * Flags for roles.
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object-role-flags}
 */
export enum RoleFlags {
	/** Role can be selected by members in an onboarding prompt */
	InPrompt = 1 << 0,
}

/**
 * Tags associated with a role.
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure}
 */
export interface RoleTags {
	/** The ID of the bot this role belongs to */
	bot_id?: string;
	/** The ID of the integration this role belongs to */
	integration_id?: string;
	/** Whether this is the guild's Booster role (null if true) */
	premium_subscriber?: null;
	/** The ID of this role's subscription sku and listing */
	subscription_listing_id?: string;
	/** Whether this role is available for purchase (null if true) */
	available_for_purchase?: null;
	/** Whether this role is a guild's linked role (null if true) */
	guild_connections?: null;
}

/**
 * Colors for a role (new gradient system).
 */
export interface RoleColors {
	/** Primary color of the role */
	primary_color: number;
	/** Secondary color of the role */
	secondary_color: number | null;
	/** Tertiary color of the role */
	tertiary_color: number | null;
}

/**
 * Represents a Discord role.
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
 */
export interface Role {
	/** Role ID */
	id: string;
	/** Role name */
	name: string;
	/** Integer representation of hexadecimal color code */
	color: number;
	/** Role colors (gradient system) */
	colors: RoleColors;
	/** If this role is pinned in the user listing */
	hoist: boolean;
	/** Role icon hash */
	icon?: string | null;
	/** Role unicode emoji */
	unicode_emoji?: string | null;
	/** Position of this role (roles with the same position are sorted by id) */
	position: number;
	/** Permission bit set */
	permissions: string;
	/** Whether this role is managed by an integration */
	managed: boolean;
	/** Whether this role is mentionable */
	mentionable: boolean;
	/** The tags this role has */
	tags?: RoleTags;
	/** Role flags */
	flags: RoleFlags;
}

/**
 * Parameters for creating a role.
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role-json-params}
 */
export type CreateRoleParams = Partial<
	Pick<Role, "name" | "permissions" | "color" | "hoist" | "icon" | "unicode_emoji" | "mentionable">
>;

/**
 * Parameters for modifying a role.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-json-params}
 */
export type ModifyRoleParams = CreateRoleParams;

/**
 * Parameters for modifying role positions.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions-json-params}
 */
export interface ModifyRolePositionsParams {
	/** Role ID */
	id: string;
	/** Sorting position of the role */
	position?: number | null;
}
