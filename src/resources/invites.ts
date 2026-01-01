import type { REST } from "../rest/index.js";
import type { Application } from "./applications.js";
import type { Channel } from "./channels.js";
import type { GuildScheduledEvent } from "./guild-scheduled-events.js";
import type { Guild, GuildMember } from "./guilds.js";
import type { User } from "./users.js";

/**
 * Types of invites.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-types}
 */
export enum InviteType {
	/** Invite to a guild */
	Guild = 0,
	/** Invite to a group DM */
	GroupDm = 1,
	/** Invite to add a friend */
	Friend = 2,
}

/**
 * Target types for voice channel invites.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
 */
export enum InviteTargetType {
	/** Invite targets a stream */
	Stream = 1,
	/** Invite targets an embedded application */
	EmbeddedApplication = 2,
}

/**
 * Flags for guild invites.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-guild-invite-flags}
 */
export enum GuildInviteFlags {
	/** This invite is a guest invite for a voice channel */
	IsGuestInvite = 1 << 0,
}

/**
 * Represents a code that when used, adds a user to a guild or group DM channel.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-object}
 */
export interface Invite {
	/** The type of invite */
	type: InviteType;
	/** The invite code (unique ID) */
	code: string;
	/** The guild this invite is for */
	guild?: Partial<Guild>;
	/** The channel this invite is for */
	channel: Partial<Channel> | null;
	/** The user who created the invite */
	inviter?: User;
	/** The type of target for this voice channel invite */
	target_type?: InviteTargetType;
	/** The user whose stream to display for this voice channel stream invite */
	target_user?: User;
	/** The embedded application to open for this voice channel embedded application invite */
	target_application?: Partial<Application>;
	/** Approximate count of online members */
	approximate_presence_count?: number;
	/** Approximate count of total members */
	approximate_member_count?: number;
	/** The expiration date of this invite */
	expires_at: string | null;
	/** Guild scheduled event data */
	guild_scheduled_event?: GuildScheduledEvent;
	/** Guild invite flags */
	flags?: GuildInviteFlags;
}

/**
 * Extra information about an invite.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-metadata-object}
 */
export interface InviteMetadata {
	/** Number of times this invite has been used */
	uses: number;
	/** Max number of times this invite can be used */
	max_uses: number;
	/** Duration (in seconds) after which the invite expires */
	max_age: number;
	/** Whether this invite only grants temporary membership */
	temporary: boolean;
	/** When this invite was created */
	created_at: string;
}

/**
 * @deprecated
 * Invite stage instance structure.
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-stage-instance-object}
 */
export interface InviteStageInstance {
	/** The members speaking in the Stage */
	members: Partial<GuildMember>[];
	/** The number of users in the Stage */
	participant_count: number;
	/** The number of users speaking in the Stage */
	speaker_count: number;
	/** The topic of the Stage instance (1-120 characters) */
	topic: string;
}

/**
 * Query parameters for getting an invite.
 * @see {@link https://discord.com/developers/docs/resources/invite#get-invite-query-string-params}
 */
export interface GetInviteParams {
	[key: string]: string | number | boolean | undefined;
	/** Whether the invite should contain approximate member counts */
	with_counts?: boolean;
	/** The guild scheduled event to include with the invite */
	guild_scheduled_event_id?: string;
}

/**
 * API methods for interacting with Discord invites.
 * @see {@link https://discord.com/developers/docs/resources/invite}
 */
export class InvitesAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns an invite object for the given code.
	 *
	 * @param code - The invite code
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/invite#get-invite}
	 */
	async get(code: string, params: GetInviteParams = {}): Promise<Invite> {
		return this.rest.get(`/invites/${code}`, { query: params });
	}

	/**
	 * Delete an invite.
	 * Requires the `MANAGE_CHANNELS` permission on the channel this invite belongs to,
	 * or `MANAGE_GUILD` to remove any invite across the guild.
	 * Fires an Invite Delete Gateway event.
	 *
	 * @param code - The invite code
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/invite#delete-invite}
	 */
	async delete(code: string, reason?: string): Promise<Invite> {
		return this.rest.delete(`/invites/${code}`, reason ? { reason } : {});
	}
}
