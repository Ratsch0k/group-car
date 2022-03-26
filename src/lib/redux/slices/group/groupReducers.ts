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

export const resetGroupReducer: GroupReducer = (state) => {
  state.entities = initialState.entities;
  state.ids = initialState.ids;
  state.loading = initialState.loading;
  state.selectedGroup = initialState.selectedGroup;
};

export const setSelectedGroupReducer:
GroupReducer<GroupWithOwnerAndMembersAndInvitesAndCars> = (
  state,
  {payload: group},
) => {
  state.selectedGroup = group;
};


export const updateGroupsReducer: GroupReducer<GroupWithOwner[]> = (
  state,
  action,
) => {
  const selectedGroup = state.selectedGroup;
  if (selectedGroup !== null) {
    const selectedGroupFromData = action.payload
      .find((g)=> g.id === selectedGroup.id);

    if (!selectedGroupFromData) {
      state.selectedGroup = null;
    } else {
      state.selectedGroup = {
        ...selectedGroup,
        ...selectedGroupFromData,
      };
    }
  }
  groupsAdapter.setAll(state, action.payload);
};

export const updateGroupReducer: GroupReducer<GroupWithOwner> = (
  state,
  action,
) => {
  const group = state.entities[action.payload.id];

  if (group) {
    state.entities[action.payload.id] = action.payload;
  }
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

export const setDriverOfCarReducer: GroupReducer<SetDriverOfCarPayload> = (
  state,
  action,
) => {
  const {groupId, carId, driver} = action.payload;

  if (state.selectedGroup) {
    const index = state.selectedGroup.cars.findIndex((g) =>
      g.groupId === groupId && g.carId === carId);

    if (index !== -1) {
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

export const setLocationOfCarReducer: GroupReducer<SetLocationOfCarPayload> =(
  state,
  action,
) => {
  const {groupId, carId, latitude, longitude} = action.payload;

  if (state.selectedGroup) {
    const index = state.selectedGroup.cars.findIndex((g) =>
      g.groupId === groupId && g.carId === carId);

    if (index !== -1) {
      state.selectedGroup.cars[index].Driver = null;
      state.selectedGroup.cars[index].driverId = null;
      state.selectedGroup.cars[index].latitude = latitude;
      state.selectedGroup.cars[index].longitude = longitude;
    }
  }
};

export const removeGroupWithIdReducer: GroupReducer<number> = (
  state,
  {payload: id},
) => {
  groupsAdapter.removeOne(state, id);

  const selectedGroup = state.selectedGroup;
  if (selectedGroup && selectedGroup.id === id) {
    state.selectedGroup = null;
  }
};

export const addCarReducer: GroupReducer<CarWithDriver> = (
  state,
  action,
) => {
  const car = action.payload;

  if (
    state.selectedGroup &&
    state.selectedGroup.id === car.groupId &&
    state.selectedGroup.cars.every((c) => c.carId !== car.carId)
  ) {
    state.selectedGroup.cars.push(car);
  }
};

export const updateCarReducer: GroupReducer<CarWithDriver> = (
  state,
  action,
) => {
  const car = action.payload;

  if (
    state.selectedGroup &&
    state.selectedGroup.id === car.groupId
  ) {
    const index = state.selectedGroup.cars.findIndex((c) =>
      c.groupId === car.groupId && c.carId === car.carId);

    if (index !== -1 && !_.isEqual(state.selectedGroup.cars[index], car)) {
      state.selectedGroup.cars[index] = car;
    }
  }
};

export const addInviteReducer: GroupReducer<InviteWithUserAndInviteSender> = (
  state,
  action,
) => {
  const invite = action.payload;

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

export const setAdminOfMemberReducer: GroupReducer<SetAdminOfMemberPayload> = (
  state,
  action,
) => {
  const {groupId, userId, isAdmin} = action.payload;

  if (state.selectedGroup && state.selectedGroup.id === groupId) {
    const index = state.selectedGroup.members.findIndex((m) =>
      m.User.id === userId);

    state.selectedGroup.members[index].isAdmin = isAdmin;
  }
};

export interface RemoveCarPayload {
  groupId: number;
  carId: number;
}

export const removeCarReducer: GroupReducer<RemoveCarPayload> = (
  state,
  action,
) => {
  const {groupId, carId} = action.payload;

  if (state.selectedGroup && state.selectedGroup.id === groupId) {
    state.selectedGroup.cars = state.selectedGroup.cars
      .filter((car) => car.carId !== carId);
  }
};
