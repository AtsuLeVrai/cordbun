import type { REST } from "../rest/index.js";
import type { Emoji } from "./emojis.js";
import type { Message } from "./messages.js";
import type { User } from "./users.js";
import type { PaginationParams } from "./utils.js";

/**
 * Layout types for polls.
 * @see {@link https://discord.com/developers/docs/resources/poll#layout-type}
 */
export enum PollLayoutType {
	/** The default layout type */
	Default = 1,
}

/**
 * Poll media object backing both questions and answers.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-media-object}
 */
export interface PollMedia {
	/** The text of the field */
	text?: string;
	/** The emoji of the field */
	emoji?: Partial<Emoji>;
}

/**
 * Represents an answer in a poll.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-answer-object}
 */
export interface PollAnswer {
	/** The ID of the answer (only sent in responses) */
	answer_id?: number;
	/** The data of the answer */
	poll_media: PollMedia;
}

/**
 * Represents the vote count for an answer.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-results-object-poll-answer-count-object-structure}
 */
export interface PollAnswerCount {
	/** The answer_id */
	id: number;
	/** The number of votes for this answer */
	count: number;
	/** Whether the current user voted for this answer */
	me_voted: boolean;
}

/**
 * Contains the number of votes for each answer.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-results-object}
 */
export interface PollResults {
	/** Whether the votes have been precisely counted */
	is_finalized: boolean;
	/** The counts for each answer */
	answer_counts: PollAnswerCount[];
}

/**
 * Represents a poll.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-object}
 */
export interface Poll {
	/** The question of the poll */
	question: PollMedia;
	/** Each of the answers available in the poll */
	answers: PollAnswer[];
	/** The time when the poll ends */
	expiry: string | null;
	/** Whether a user can select multiple answers */
	allow_multiselect: boolean;
	/** The layout type of the poll */
	layout_type: PollLayoutType;
	/** The results of the poll */
	results?: PollResults;
}

/**
 * Request object used when creating a poll.
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-create-request-object}
 */
export type PollCreateRequest = Pick<Poll, "question" | "answers"> &
	Partial<Pick<Poll, "allow_multiselect" | "layout_type">> & {
		/** Number of hours the poll should be open for, up to 32 days (defaults to 24) */
		duration?: number;
	};

/**
 * Query parameters for getting answer voters.
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-query-string-params}
 */
export type GetAnswerVotersParams = Omit<PaginationParams, "before">;

/**
 * Response from getting answer voters.
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-response-body}
 */
export interface GetAnswerVotersResponse {
	/** Users who voted for this answer */
	users: User[];
}

/**
 * API methods for interacting with Discord polls.
 * @see {@link https://discord.com/developers/docs/resources/poll}
 */
export class PollsAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Get a list of users that voted for this specific answer.
	 *
	 * @param channelId - The ID of the channel
	 * @param messageId - The ID of the message containing the poll
	 * @param answerId - The ID of the answer
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters}
	 */
	async getAnswerVoters(
		channelId: string,
		messageId: string,
		answerId: number,
		params: GetAnswerVotersParams = {},
	): Promise<GetAnswerVotersResponse> {
		return this.rest.get(`/channels/${channelId}/polls/${messageId}/answers/${answerId}`, { query: params });
	}

	/**
	 * Immediately ends the poll. You cannot end polls from other users.
	 * Fires a Message Update Gateway event.
	 *
	 * @param channelId - The ID of the channel
	 * @param messageId - The ID of the message containing the poll
	 * @see {@link https://discord.com/developers/docs/resources/poll#end-poll}
	 */
	async end(channelId: string, messageId: string): Promise<Message> {
		return this.rest.post(`/channels/${channelId}/polls/${messageId}/expire`);
	}
}
