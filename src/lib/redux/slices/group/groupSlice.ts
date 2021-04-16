import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {CarWithDriver, GroupWithOwner} from 'lib';
import {
  GroupWithOwnerAndMembersAndInvitesAndCars,
  InviteWithUserAndInviteSender,
} from 'lib/api';
import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';
import _ from 'lodash';
import {User} from 'typings/auth';

export interface GroupState {
  /**
   * The selected group.
   *
   * If no group is selected this is null.
   */
  selectedGroup: GroupWithOwnerAndMembersAndInvitesAndCars | null;
  /**
      * All groups of which the current user is a member of.
      */
  groups: GroupWithOwner[];

  /**
   * Wether some request is currently loading.
   */
  loading: boolean;
}


const initialState: GroupState = {
  selectedGroup: null,
  groups: [],
  loading: false,
};

const name = 'group';

/**
 * Create group slice.
 */
const groupSlice = createSlice({
  name,
  initialState,
  reducers: {
    addGroup(state, action: PayloadAction<GroupWithOwner>) {
      state.groups.push(action.payload);
    },
    selectGroup(
      state,
      {payload: group}:
      PayloadAction<GroupWithOwnerAndMembersAndInvitesAndCars>,
    ) {
      const index = state.groups.findIndex((g) => g.id === group.id);

      if (index >= 0) {
        state.groups[index] = group;
        state.selectedGroup = group;
      }
    },
    setSelectedGroup(
      state,
      {payload: group}:
      PayloadAction<GroupWithOwnerAndMembersAndInvitesAndCars>,
    ) {
      if (state.selectedGroup && state.selectedGroup.id === group.id) {
        state.selectedGroup = group;
      }
    },
    updateGroups(state, action: PayloadAction<GroupWithOwner[]>) {
      state.groups = action.payload;

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
    },
    updateGroup(state, action: PayloadAction<GroupWithOwner>) {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);

      if (index >= 0) {
        state.groups[index] = action.payload;
      }
      if (state.selectedGroup && state.selectedGroup.id === action.payload.id) {
        state.selectedGroup = {
          ...state.selectedGroup,
          ...action.payload,
        };
      }
    },
    setDriverOfCar(
      state,
      action: PayloadAction<{groupId: number, carId: number, driver: User}>,
    ) {
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
    },
    setLocationOfCar(
      state,
      action: PayloadAction<{
        groupId: number,
        carId: number,
        latitude: number,
        longitude: number
      }>,
    ) {
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
    },
    removeGroupWithId(state, {payload: id}: PayloadAction<number>) {
      state.groups = state.groups.filter((g) => g.id !== id);

      const selectedGroup = state.selectedGroup;
      if (selectedGroup && selectedGroup.id === id) {
        state.selectedGroup = null;
      }
    },
    addCar(state, action: PayloadAction<CarWithDriver>) {
      const car = action.payload;

      if (
        state.selectedGroup &&
        state.selectedGroup.id === car.groupId &&
        state.selectedGroup.cars.every((c) => c.carId !== car.carId)
      ) {
        state.selectedGroup.cars.push(car);
      }
    },
    updateCar(state, action: PayloadAction<CarWithDriver>) {
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
    },
    addInvite(state, action: PayloadAction<InviteWithUserAndInviteSender>) {
      const invite = action.payload;

      if (
        state.selectedGroup && state.selectedGroup.invites.every((i) =>
          invite.userId !== i.userId)
      ) {
        state.selectedGroup.invites
          .push(invite);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPendingMatcher(name), (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher(name), (state) => {
      state.loading = false;
    });
  },
});

export const {
  addGroup,
  selectGroup,
  updateGroups,
  updateGroup,
  removeGroupWithId,
  setDriverOfCar,
  setLocationOfCar,
  addCar,
  updateCar,
  setSelectedGroup,
  addInvite,
} = groupSlice.actions;

export default groupSlice.reducer;
