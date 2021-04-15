import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {CarWithDriver, GroupWithOwner} from 'lib';
import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';

interface GroupState {
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
    removeGroupWithId(state, {payload: id}: PayloadAction<number>) {
      state.groups = state.groups.filter((g) => g.id !== id);

      const selectedGroup = state.selectedGroup;
      if (selectedGroup && selectedGroup.id === id) {
        state.selectedGroup = null;
        state.groupCars = null;
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
} = groupSlice.actions;

export default groupSlice.reducer;
