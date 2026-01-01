import type { REST } from "../rest/index.js";

/**
 * Privacy level of a Stage instance.
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level}
 */
export enum StagePrivacyLevel {
	/** @deprecated The Stage instance is visible publicly */
	Public = 1,
	/** The Stage instance is visible to only guild members */
	GuildOnly = 2,
}

/**
 * Represents a Stage instance.
 * A Stage Instance holds information about a live stage.
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-stage-instance-structure}
 */
export interface StageInstance {
	/** The ID of this Stage instance */
	id: string;
	/** The guild ID of the associated Stage channel */
	guild_id: string;
	/** The ID of the associated Stage channel */
	channel_id: string;
	/** The topic of the Stage instance (1-120 characters) */
	topic: string;
	/** The privacy level of the Stage instance */
	privacy_level: StagePrivacyLevel;
	/** @deprecated Whether or not Stage Discovery is disabled */
	discoverable_disabled: boolean;
	/** The ID of the scheduled event for this Stage instance */
	guild_scheduled_event_id: string | null;
}

/**
 * Parameters for creating a Stage instance.
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#create-stage-instance-json-params}
 */
export type CreateStageInstanceParams = Pick<StageInstance, "channel_id" | "topic"> &
	Partial<Pick<StageInstance, "privacy_level" | "guild_scheduled_event_id">> & {
		/** Notify @everyone that a Stage instance has started (requires MENTION_EVERYONE permission) */
		send_start_notification?: boolean;
	};

/**
 * Parameters for modifying a Stage instance.
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance-json-params}
 */
export type ModifyStageInstanceParams = Partial<Pick<StageInstance, "topic" | "privacy_level">>;

/**
 * API methods for interacting with Discord Stage instances.
 * @see {@link https://discord.com/developers/docs/resources/stage-instance}
 */
export class StageInstancesAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Creates a new Stage instance associated to a Stage channel.
	 * Requires the user to be a moderator of the Stage channel.
	 * Fires a Stage Instance Create Gateway event.
	 *
	 * @param params - The parameters for creating the Stage instance
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#create-stage-instance}
	 */
	async create(params: CreateStageInstanceParams, reason?: string): Promise<StageInstance> {
		return this.rest.post("/stage-instances", {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Gets the Stage instance associated with the Stage channel, if it exists.
	 *
	 * @param channelId - The ID of the Stage channel
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 */
	async get(channelId: string): Promise<StageInstance> {
		return this.rest.get(`/stage-instances/${channelId}`);
	}

	/**
	 * Updates fields of an existing Stage instance.
	 * Requires the user to be a moderator of the Stage channel.
	 * Fires a Stage Instance Update Gateway event.
	 *
	 * @param channelId - The ID of the Stage channel
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance}
	 */
	async modify(channelId: string, params: ModifyStageInstanceParams, reason?: string): Promise<StageInstance> {
		return this.rest.patch(`/stage-instances/${channelId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Deletes the Stage instance.
	 * Requires the user to be a moderator of the Stage channel.
	 * Fires a Stage Instance Delete Gateway event.
	 *
	 * @param channelId - The ID of the Stage channel
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance}
	 */
	async delete(channelId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/stage-instances/${channelId}`, reason ? { reason } : {});
	}
}
