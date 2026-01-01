import type { REST } from "../rest/index.js";
import type { Guild } from "./guilds.js";
import type { User } from "./users.js";

/**
 * Represents a guild template.
 * A code that when used, creates a guild based on a snapshot of an existing guild.
 * @see {@link https://discord.com/developers/docs/resources/guild-template#guild-template-object}
 */
export interface GuildTemplate {
	/** The template code (unique ID) */
	code: string;
	/** Template name */
	name: string;
	/** The description for the template */
	description: string | null;
	/** Number of times this template has been used */
	usage_count: number;
	/** The ID of the user who created the template */
	creator_id: string;
	/** The user who created the template */
	creator: User;
	/** When this template was created */
	created_at: string;
	/** When this template was last synced to the source guild */
	updated_at: string;
	/** The ID of the guild this template is based on */
	source_guild_id: string;
	/** The guild snapshot this template contains */
	serialized_source_guild: Partial<Guild>;
	/** Whether the template has unsynced changes */
	is_dirty: boolean | null;
}

/**
 * Parameters for creating a guild template.
 * @see {@link https://discord.com/developers/docs/resources/guild-template#create-guild-template-json-params}
 */
export type CreateGuildTemplateParams = Pick<GuildTemplate, "name"> & Partial<Pick<GuildTemplate, "description">>;

/**
 * Parameters for modifying a guild template.
 * @see {@link https://discord.com/developers/docs/resources/guild-template#modify-guild-template-json-params}
 */
export type ModifyGuildTemplateParams = Partial<Pick<GuildTemplate, "name" | "description">>;

/**
 * API methods for interacting with Discord guild templates.
 * @see {@link https://discord.com/developers/docs/resources/guild-template}
 */
export class GuildTemplatesAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns a guild template object for the given code.
	 *
	 * @param templateCode - The template code
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-template}
	 */
	async get(templateCode: string): Promise<GuildTemplate> {
		return this.rest.get(`/guilds/templates/${templateCode}`);
	}

	/**
	 * Returns an array of guild template objects for the given guild.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-templates}
	 */
	async listForGuild(guildId: string): Promise<GuildTemplate[]> {
		return this.rest.get(`/guilds/${guildId}/templates`);
	}

	/**
	 * Creates a template for the guild.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the template
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#create-guild-template}
	 */
	async create(guildId: string, params: CreateGuildTemplateParams): Promise<GuildTemplate> {
		return this.rest.post(`/guilds/${guildId}/templates`, { body: params });
	}

	/**
	 * Syncs the template to the guild's current state.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param templateCode - The template code
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#sync-guild-template}
	 */
	async sync(guildId: string, templateCode: string): Promise<GuildTemplate> {
		return this.rest.put(`/guilds/${guildId}/templates/${templateCode}`);
	}

	/**
	 * Modifies the template's metadata.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param templateCode - The template code
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#modify-guild-template}
	 */
	async modify(guildId: string, templateCode: string, params: ModifyGuildTemplateParams): Promise<GuildTemplate> {
		return this.rest.patch(`/guilds/${guildId}/templates/${templateCode}`, { body: params });
	}

	/**
	 * Deletes the template.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param templateCode - The template code
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#delete-guild-template}
	 */
	async delete(guildId: string, templateCode: string): Promise<GuildTemplate> {
		return this.rest.delete(`/guilds/${guildId}/templates/${templateCode}`);
	}
}
