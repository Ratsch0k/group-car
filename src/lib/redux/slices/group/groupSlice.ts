import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {RootState} from 'lib/redux/store';
import {CarWithDriver, GroupWithOwner} from 'lib';
import * as api from 'lib/api';
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

/*
 * Create thunks.
 */

interface SelectGroupParams {
  id: number;
  force?: boolean;
}
export const selectAndUpdateGroup = createAsyncThunk(
  'group/selectGroup',
  async ({id, force}: SelectGroupParams, {dispatch, getState}) => {
    const {group: {selectedGroup, groups}} = getState() as RootState;

    if (selectedGroup === null || selectedGroup.id !== id) {
      const groupIndex = groups.findIndex((g) => g.id === id);

      if (force || groupIndex !== -1) {
        const [carRequest, groupRequest] = await Promise.all([
          api.getCars(id),
          api.getGroup(id),
        ]);
        const {cars} = carRequest.data;
        const group = groupRequest.data;

        dispatch(selectGroup({cars, group}));
      }
    }
  },
);

interface CreateGroupParams {
  name: string;
  description: string;
}
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async ({name, description}: CreateGroupParams, {dispatch}) => {
    const createGroupResponse = await api.createGroup(name, description);
    const newGroup = (await api.getGroup(createGroupResponse.data.id)).data;
    dispatch(addGroup(newGroup));
    await dispatch(selectAndUpdateGroup({id: newGroup.id, force: true}));

    return createGroupResponse;
  },
);

export const update = createAsyncThunk(
  'group/update',
  async (_, {dispatch}) => {
    const groupsResponse = await api.getGroups();
    const newGroups = groupsResponse.data.groups;

    dispatch(updateGroups(newGroups));
  },
);

interface GetGroupParams {
  id: number;
}
export const getGroup = createAsyncThunk(
  'group/getGroup',
  async ({id}: GetGroupParams, {dispatch}) => {
    const res = await api.getGroup(id);
    const newGroup = res.data;

    dispatch(updateGroup(newGroup));

    return newGroup;
  },
);

// interface InviteUserParams {
//   groupId: number,
//   usernameOrId: number | string;
// }
// export const inviteUser = createAsyncThunk(
//   'group/inviteUser',
//   (params: InviteUserParams) => {
//   },
// );

interface LeaveGroupParams {
  id: number;
}
export const leaveGroup = createAsyncThunk(
  'group/leaveGroup',
  async (params: LeaveGroupParams, {dispatch}) => {
    const res = await api.leaveGroup(params.id);

    dispatch(removeGroupWithId(params.id));

    return res;
  },
);

interface DeleteGroupParams {
  id: number;
}
export const deleteGroup = createAsyncThunk(
  'group/deleteGroup',
  async (params: DeleteGroupParams, {dispatch}) => {
    const res = await api.deleteGroup(params.id);

    dispatch(removeGroupWithId(params.id));

    return res;
  },
);

// interface DriveCarParams {
//   groupId: number;
//   carId: number;
// }
// export const driveCar = createAsyncThunk(
//   'group/driveCar',
//   (params: DriveCarParams) => {
//
//   },
// );

// interface ParkCarParams {
//   groupId: number;
//   carId: number;
//   latitude: number;
//   longitude: number;
// }
// export const parkCar = createAsyncThunk(
//   'group/parkCar',
//   (params: ParkCarParams) => {
//
//   },
// );


export const isLoading = (state: RootState): boolean => state.group.loading;
export const findGroups =
(state: RootState): GroupWithOwner[] => state.group.groups;


export default groupSlice.reducer;
