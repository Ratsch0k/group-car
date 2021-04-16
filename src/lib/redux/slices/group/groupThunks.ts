import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from 'lib/redux/store';
import {
  selectGroup,
  addGroup,
  updateGroups,
  updateGroup,
  removeGroupWithId,
  setDriverOfCar,
  setLocationOfCar,
  setSelectedGroup,
  addCar,
  addInvite,
} from './groupSlice';
import * as api from 'lib/api';
import {
  CarColor,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  InviteWithUserAndInviteSender,
  RestError,
} from 'lib/api';
import {AxiosError} from 'axios';
import {CouldNotDriveCarError, CouldNotParkCarError} from 'lib';
import {CarAlreadyExistsError} from 'lib/errors';

const getGroupFromApi = async (id: number):
Promise<GroupWithOwnerAndMembersAndInvitesAndCars> => {
  const [
    carRequest,
    groupRequest,
    memberRequest,
    invitesRequest,
  ] = await Promise.all([
    api.getCars(id),
    api.getGroup(id),
    api.getMembers(id),
    api.getInvitesOfGroup(id),
  ]);
  const {cars} = carRequest.data;
  const {members} = memberRequest.data;
  const {invites} = invitesRequest.data;
  return {
    ...groupRequest.data,
    members,
    cars,
    invites,
  };
};

interface SelectGroupParams {
  id: number;
  force?: boolean;
}
export const selectAndUpdateGroup = createAsyncThunk(
  'group/selectGroup',
  async (
    {id, force}: SelectGroupParams,
    {dispatch, getState, rejectWithValue},
  ) => {
    const {group: {selectedGroup, groups}} = getState() as RootState;

    if (selectedGroup === null || selectedGroup.id !== id) {
      const groupIndex = groups.findIndex((g) => g.id === id);

      if (force || groupIndex !== -1) {
        try {
          const group = await getGroupFromApi(id);

          dispatch(selectGroup(group));
        } catch (e) {
          const error = (e as AxiosError<RestError>).response?.data;
          return rejectWithValue(error);
        }
      }
    }
  },
);

export const updateSelectedGroup = createAsyncThunk(
  'group/updateSelectedGroup',
  async (id: number, {dispatch, rejectWithValue}) => {
    try {
      const group = await getGroupFromApi(id);

      dispatch(setSelectedGroup(group));
    } catch (e) {
      rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface CreateGroupParams {
  name: string;
  description?: string;
}
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (
    {name, description}: CreateGroupParams,
    {dispatch, rejectWithValue},
  ) => {
    try {
      const createGroupResponse = await api.createGroup(name, description);
      const newGroup = (await api.getGroup(createGroupResponse.data.id)).data;
      dispatch(addGroup(newGroup));
      await dispatch(selectAndUpdateGroup({id: newGroup.id, force: true}));
      return createGroupResponse.data;
    } catch (e) {
      const error = (e as AxiosError<RestError>).response?.data;
      return rejectWithValue(error);
    }
  },
);

export const update = createAsyncThunk(
  'group/update',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const groupsResponse = await api.getGroups();
      const newGroups = groupsResponse.data.groups;

      dispatch(updateGroups(newGroups));
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface GetGroupParams {
  id: number;
}
export const getGroup = createAsyncThunk(
  'group/getGroup',
  async ({id}: GetGroupParams, {dispatch, rejectWithValue}) => {
    try {
      const res = await api.getGroup(id);
      const newGroup = res.data;

      dispatch(updateGroup(newGroup));

      return res.data;
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface InviteUserParams {
  groupId: number,
  usernameOrId: number | string;
}
export const inviteUser = createAsyncThunk(
  'group/inviteUser',
  async (params: InviteUserParams, {rejectWithValue, dispatch, getState}) => {
    try {
      const res = await api.inviteUser(params.groupId, params.usernameOrId);

      /*
       * TODO: invite is missing Invite and User
       * field because api doesn't return them. Remove casting
       * when api returns them
       */
      const invite = {
        ...res.data,
        User: {
          username: params.usernameOrId,
        },
        InviteSender: {
          username: (getState() as RootState).auth.user?.username,
        },
      };
      dispatch(addInvite(invite as InviteWithUserAndInviteSender));
      return res.data;
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface LeaveGroupParams {
  id: number;
}
export const leaveGroup = createAsyncThunk(
  'group/leaveGroup',
  async (params: LeaveGroupParams, {dispatch, rejectWithValue}) => {
    try {
      const res = await api.leaveGroup(params.id);

      dispatch(removeGroupWithId(params.id));

      return res.data;
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface DeleteGroupParams {
  id: number;
}
export const deleteGroup = createAsyncThunk(
  'group/deleteGroup',
  async (params: DeleteGroupParams, {dispatch, rejectWithValue}) => {
    try {
      const res = await api.deleteGroup(params.id);

      dispatch(removeGroupWithId(params.id));

      return res.data;
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

interface DriveCarParams {
  groupId: number;
  carId: number;
}
export const driveCar = createAsyncThunk(
  'group/driveCar',
  async (
    {groupId, carId}: DriveCarParams,
    {getState, dispatch, rejectWithValue},
  ) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    const selectedGroup = state.group.selectedGroup;
    const groupCars = state.group.selectedGroup?.cars;

    if (user !== undefined &&
      selectedGroup !== null && selectedGroup.id === groupId &&
      groupCars && groupCars.some((car) => car.carId === carId)) {
      try {
        const res = await api.driveCar(groupId, carId);
        dispatch(setDriverOfCar({groupId, carId, driver: user}));
        return res.data;
      } catch (e) {
        return rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else {
      rejectWithValue(new CouldNotDriveCarError());
    }
  },
);

interface ParkCarParams {
  groupId: number;
  carId: number;
  latitude: number;
  longitude: number;
}
export const parkCar = createAsyncThunk(
  'group/parkCar',
  async (
    {groupId, carId, latitude, longitude}: ParkCarParams,
    {getState, dispatch, rejectWithValue},
  ) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    const {selectedGroup} = state.group;

    if (
      user &&
      selectedGroup !== null &&
      selectedGroup.id === groupId
    ) {
      try {
        const res = await api.parkCar(groupId, carId, latitude, longitude);

        dispatch(setLocationOfCar({groupId, carId, latitude, longitude}));
        return res.data;
      } catch (e) {
        rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else {
      rejectWithValue(new CouldNotParkCarError());
    }
  },
);

interface CreateCarParams {
  groupId: number;
  name: string;
  color: CarColor;
}
export const createCar = createAsyncThunk(
  'group/createCar',
  async (
    {groupId, name, color}: CreateCarParams,
    {dispatch, getState, rejectWithValue},
  ) => {
    const state = getState() as RootState;

    if (
      state.group.selectedGroup && state.group.selectedGroup.cars.every((c) =>
        c.name !== name && c.color !== color)
    ) {
      try {
        const res = await api.createCar(groupId, name, color);

        dispatch(addCar(res.data));

        return res.data;
      } catch (e) {
        rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else {
      rejectWithValue(new CarAlreadyExistsError());
    }
  },
);
