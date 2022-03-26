import {
  createSlice,
} from '@reduxjs/toolkit';
import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';
import {GroupState} from './groupState';
import {
  addCarReducer, addInviteReducer, removeCarReducer,
  removeGroupWithIdReducer,
  resetGroupReducer,
  selectGroupReducer, setAdminOfMemberReducer,
  setDriverOfCarReducer,
  setLocationOfCarReducer,
  setSelectedGroupReducer,
  updateCarReducer,
  updateGroupReducer,
  updateGroupsReducer,
} from './groupReducers';
import groupsAdapter from './groupAdapter';


export const initialState: GroupState = {
  selectedGroup: null,
  loading: false,
  ...groupsAdapter.getInitialState(),
};

const name = 'group';

/**
 * Create group slice.
 */
export const groupSlice = createSlice({
  name,
  initialState,
  reducers: {
    reset: resetGroupReducer,
    addGroup: groupsAdapter.addOne,
    selectGroup: selectGroupReducer,
    setSelectedGroup: setSelectedGroupReducer,
    updateGroups: updateGroupsReducer,
    updateGroup: updateGroupReducer,
    setDriverOfCar: setDriverOfCarReducer,
    setLocationOfCar: setLocationOfCarReducer,
    removeGroupWithId: removeGroupWithIdReducer,
    addCar: addCarReducer,
    updateCar: updateCarReducer,
    addInvite: addInviteReducer,
    setAdminOfMember: setAdminOfMemberReducer,
    removeCar: removeCarReducer,
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
  reset,
  setAdminOfMember,
  removeCar,
} = groupSlice.actions;

export default groupSlice.reducer;
