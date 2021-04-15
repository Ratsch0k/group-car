import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {CarWithDriver, GroupWithOwner} from 'lib';
import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';
import _ from 'lodash';
import {User} from 'typings/auth';

export interface GroupState {
  /**
   * The selected group.
   *
   * If no group is selected this is null.
   */
  selectedGroup: GroupWithOwner | null;

  /**
      * The cars of the selected group.
      *
      * If none is selected this is null.
      */
  groupCars: CarWithDriver[] | null;

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
  groupCars: null,
  groups: [],
  loading: false,
};

/**
 * Create group slice.
 */
const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    addGroup(state, action: PayloadAction<GroupWithOwner>) {
      state.groups.push(action.payload);
    },
    selectGroup(
      state,
      {payload: {cars, group}}: PayloadAction<{
        group: GroupWithOwner,
        cars: CarWithDriver[]
      }>,
    ) {
      state.groupCars = cars;
      state.selectedGroup = group;

      const index = state.groups.findIndex((g) => g.id === group.id);
      state.groups[index] = group;
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
          state.selectedGroup = selectedGroupFromData;
        }
      }
    },
    updateGroup(state, action: PayloadAction<GroupWithOwner>) {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);

      state.groups[index] = action.payload;

      if (state.selectedGroup && state.selectedGroup.id === action.payload.id) {
        state.selectedGroup = action.payload;
      }
    },
    setDriverOfCar(
      state,
      action: PayloadAction<{groupId: number, carId: number, driver: User}>,
    ) {
      const {groupId, carId, driver} = action.payload;

      if (state.groupCars) {
        const index = state.groupCars.findIndex((g) =>
          g.groupId === groupId && g.carId === carId);

        if (index !== -1) {
          state.groupCars[index].driverId = driver.id;
          state.groupCars[index].Driver = {
            username: driver.username,
            id: driver.id,
          };
          state.groupCars[index].latitude = null;
          state.groupCars[index].longitude = null;
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

      if (state.groupCars) {
        const index = state.groupCars.findIndex((g) =>
          g.groupId === groupId && g.carId === carId);

        if (index !== -1) {
          state.groupCars[index].Driver = null;
          state.groupCars[index].driverId = null;
          state.groupCars[index].latitude = latitude;
          state.groupCars[index].longitude = longitude;
        }
      }
    },
    removeGroupWithId(state, {payload: id}: PayloadAction<number>) {
      state.groups = state.groups.filter((g) => g.id !== id);

      const selectedGroup = state.selectedGroup;
      if (selectedGroup && selectedGroup.id === id) {
        state.selectedGroup = null;
        state.groupCars = null;
      }
    },
    addCar(state, action: PayloadAction<CarWithDriver>) {
      const car = action.payload;

      if (
        state.selectedGroup &&
        state.selectedGroup.id === car.groupId &&
        state.groupCars &&
        state.groupCars.every((c) => c.carId !== car.carId)
      ) {
        state.groupCars.push(car);
      }
    },
    updateCar(state, action: PayloadAction<CarWithDriver>) {
      const car = action.payload;

      if (
        state.selectedGroup &&
        state.selectedGroup.id === car.groupId &&
        state.groupCars
      ) {
        const index = state.groupCars.findIndex((c) =>
          c.groupId === car.groupId && c.carId === car.carId);

        if (index !== -1 && !_.isEqual(state.groupCars[index], car)) {
          state.groupCars[index] = car;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPendingMatcher, (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher, (state) => {
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
} = groupSlice.actions;

export default groupSlice.reducer;
