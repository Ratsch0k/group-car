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
