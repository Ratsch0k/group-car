import {CarWithDriver} from 'lib/api';

/**
 * Object structure to which every group action packet conforms to.
 */
export interface TGroupAction<A, D> {
  action: A;
  car: D;
}

/**
 * Data returned by the delete action.
 */
export interface DeleteActionCar {
  groupId: number;
  carId: number;
}

/*
 * Define each possible group action.
 * Due to soe Typescript weirdness, type hinting didn't work when I
 * tries split actions only into **DefaultAction** and **DeleteAction**.
 */
export type DeleteGroupAction = TGroupAction<'delete', DeleteActionCar>;
export type AddGroupAction = TGroupAction<'add', CarWithDriver>;
export type DriveGroupAction = TGroupAction<'drive', CarWithDriver>;
export type ParkGroupAction = TGroupAction<'park', CarWithDriver>;

/**
 * Type of group action.
 */
export type GroupAction = AddGroupAction |
DriveGroupAction |
ParkGroupAction |
DeleteGroupAction;

