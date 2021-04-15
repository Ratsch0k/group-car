import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from 'lib/redux/store';
import {
  selectGroup,
  addGroup,
  updateGroups,
  updateGroup,
  removeGroupWithId,
} from './groupSlice';
import * as api from 'lib/api';

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
