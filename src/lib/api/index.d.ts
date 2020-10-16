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
 * Group data for invites.
 */
export interface InviteGroup {
  /**
   * Group of the invite.
   */
  Group: GroupWithOwner;
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
