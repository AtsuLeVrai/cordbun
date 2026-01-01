import type { REST } from "../rest/index.js";
import type { User } from "./users.js";
import type { PartialWithNullable } from "./utils.js";

/**
 * Types of stickers.
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types}
 */
export enum StickerType {
	/** An official sticker in a pack */
	Standard = 1,
	/** A sticker uploaded to a guild for the guild's members */
	Guild = 2,
}

/**
 * Format types for stickers.
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types}
 */
export enum StickerFormatType {
	Png = 1,
	Apng = 2,
	Lottie = 3,
	Gif = 4,
}

/**
 * Represents a sticker that can be sent in messages.
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
 */
export interface Sticker {
	/** ID of the sticker */
	id: string;
	/** For standard stickers, ID of the pack the sticker is from */
	pack_id?: string;
	/** Name of the sticker */
	name: string;
	/** Description of the sticker */
	description: string | null;
	/** Autocomplete/suggestion tags for the sticker (max 200 characters) */
	tags: string;
	/** Type of sticker */
	type: StickerType;
	/** Type of sticker format */
	format_type: StickerFormatType;
	/** Whether this guild sticker can be used */
	available?: boolean;
	/** ID of the guild that owns this sticker */
	guild_id?: string;
	/** The user that uploaded the guild sticker */
	user?: User;
	/** The standard sticker's sort order within its pack */
	sort_value?: number;
}

/**
 * The smallest amount of data required to render a sticker.
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-item-object}
 */
export type StickerItem = Pick<Sticker, "id" | "name" | "format_type">;

/**
 * Represents a pack of standard stickers.
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-pack-object}
 */
export interface StickerPack {
	/** ID of the sticker pack */
	id: string;
	/** The stickers in the pack */
	stickers: Sticker[];
	/** Name of the sticker pack */
	name: string;
	/** ID of the pack's SKU */
	sku_id: string;
	/** ID of a sticker in the pack which is shown as the pack's icon */
	cover_sticker_id?: string;
	/** Description of the sticker pack */
	description: string;
	/** ID of the sticker pack's banner image */
	banner_asset_id?: string;
}

/**
 * Response from listing sticker packs.
 * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs-response-structure}
 */
export interface ListStickerPacksResponse {
	/** Array of sticker pack objects */
	sticker_packs: StickerPack[];
}

/**
 * Parameters for creating a guild sticker.
 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker-form-params}
 */
export type CreateGuildStickerParams = Pick<Sticker, "name" | "tags"> & {
	/** Description of the sticker (empty or 2-100 characters) */
	description: string;
	/** The sticker file to upload */
	file: Blob;
};

/**
 * Parameters for modifying a guild sticker.
 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker-json-params}
 */
export type ModifyGuildStickerParams = PartialWithNullable<
	Pick<Sticker, "name" | "description" | "tags">,
	"description"
>;

/**
 * API methods for interacting with Discord stickers.
 * @see {@link https://discord.com/developers/docs/resources/sticker}
 */
export class StickersAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns a sticker object for the given sticker ID.
	 *
	 * @param stickerId - The ID of the sticker
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 */
	async get(stickerId: string): Promise<Sticker> {
		return this.rest.get(`/stickers/${stickerId}`);
	}

	/**
	 * Returns a list of available sticker packs.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs}
	 */
	async listPacks(): Promise<ListStickerPacksResponse> {
		return this.rest.get("/sticker-packs");
	}

	/**
	 * Returns a sticker pack object for the given sticker pack ID.
	 *
	 * @param packId - The ID of the sticker pack
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack}
	 */
	async getPack(packId: string): Promise<StickerPack> {
		return this.rest.get(`/sticker-packs/${packId}`);
	}

	/**
	 * Returns an array of sticker objects for the given guild.
	 *
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
	 */
	async listGuildStickers(guildId: string): Promise<Sticker[]> {
		return this.rest.get(`/guilds/${guildId}/stickers`);
	}

	/**
	 * Returns a sticker object for the given guild and sticker IDs.
	 *
	 * @param guildId - The ID of the guild
	 * @param stickerId - The ID of the sticker
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
	 */
	async getGuildSticker(guildId: string, stickerId: string): Promise<Sticker> {
		return this.rest.get(`/guilds/${guildId}/stickers/${stickerId}`);
	}

	/**
	 * Create a new sticker for the guild.
	 * Requires the `CREATE_GUILD_EXPRESSIONS` permission.
	 * Fires a Guild Stickers Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the sticker
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
	 */
	async createGuildSticker(guildId: string, params: CreateGuildStickerParams, reason?: string): Promise<Sticker> {
		const formData = new FormData();
		formData.append("name", params.name);
		formData.append("description", params.description);
		formData.append("tags", params.tags);
		formData.append("file", params.file);

		return this.rest.post(`/guilds/${guildId}/stickers`, {
			body: formData,
			...(reason && { reason }),
		});
	}

	/**
	 * Modify the given sticker.
	 * Fires a Guild Stickers Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param stickerId - The ID of the sticker
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker}
	 */
	async modifyGuildSticker(
		guildId: string,
		stickerId: string,
		params: ModifyGuildStickerParams,
		reason?: string,
	): Promise<Sticker> {
		return this.rest.patch(`/guilds/${guildId}/stickers/${stickerId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Delete the given sticker.
	 * Fires a Guild Stickers Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param stickerId - The ID of the sticker
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
	 */
	async deleteGuildSticker(guildId: string, stickerId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/stickers/${stickerId}`, reason ? { reason } : {});
	}
}
