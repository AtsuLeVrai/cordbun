import type { REST } from "../rest/index.js";
import type { GuildMember } from "./guilds.js";
import type { User } from "./users.js";
import type { PaginationWithMemberParams } from "./utils.js";

/**
 * Privacy level of a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level}
 */
export enum GuildScheduledEventPrivacyLevel {
	/** The scheduled event is only accessible to guild members */
	GuildOnly = 2,
}

/**
 * Entity types for guild scheduled events.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types}
 */
export enum GuildScheduledEventEntityType {
	/** Event takes place in a Stage channel */
	StageInstance = 1,
	/** Event takes place in a Voice channel */
	Voice = 2,
	/** Event takes place at an external location */
	External = 3,
}

/**
 * Status of a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status}
 */
export enum GuildScheduledEventStatus {
	/** Event is scheduled */
	Scheduled = 1,
	/** Event is currently active */
	Active = 2,
	/** Event has completed */
	Completed = 3,
	/** Event was canceled */
	Canceled = 4,
}

/**
 * Frequency of a recurrence rule.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-frequency}
 */
export enum GuildScheduledEventRecurrenceRuleFrequency {
	Yearly = 0,
	Monthly = 1,
	Weekly = 2,
	Daily = 3,
}

/**
 * Weekday for a recurrence rule.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-weekday}
 */
export enum GuildScheduledEventRecurrenceRuleWeekday {
	Monday = 0,
	Tuesday = 1,
	Wednesday = 2,
	Thursday = 3,
	Friday = 4,
	Saturday = 5,
	Sunday = 6,
}

/**
 * Month for a recurrence rule.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-month}
 */
export enum GuildScheduledEventRecurrenceRuleMonth {
	January = 1,
	February = 2,
	March = 3,
	April = 4,
	May = 5,
	June = 6,
	July = 7,
	August = 8,
	September = 9,
	October = 10,
	November = 11,
	December = 12,
}

/**
 * Entity metadata for a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-metadata}
 */
export interface GuildScheduledEventEntityMetadata {
	/** Location of the event (1-100 characters, required for EXTERNAL events) */
	location?: string;
}

/**
 * N-weekday structure for recurrence rules.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-nweekday-structure}
 */
export interface GuildScheduledEventRecurrenceRuleNWeekday {
	/** The week to reoccur on (1-5) */
	n: number;
	/** The day within the week to reoccur on */
	day: GuildScheduledEventRecurrenceRuleWeekday;
}

/**
 * Recurrence rule for a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object}
 */
export interface GuildScheduledEventRecurrenceRule {
	/** Starting time of the recurrence interval */
	start: string;
	/** Ending time of the recurrence interval */
	end: string | null;
	/** How often the event occurs */
	frequency: GuildScheduledEventRecurrenceRuleFrequency;
	/** The spacing between the events, defined by frequency */
	interval: number;
	/** Set of specific days within a week for the event to recur on */
	by_weekday: GuildScheduledEventRecurrenceRuleWeekday[] | null;
	/** List of specific days within a specific week (1-5) to recur on */
	by_n_weekday: GuildScheduledEventRecurrenceRuleNWeekday[] | null;
	/** Set of specific months to recur on */
	by_month: GuildScheduledEventRecurrenceRuleMonth[] | null;
	/** Set of specific dates within a month to recur on */
	by_month_day: number[] | null;
	/** Set of days within a year to recur on (1-364) */
	by_year_day: number[] | null;
	/** The total amount of times that the event is allowed to recur before stopping */
	count: number | null;
}

/**
 * Represents a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object}
 */
export interface GuildScheduledEvent {
	/** The ID of the scheduled event */
	id: string;
	/** The guild ID which the scheduled event belongs to */
	guild_id: string;
	/** The channel ID in which the scheduled event will be hosted, or null if entity_type is EXTERNAL */
	channel_id: string | null;
	/** The ID of the user that created the scheduled event */
	creator_id?: string | null;
	/** The name of the scheduled event (1-100 characters) */
	name: string;
	/** The description of the scheduled event (1-1000 characters) */
	description?: string | null;
	/** The time the scheduled event will start */
	scheduled_start_time: string;
	/** The time the scheduled event will end, required if entity_type is EXTERNAL */
	scheduled_end_time: string | null;
	/** The privacy level of the scheduled event */
	privacy_level: GuildScheduledEventPrivacyLevel;
	/** The status of the scheduled event */
	status: GuildScheduledEventStatus;
	/** The type of the scheduled event */
	entity_type: GuildScheduledEventEntityType;
	/** The ID of an entity associated with a guild scheduled event */
	entity_id: string | null;
	/** Additional metadata for the guild scheduled event */
	entity_metadata: GuildScheduledEventEntityMetadata | null;
	/** The user that created the scheduled event */
	creator?: User;
	/** The number of users subscribed to the scheduled event */
	user_count?: number;
	/** The cover image hash of the scheduled event */
	image?: string | null;
	/** The definition for how often this event should recur */
	recurrence_rule: GuildScheduledEventRecurrenceRule | null;
}

/**
 * Represents a user subscribed to a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-user-object}
 */
export interface GuildScheduledEventUser {
	/** The scheduled event ID which the user subscribed to */
	guild_scheduled_event_id: string;
	/** User which subscribed to an event */
	user: User;
	/** Guild member data for this user for the guild which this event belongs to, if any */
	member?: GuildMember;
}

/**
 * Query parameters for listing scheduled events.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild-query-string-params}
 */
export interface ListScheduledEventsParams {
	/** Include number of users subscribed to each event */
	with_user_count?: boolean;

	[key: string]: string | number | boolean | undefined;
}

/**
 * Parameters for creating a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event-json-params}
 */
export type CreateGuildScheduledEventParams = Pick<
	GuildScheduledEvent,
	"name" | "privacy_level" | "scheduled_start_time" | "entity_type"
> &
	Partial<
		Pick<
			GuildScheduledEvent,
			"channel_id" | "entity_metadata" | "scheduled_end_time" | "description" | "image" | "recurrence_rule"
		>
	>;

/**
 * Parameters for modifying a guild scheduled event.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#modify-guild-scheduled-event-json-params}
 */
export type ModifyGuildScheduledEventParams = Partial<
	Pick<
		GuildScheduledEvent,
		| "channel_id"
		| "entity_metadata"
		| "name"
		| "privacy_level"
		| "scheduled_start_time"
		| "scheduled_end_time"
		| "description"
		| "entity_type"
		| "status"
		| "image"
		| "recurrence_rule"
	>
>;

/**
 * Query parameters for getting guild scheduled event users.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users-query-string-params}
 */
export type GetGuildScheduledEventUsersParams = PaginationWithMemberParams;

/**
 * API methods for interacting with Discord guild scheduled events.
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event}
 */
export class GuildScheduledEventsAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns a list of guild scheduled event objects for the given guild.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild}
	 */
	async list(guildId: string, params: ListScheduledEventsParams = {}): Promise<GuildScheduledEvent[]> {
		return this.rest.get(`/guilds/${guildId}/scheduled-events`, { query: params });
	}

	/**
	 * Create a guild scheduled event in the guild.
	 * Fires a Guild Scheduled Event Create Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the event
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event}
	 */
	async create(
		guildId: string,
		params: CreateGuildScheduledEventParams,
		reason?: string,
	): Promise<GuildScheduledEvent> {
		return this.rest.post(`/guilds/${guildId}/scheduled-events`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Get a guild scheduled event.
	 *
	 * @param guildId - The ID of the guild
	 * @param eventId - The ID of the scheduled event
	 * @param withUserCount - Include number of users subscribed to this event
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event}
	 */
	async get(guildId: string, eventId: string, withUserCount?: boolean): Promise<GuildScheduledEvent> {
		return this.rest.get(`/guilds/${guildId}/scheduled-events/${eventId}`, {
			...(withUserCount !== undefined && { query: { with_user_count: withUserCount } }),
		});
	}

	/**
	 * Modify a guild scheduled event.
	 * Fires a Guild Scheduled Event Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param eventId - The ID of the scheduled event
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#modify-guild-scheduled-event}
	 */
	async modify(
		guildId: string,
		eventId: string,
		params: ModifyGuildScheduledEventParams,
		reason?: string,
	): Promise<GuildScheduledEvent> {
		return this.rest.patch(`/guilds/${guildId}/scheduled-events/${eventId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Delete a guild scheduled event.
	 * Fires a Guild Scheduled Event Delete Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param eventId - The ID of the scheduled event
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#delete-guild-scheduled-event}
	 */
	async delete(guildId: string, eventId: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/scheduled-events/${eventId}`);
	}

	/**
	 * Get a list of guild scheduled event users subscribed to a guild scheduled event.
	 *
	 * @param guildId - The ID of the guild
	 * @param eventId - The ID of the scheduled event
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users}
	 */
	async getUsers(
		guildId: string,
		eventId: string,
		params: GetGuildScheduledEventUsersParams = {},
	): Promise<GuildScheduledEventUser[]> {
		return this.rest.get(`/guilds/${guildId}/scheduled-events/${eventId}/users`, { query: params });
	}
}
