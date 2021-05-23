import {UserSimple, InviteWithUserAndInviteSender} from 'lib';

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
 * Group owner.
 */
export interface GroupOwner {
  /**
   * The user data of the owner.
   */
  Owner: UserSimple;
}

/**
 * Group data which also contains user data of the owner.
 */
export type GroupWithOwner = Group & GroupOwner;

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
 * The possible colors of a car.
 */
export enum CarColor {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
  Black = 'Black',
  Yellow = 'Yellow',
  White = 'White',
  Purple = 'Purple',
  Brown = 'Brown',
  Orange = 'Orange',
}

/**
 * A car of a group.
 */
export interface Car {
  /**
   * The id of the car within the group.
   */
  carId: number;

  /**
   * The id of the group to which this car belongs.
   */
  groupId: number;

  /**
   * The name.
   */
  name: string;

  /**
   * The assigned color.
   */
  color: CarColor;

  /**
   * When this car was created.
   */
  createdAt: Date;

  /**
   * When this car was last updated.
   */
  updatedAt: Date;

  /**
   * The id of the driver if this car has
   * a driver.
   *
   * If this is a `number`, the attributes
   * `latitude` and `longitude` should be `null`.
   */
  driverId: number | null;

  /**
   * Latitude of the parked location
   * if this car is currently parked.
   *
   * If this is a `number`, the attribute `driverId`
   * should be `null`.
   * Only exception is when new and no user
   * drove it yet.
   */
  latitude: number | null;

  /**
   * Longitude of the parked location
   * if this car is currently parked.
   *
   * If this is a `number`, the attribute `driverId`
   * should be `null`.
   * Only exception is when new and no user
   * drove it yet.
   */
  longitude: number | null;
}

/**
 * Driver of a car.
 */
export interface CarDriver {
  /**
   * The user data of the driver if they exist.
   */
  Driver: UserSimple | null;
}

/**
 * Car which also contains user data of the driver if one exists.
 */
export type CarWithDriver = Car & CarDriver;

/**
 * Group members.
 */
export interface GroupMembers {
  /**
   * List of members of a group.
   */
  members: Member[];
}

/**
 * Group invites.
 */
export interface GroupInvites {
  /**
   * List of invites.
   */
  invites: InviteWithUserAndInviteSender[];
}

/**
 * Group cars.
 */
export interface GroupCars {
  /**
   * List of cars of a group.
   */
  cars: CarWithDriver[];
}

/**
 * Group with data of the owner and the list of cars.
 */
export type GroupWithOwnerAndCars = Group & GroupOwner & GroupCars;

/**
 * Extension of the group which includes the list of members and
 * invites and data of the owner.
 */
export type GroupWithOwnerAndMembersAndInvites = Group &
GroupOwner &
GroupMembers &
GroupInvites;

/**
 * Group with owner, list of member, list of invites and list of cars.
 */
export type GroupWithOwnerAndMembersAndInvitesAndCars = Group &
GroupOwner &
GroupMembers &
GroupInvites &
GroupCars;
