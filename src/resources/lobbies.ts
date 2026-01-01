import type { REST } from "../rest/index.js";
import type { Channel } from "./channels.js";

/**
 * Flags for lobby members.
 * @see {@link https://discord.com/developers/docs/resources/lobby#lobby-member-object-lobby-member-flags}
 */
export enum LobbyMemberFlags {
	/** User can link a text channel to a lobby */
	CanLinkLobby = 1 << 0,
}

/**
 * Represents a member of a lobby.
 * @see {@link https://discord.com/developers/docs/resources/lobby#lobby-member-object}
 */
export interface LobbyMember {
	/** The ID of the user */
	id: string;
	/** Dictionary of string key/value pairs (max total length 1000) */
	metadata?: Record<string, string> | null;
	/** Lobby member flags */
	flags?: LobbyMemberFlags;
}

/**
 * Represents a lobby within Discord.
 * @see {@link https://discord.com/developers/docs/resources/lobby#lobby-object}
 */
export interface Lobby {
	/** The ID of this channel */
	id: string;
	/** Application that created the lobby */
	application_id: string;
	/** Dictionary of string key/value pairs (max total length 1000) */
	metadata: Record<string, string> | null;
	/** Members of the lobby */
	members: LobbyMember[];
	/** The guild channel linked to the lobby */
	linked_channel?: Channel;
}

/**
 * Parameters for creating a lobby.
 * @see {@link https://discord.com/developers/docs/resources/lobby#create-lobby-json-params}
 */
export type CreateLobbyParams = Partial<Pick<Lobby, "metadata" | "members">> & {
	/** Seconds to wait before shutting down a lobby after it becomes idle (5-604800) */
	idle_timeout_seconds?: number;
};

/**
 * Parameters for modifying a lobby.
 * @see {@link https://discord.com/developers/docs/resources/lobby#modify-lobby-json-params}
 */
export type ModifyLobbyParams = CreateLobbyParams;

/**
 * Parameters for adding a member to a lobby.
 * @see {@link https://discord.com/developers/docs/resources/lobby#add-a-member-to-a-lobby-json-params}
 */
export type AddLobbyMemberParams = Partial<Pick<LobbyMember, "metadata" | "flags">>;

/**
 * Parameters for linking a channel to a lobby.
 * @see {@link https://discord.com/developers/docs/resources/lobby#link-channel-to-lobby-json-params}
 */
export interface LinkChannelToLobbyParams {
	/** The ID of the channel to link to the lobby */
	channel_id?: string;
}

/**
 * API methods for interacting with Discord lobbies.
 * @see {@link https://discord.com/developers/docs/resources/lobby}
 */
export class LobbiesAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Creates a new lobby, adding any of the specified members to it.
	 *
	 * @param params - The parameters for creating the lobby
	 * @see {@link https://discord.com/developers/docs/resources/lobby#create-lobby}
	 */
	async create(params: CreateLobbyParams = {}): Promise<Lobby> {
		return this.rest.post("/lobbies", { body: params });
	}

	/**
	 * Returns a lobby object for the specified lobby ID.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @see {@link https://discord.com/developers/docs/resources/lobby#get-lobby}
	 */
	async get(lobbyId: string): Promise<Lobby> {
		return this.rest.get(`/lobbies/${lobbyId}`);
	}

	/**
	 * Modifies the specified lobby with new values.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/lobby#modify-lobby}
	 */
	async modify(lobbyId: string, params: ModifyLobbyParams): Promise<Lobby> {
		return this.rest.patch(`/lobbies/${lobbyId}`, { body: params });
	}

	/**
	 * Deletes the specified lobby.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @see {@link https://discord.com/developers/docs/resources/lobby#delete-lobby}
	 */
	async delete(lobbyId: string): Promise<void> {
		return this.rest.delete(`/lobbies/${lobbyId}`);
	}

	/**
	 * Adds a user to the specified lobby, or updates their metadata if already a member.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @param userId - The ID of the user
	 * @param params - The parameters for adding the member
	 * @see {@link https://discord.com/developers/docs/resources/lobby#add-a-member-to-a-lobby}
	 */
	async addMember(lobbyId: string, userId: string, params: AddLobbyMemberParams = {}): Promise<LobbyMember> {
		return this.rest.put(`/lobbies/${lobbyId}/members/${userId}`, { body: params });
	}

	/**
	 * Removes a user from the specified lobby.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @param userId - The ID of the user
	 * @see {@link https://discord.com/developers/docs/resources/lobby#remove-a-member-from-a-lobby}
	 */
	async removeMember(lobbyId: string, userId: string): Promise<void> {
		return this.rest.delete(`/lobbies/${lobbyId}/members/${userId}`);
	}

	/**
	 * Links an existing text channel to a lobby.
	 *
	 * @param lobbyId - The ID of the lobby
	 * @param params - The parameters for linking
	 * @see {@link https://discord.com/developers/docs/resources/lobby#link-channel-to-lobby}
	 */
	async linkChannel(lobbyId: string, params: LinkChannelToLobbyParams = {}): Promise<Lobby> {
		return this.rest.patch(`/lobbies/${lobbyId}/channel-linking`, { body: params });
	}
}
