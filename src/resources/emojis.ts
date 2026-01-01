import type { REST } from "../rest/index.js";
import type { User } from "./users.js";
import type { PartialWithNullable, RequiredNonNullable } from "./utils.js";

/**
 * Represents a Discord emoji.
 * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
 */
export interface Emoji {
	/** Emoji ID */
	id: string | null;
	/** Emoji name (can be null only in reaction emoji objects) */
	name: string | null;
	/** Roles allowed to use this emoji */
	roles?: string[];
	/** User that created this emoji */
	user?: User;
	/** Whether this emoji must be wrapped in colons */
	require_colons?: boolean;
	/** Whether this emoji is managed */
	managed?: boolean;
	/** Whether this emoji is animated */
	animated?: boolean;
	/** Whether this emoji can be used, may be false due to loss of Server Boosts */
	available?: boolean;
}

/**
 * Response structure for listing application emojis.
 * @see {@link https://discord.com/developers/docs/resources/emoji#list-application-emojis}
 */
export interface ListApplicationEmojisResponse {
	/** Array of emoji objects */
	items: Emoji[];
}

/**
 * Parameters for creating a guild emoji.
 * @see {@link https://discord.com/developers/docs/resources/emoji#create-guild-emoji-json-params}
 */
export type CreateGuildEmojiParams = RequiredNonNullable<Emoji, "name" | "roles"> & {
	/** The 128x128 emoji image (base64 encoded) */
	image: string;
};

/**
 * Parameters for modifying a guild emoji.
 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-guild-emoji-json-params}
 */
export type ModifyGuildEmojiParams = PartialWithNullable<Omit<CreateGuildEmojiParams, "image">, "roles">;

/**
 * Parameters for creating an application emoji.
 * @see {@link https://discord.com/developers/docs/resources/emoji#create-application-emoji-json-params}
 */
export type CreateApplicationEmojiParams = Pick<CreateGuildEmojiParams, "name" | "image">;

/**
 * Parameters for modifying an application emoji.
 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-application-emoji-json-params}
 */
export type ModifyApplicationEmojiParams = Required<Pick<ModifyGuildEmojiParams, "name">>;

/**
 * API methods for interacting with Discord emojis.
 * @see {@link https://discord.com/developers/docs/resources/emoji}
 */
export class EmojisAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns a list of emojis for the given guild.
	 * Includes `user` fields if the bot has the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
	 */
	async listGuildEmojis(guildId: string): Promise<Emoji[]> {
		return this.rest.get(`/guilds/${guildId}/emojis`);
	}

	/**
	 * Returns an emoji object for the given guild and emoji IDs.
	 *
	 * @param guildId - The ID of the guild
	 * @param emojiId - The ID of the emoji
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-guild-emoji}
	 */
	async getGuildEmoji(guildId: string, emojiId: string): Promise<Emoji> {
		return this.rest.get(`/guilds/${guildId}/emojis/${emojiId}`);
	}

	/**
	 * Create a new emoji for the guild.
	 * Requires the `CREATE_GUILD_EXPRESSIONS` permission.
	 * Fires a Guild Emojis Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the emoji
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/emoji#create-guild-emoji}
	 */
	async createGuildEmoji(guildId: string, params: CreateGuildEmojiParams, reason?: string): Promise<Emoji> {
		return this.rest.post(`/guilds/${guildId}/emojis`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Modify the given emoji.
	 * Fires a Guild Emojis Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param emojiId - The ID of the emoji
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-guild-emoji}
	 */
	async modifyGuildEmoji(
		guildId: string,
		emojiId: string,
		params: ModifyGuildEmojiParams,
		reason?: string,
	): Promise<Emoji> {
		return this.rest.patch(`/guilds/${guildId}/emojis/${emojiId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Delete the given emoji.
	 * Fires a Guild Emojis Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param emojiId - The ID of the emoji
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/emoji#delete-guild-emoji}
	 */
	async deleteGuildEmoji(guildId: string, emojiId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/emojis/${emojiId}`, reason ? { reason } : {});
	}

	/**
	 * Returns an object containing a list of emojis for the given application.
	 *
	 * @param applicationId - The ID of the application
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-application-emojis}
	 */
	async listApplicationEmojis(applicationId: string): Promise<ListApplicationEmojisResponse> {
		return this.rest.get(`/applications/${applicationId}/emojis`);
	}

	/**
	 * Returns an emoji object for the given application and emoji IDs.
	 *
	 * @param applicationId - The ID of the application
	 * @param emojiId - The ID of the emoji
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-application-emoji}
	 */
	async getApplicationEmoji(applicationId: string, emojiId: string): Promise<Emoji> {
		return this.rest.get(`/applications/${applicationId}/emojis/${emojiId}`);
	}

	/**
	 * Create a new emoji for the application.
	 *
	 * @param applicationId - The ID of the application
	 * @param params - The parameters for creating the emoji
	 * @see {@link https://discord.com/developers/docs/resources/emoji#create-application-emoji}
	 */
	async createApplicationEmoji(applicationId: string, params: CreateApplicationEmojiParams): Promise<Emoji> {
		return this.rest.post(`/applications/${applicationId}/emojis`, { body: params });
	}

	/**
	 * Modify the given application emoji.
	 *
	 * @param applicationId - The ID of the application
	 * @param emojiId - The ID of the emoji
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-application-emoji}
	 */
	async modifyApplicationEmoji(
		applicationId: string,
		emojiId: string,
		params: ModifyApplicationEmojiParams,
	): Promise<Emoji> {
		return this.rest.patch(`/applications/${applicationId}/emojis/${emojiId}`, { body: params });
	}

	/**
	 * Delete the given application emoji.
	 *
	 * @param applicationId - The ID of the application
	 * @param emojiId - The ID of the emoji
	 * @see {@link https://discord.com/developers/docs/resources/emoji#delete-application-emoji}
	 */
	async deleteApplicationEmoji(applicationId: string, emojiId: string): Promise<void> {
		return this.rest.delete(`/applications/${applicationId}/emojis/${emojiId}`);
	}
}
