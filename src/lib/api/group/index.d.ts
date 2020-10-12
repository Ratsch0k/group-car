import {UserSimple} from 'lib';

/**
 * Data of a group.
 */
export interface Group {
  /**
   * The id of the group.
   */
  id: number;

  /**
   * The name of the group.
   */
  name: string;

  /**
   * The description of the group.
   */
  description: string;

  /**
   * The id of the user who is the owner of the group.
   */
  ownerId: number;

  /**
   * The date and time when the group was created.
   */
  createdAt: Date;

  /**
   * The date and time when the group was last updated.
   */
  updatedAt: Date;
}

/**
 * Extension of the group data which includes the user data of the owner.
 */
export interface GroupWithOwner extends Group {
  /**
   * The user data of the owner.
   */
  Owner: UserSimple;
}

/**
 * Member of a group. Contains the data of the user and whether or not
 * the member is an admin of that group.
 */
export interface Member {
  /**
   * User data.
   */
  User: UserSimple;
  /**
   * Whether or not this member is an admin of the group.
   */
  isAdmin: boolean;
}

/**
 * Extension of the group which includes the list of members and
 * invites and data of the owner.
 */
export interface GroupWithOwnerAndMembersAndInvites extends GroupWithOwner {
  /**
   * All members of the group.
   */
  members: Member[];
  /**
   * All invites of the group.
   */
  invites: InviteWithUserAndInviteSender[];
}

/**
 * The invite of the specified user for the specified group.
 */
export interface Invite {
  /**
   * The id of the user who is invited.
   */
  userId: number;
  /**
   * The id of the group for which this invite is.
   */
  groupId: number;
  /**
   * The date when this invite was created.
   */
  createdAt: Date;
  /**
   * The date when this invite was last updated.
   */
  updatedAt: Date;
  /**
   * The id of the user who created this invite.
   */
  invitedBy: number;
}

/**
 * Extension of the Invite which includes the data of the invited user.
 */
export interface InviteWithUser extends Invite {
  /**
   * The data of the invited user.
   */
  User: UserSimple;
}

/**
 * Extension of the InviteWIthUser which also includes
 * the data of the invite sender.
 */
export interface InviteWithUserAndInviteSender extends InviteWithUser {
  /**
   * The data of the user who created the invite.
   */
  InviteSender: UserSimple;
}
