import type { User } from "./users.js";

/**
 * Roles that can be assigned to team members.
 * Each role inherits the access of those below it.
 * @see {@link https://discord.com/developers/docs/topics/teams#team-member-roles-team-member-role-types}
 */
export enum TeamMemberRole {
	Admin = "admin",
	Developer = "developer",
	ReadOnly = "read_only",
}

/**
 * Membership state of a team member.
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum}
 */
export enum MembershipState {
	/** User has been invited to the team but has not yet accepted */
	Invited = 1,
	/** User has accepted the team invitation */
	Accepted = 2,
}

/**
 * Represents a member of a team.
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-team-member-object}
 */
export interface TeamMember {
	/** User's membership state on the team */
	membership_state: MembershipState;
	/** ID of the parent team of which they are a member */
	team_id: string;
	/** Avatar, discriminator, ID, and username of the user */
	user: Partial<User>;
	/** Role of the team member */
	role: TeamMemberRole;
}

/**
 * Represents a team in Discord.
 * Teams are groups of developers who want to collaborate and share access to an app's configuration, management, and payout settings.
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-team-object}
 */
export interface Team {
	/** Hash of the image of the team's icon */
	icon: string | null;
	/** Unique ID of the team */
	id: string;
	/** Members of the team */
	members: TeamMember[];
	/** Name of the team */
	name: string;
	/** User ID of the current team owner */
	owner_user_id: string;
}
