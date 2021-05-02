import {GroupWithOwner} from './group';
import {UserSimple} from './userType';

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
export interface InviteUser {
  /**
   * The data of the invited user.
   */
  User: UserSimple;
}

/**
 * Group data for invites.
 */
export interface InviteGroup {
  /**
   * Group of the invite.
   */
  Group: GroupWithOwner;
}

/**
 * Data of the sender of the invite.
 */
export interface InviteSender {
  /**
   * Invite sender.
   */
  InviteSender: UserSimple;
}

/**
 * Invites which include the user and the invite sender.
 */
export type InviteWithUserAndInviteSender = Invite & InviteUser & InviteSender;

/**
 * Invite which includes the group and the invite sender data.
 */
export type InviteWithGroupAndInviteSender = Invite &
InviteGroup &
InviteSender;
