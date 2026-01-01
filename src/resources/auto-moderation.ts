import type { REST } from "../rest/index.js";

/**
 * Trigger types for auto moderation rules.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types}
 */
export enum AutoModerationTriggerType {
	/** Check if content contains words from a user defined list of keywords */
	Keyword = 1,
	/** Check if content represents generic spam */
	Spam = 3,
	/** Check if content contains words from internal pre-defined wordsets */
	KeywordPreset = 4,
	/** Check if content contains more unique mentions than allowed */
	MentionSpam = 5,
	/** Check if member profile contains words from a user defined list of keywords */
	MemberProfile = 6,
}

/**
 * Event types for auto moderation rules.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types}
 */
export enum AutoModerationEventType {
	/** When a member sends or edits a message in the guild */
	MessageSend = 1,
	/** When a member edits their profile */
	MemberUpdate = 2,
}

/**
 * Keyword preset types for auto moderation.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types}
 */
export enum AutoModerationKeywordPresetType {
	/** Words that may be considered forms of swearing or cursing */
	Profanity = 1,
	/** Words that refer to sexually explicit behavior or activity */
	SexualContent = 2,
	/** Personal insults or words that may be considered hate speech */
	Slurs = 3,
}

/**
 * Action types for auto moderation rules.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types}
 */
export enum AutoModerationActionType {
	/** Blocks a member's message and prevents it from being posted */
	BlockMessage = 1,
	/** Logs user content to a specified channel */
	SendAlertMessage = 2,
	/** Timeout user for a specified duration */
	Timeout = 3,
	/** Prevents a member from using text, voice, or other interactions */
	BlockMemberInteraction = 4,
}

/**
 * Trigger metadata for auto moderation rules.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata}
 */
export interface AutoModerationTriggerMetadata {
	/** Substrings which will be searched for in content (max 1000) */
	keyword_filter?: string[];
	/** Regular expression patterns which will be matched against content (max 10) */
	regex_patterns?: string[];
	/** The internally pre-defined wordsets which will be searched for in content */
	presets?: AutoModerationKeywordPresetType[];
	/** Substrings which should not trigger the rule (max 100 or 1000) */
	allow_list?: string[];
	/** Total number of unique role and user mentions allowed per message (max 50) */
	mention_total_limit?: number;
	/** Whether to automatically detect mention raids */
	mention_raid_protection_enabled?: boolean;
}

/**
 * Action metadata for auto moderation actions.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-metadata}
 */
export interface AutoModerationActionMetadata {
	/** Channel to which user content should be logged */
	channel_id?: string;
	/** Timeout duration in seconds (max 2419200) */
	duration_seconds?: number;
	/** Additional explanation shown to members when their message is blocked (max 150 chars) */
	custom_message?: string;
}

/**
 * An action which will execute whenever a rule is triggered.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object}
 */
export interface AutoModerationAction {
	/** The type of action */
	type: AutoModerationActionType;
	/** Additional metadata needed during execution for this specific action type */
	metadata?: AutoModerationActionMetadata;
}

/**
 * Represents an auto moderation rule.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object}
 */
export interface AutoModerationRule {
	/** The ID of this rule */
	id: string;
	/** The ID of the guild which this rule belongs to */
	guild_id: string;
	/** The rule name */
	name: string;
	/** The user which first created this rule */
	creator_id: string;
	/** The rule event type */
	event_type: AutoModerationEventType;
	/** The rule trigger type */
	trigger_type: AutoModerationTriggerType;
	/** The rule trigger metadata */
	trigger_metadata: AutoModerationTriggerMetadata;
	/** The actions which will execute when the rule is triggered */
	actions: AutoModerationAction[];
	/** Whether the rule is enabled */
	enabled: boolean;
	/** The role IDs that should not be affected by the rule (max 20) */
	exempt_roles: string[];
	/** The channel IDs that should not be affected by the rule (max 50) */
	exempt_channels: string[];
}

/**
 * Parameters for creating an auto moderation rule.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule-json-params}
 */
export type CreateAutoModerationRuleParams = Pick<
	AutoModerationRule,
	"name" | "event_type" | "trigger_type" | "actions"
> &
	Partial<Pick<AutoModerationRule, "trigger_metadata" | "enabled" | "exempt_roles" | "exempt_channels">>;

/**
 * Parameters for modifying an auto moderation rule.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule-json-params}
 */
export type ModifyAutoModerationRuleParams = Partial<
	Pick<
		AutoModerationRule,
		"name" | "event_type" | "trigger_metadata" | "actions" | "enabled" | "exempt_roles" | "exempt_channels"
	>
>;

/**
 * API methods for interacting with Discord auto moderation.
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation}
 */
export class AutoModerationAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Get a list of all rules currently configured for the guild.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild}
	 */
	async list(guildId: string): Promise<AutoModerationRule[]> {
		return this.rest.get(`/guilds/${guildId}/auto-moderation/rules`);
	}

	/**
	 * Get a single rule.
	 * Requires the `MANAGE_GUILD` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param ruleId - The ID of the rule
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule}
	 */
	async get(guildId: string, ruleId: string): Promise<AutoModerationRule> {
		return this.rest.get(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`);
	}

	/**
	 * Create a new rule.
	 * Requires the `MANAGE_GUILD` permission.
	 * Fires an Auto Moderation Rule Create Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the rule
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule}
	 */
	async create(
		guildId: string,
		params: CreateAutoModerationRuleParams,
		reason?: string,
	): Promise<AutoModerationRule> {
		return this.rest.post(`/guilds/${guildId}/auto-moderation/rules`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Modify an existing rule.
	 * Requires the `MANAGE_GUILD` permission.
	 * Fires an Auto Moderation Rule Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param ruleId - The ID of the rule
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule}
	 */
	async modify(
		guildId: string,
		ruleId: string,
		params: ModifyAutoModerationRuleParams,
		reason?: string,
	): Promise<AutoModerationRule> {
		return this.rest.patch(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Delete a rule.
	 * Requires the `MANAGE_GUILD` permission.
	 * Fires an Auto Moderation Rule Delete Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param ruleId - The ID of the rule
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule}
	 */
	async delete(guildId: string, ruleId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`, reason ? { reason } : {});
	}
}
