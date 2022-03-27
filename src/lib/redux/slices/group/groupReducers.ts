import {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {
  CarWithDriver,
  GroupWithOwner,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  InviteWithUserAndInviteSender,
} from '../../../api';
import GroupState from './groupState';
import {User} from '../../../../typings';
import _ from 'lodash';
import {initialState} from './groupSlice';
import groupsAdapter from './groupAdapter';

/**
 * All reducers used for the group slice.
 */

type GroupReducer<T = undefined> = CaseReducer<GroupState, PayloadAction<T>>;

export interface SelectGroupPayload {
  group: GroupWithOwnerAndMembersAndInvitesAndCars;
  force?: boolean;
}

/**
 * Reducer for selecting a group.
 *
 * On default, it will only set the selected group
 * to the parameter if it already exists as a stored group.
 * You can force it to set the selected group to the given
 * one by setting `force` to `true`.
 * @param state State
 * @param group Group to select
 * @param force If true, will set the selected group even if it's not
 *              stored.
 */
export const selectGroupReducer: GroupReducer<SelectGroupPayload> = (
  state,
  {payload: {group, force}},
) => {
  const groupEntity = state.entities[group.id];

  if (force || groupEntity) {
    if (force && !groupEntity) {
      state.ids.push(group.id);
    }

    state.entities[group.id] = group;
    state.selectedGroup = group;
  }
};

/**
 * Reducer that resets the group state to the initial state.
 * @param state State
 */
export const resetGroupReducer: GroupReducer = (state) => {
  state.entities = initialState.entities;
  state.ids = initialState.ids;
  state.loading = initialState.loading;
  state.selectedGroup = initialState.selectedGroup;
};

/**
 * Sets `state.selectedGroup` to the given group.
 * @param state State
 * @param group Group
 */
export const setSelectedGroupReducer:
GroupReducer<GroupWithOwnerAndMembersAndInvitesAndCars> = (
  state,
  {payload: group},
) => {
  state.selectedGroup = group;
};

/**
 * Reducer which updates all groups included in the given list of groups.
 *
 * If one of the groups is the selected one, update it as well.
 * @param state State
 * @param action Action with the list of groups.
 */
export const updateGroupsReducer: GroupReducer<GroupWithOwner[]> = (
  state,
  action,
) => {
  // Update the selected group if one is selected
  // Get the selected group
  const selectedGroup = state.selectedGroup;

  // Check if one is selected
  if (selectedGroup !== null) {
    // Check if the selected is included in tha payload
    const selectedGroupFromData = action.payload
      .find((g)=> g.id === selectedGroup.id);

    // If it doesn't exist on the list, assume the user is not a member
    // anymore and deselect it
    if (!selectedGroupFromData) {
      state.selectedGroup = null;
    } else {
      // Update group
      state.selectedGroup = {
        ...selectedGroup,
        ...selectedGroupFromData,
      };
    }
  }

  // Update the rest of the group
  groupsAdapter.setAll(state, action.payload);
};

/**
 * Reducer to update the given group if it's stored.
 *
 * If the group is the selected one, update that field as well.
 * @param state State
 * @param action Action
 */
export const updateGroupReducer: GroupReducer<GroupWithOwner> = (
  state,
  action,
) => {
  // Get group of store with the id
  const group = state.entities[action.payload.id];

  // Check if a group with that id is stored
  if (group) {
    state.entities[action.payload.id] = action.payload;
  }

  // Check if the selected group is the given group and update it then
  if (state.selectedGroup && state.selectedGroup.id === action.payload.id) {
    state.selectedGroup = {
      ...state.selectedGroup,
      ...action.payload,
    };
  }
};

export interface SetDriverOfCarPayload {
  groupId: number;
  carId: number;
  driver: User;
}

/**
 * Reducer which sets the driver of the given car.
 *
 * The car is only updated if a group is selected.
 * @param state State
 * @param action Action with the payload which includes the
 *               groupId, carId and the driver
 */
export const setDriverOfCarReducer: GroupReducer<SetDriverOfCarPayload> = (
  state,
  action,
) => {
  // Extract values from the payload
  const {groupId, carId, driver} = action.payload;

  // Check if a group is selected
  if (state.selectedGroup) {
    // Check if the car exists in the group
    const index = state.selectedGroup.cars.findIndex((g) =>
      g.groupId === groupId && g.carId === carId);

    if (index !== -1) {
      // The car exists
      // Update appropriate fields
      state.selectedGroup.cars[index].driverId = driver.id;
      state.selectedGroup.cars[index].Driver = {
        username: driver.username,
        id: driver.id,
      };
      state.selectedGroup.cars[index].latitude = null;
      state.selectedGroup.cars[index].longitude = null;
    }
  }
};

export interface SetLocationOfCarPayload {
  groupId: number;
  carId: number;
  latitude: number;
  longitude: number;
}

/**
 * Reducer to set the location of a car.
 *
 * Only works if a car is selected and the car belongs to that group.
 * @param state State
 * @param action Action with the payload which includes
 *               information about the car and its location
 */
export const setLocationOfCarReducer: GroupReducer<SetLocationOfCarPayload> =(
  state,
  action,
) => {
  // Extract values from the payload
  const {groupId, carId, latitude, longitude} = action.payload;

  // Check if a group is selected. Do nothing if none is selected
  if (state.selectedGroup) {
    // Check if the car belongs to the group
    const index = state.selectedGroup.cars.findIndex((g) =>
      g.groupId === groupId && g.carId === carId);

    if (index !== -1) {
      // Car belongs to the group. Set the location and set the driver to null
      state.selectedGroup.cars[index].Driver = null;
      state.selectedGroup.cars[index].driverId = null;
      state.selectedGroup.cars[index].latitude = latitude;
      state.selectedGroup.cars[index].longitude = longitude;
    }
  }
};

/**
 * Reducer to remove the group with the given id.
 *
 * If that group is currently selected, deselect it
 * @param state State
 * @param id Id of the group
 */
export const removeGroupWithIdReducer: GroupReducer<number> = (
  state,
  {payload: id},
) => {
  groupsAdapter.removeOne(state, id);

  // Check if that group is currently selected, deselect it then
  const selectedGroup = state.selectedGroup;
  if (selectedGroup && selectedGroup.id === id) {
    state.selectedGroup = null;
  }
};

/**
 * Reducer to add a car if it belongs to the selected group.
 * @param state State
 * @param action Action
 */
export const addCarReducer: GroupReducer<CarWithDriver> = (
  state,
  action,
) => {
  const car = action.payload;

  /*
   * Check if a group is selected and the car belongs to that group.
   * If true, add the car to the group cars.
   */
  if (
    state.selectedGroup &&
    state.selectedGroup.id === car.groupId &&
    state.selectedGroup.cars.every((c) => c.carId !== car.carId)
  ) {
    state.selectedGroup.cars.push(car);
  }
};

/**
 * Reducer to update a car.
 *
 * A group has to be selected and the car has to
 * belong to that group. Also, the list of cars
 * should already include that car.
 * @param state State
 * @param action Action
 */
export const updateCarReducer: GroupReducer<CarWithDriver> = (
  state,
  action,
) => {
  const car = action.payload;

  // Check if a group is selected and if the car belongs to the group
  if (
    state.selectedGroup &&
    state.selectedGroup.id === car.groupId
  ) {
    // Check if the car is in the list of cars
    const index = state.selectedGroup.cars.findIndex((c) =>
      c.groupId === car.groupId && c.carId === car.carId);

    // Only update the car if it exists in the group and if the
    // given car data differs from the stored data
    if (index !== -1 && !_.isEqual(state.selectedGroup.cars[index], car)) {
      state.selectedGroup.cars[index] = car;
    }
  }
};

/**
 * Reducer to add an invitation to the selected group.
 *
 * Only adds the invitation if it is an invitation to the selected group.
 * @param state
 * @param action
 */
export const addInviteReducer: GroupReducer<InviteWithUserAndInviteSender> = (
  state,
  action,
) => {
  const invite = action.payload;

  // Check if a group is selected and if the invitation is for that group
  if (
    state.selectedGroup && state.selectedGroup.invites.every((i) =>
      invite.userId !== i.userId)
  ) {
    state.selectedGroup.invites
      .push(invite);
  }
};

export interface SetAdminOfMemberPayload {
  groupId: number;
  userId: number;
  isAdmin: boolean;
}

/**
 * Reducer to set the admin privileges of a member of the selected group.
 *
 * Only sets it if a group is selected and the member is a member of
 * that group.
 * @param state State
 * @param action Action
 */
export const setAdminOfMemberReducer: GroupReducer<SetAdminOfMemberPayload> = (
  state,
  action,
) => {
  const {groupId, userId, isAdmin} = action.payload;

  // Check if a group is selected and the member is a member of that group
  if (state.selectedGroup && state.selectedGroup.id === groupId) {
    const index = state.selectedGroup.members.findIndex((m) =>
      m.User.id === userId);

    // Update the admin privileges
    state.selectedGroup.members[index].isAdmin = isAdmin;
  }
};

export interface RemoveCarPayload {
  groupId: number;
  carId: number;
}

/**
 * Reducer to remove a car.
 *
 * Only removes the car if a group is selected and the
 * car belongs to that group.
 * @param state State
 * @param action Action
 */
export const removeCarReducer: GroupReducer<RemoveCarPayload> = (
  state,
  action,
) => {
  const {groupId, carId} = action.payload;

  // Check if a group is selected and the car belongs to it
  if (state.selectedGroup && state.selectedGroup.id === groupId) {
    state.selectedGroup.cars = state.selectedGroup.cars
      .filter((car) => car.carId !== carId);
  }
};
