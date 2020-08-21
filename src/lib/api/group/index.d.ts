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
 * Extension of the group data which contains the data of the owner and
 * a list of members.
 */
export interface GroupWithOwnerAndMembers extends GroupWithOwner {
  /**
   * List of members.
   */
  members: Member[];
}
