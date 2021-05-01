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
  setAdminOfMember,
} from './groupSlice';
import * as api from 'lib/api';
import {
  CarColor,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  InviteWithUserAndInviteSender,
  RestError,
} from 'lib/api';
import {AxiosError} from 'axios';
import {
  CarAlreadyExistsError,
  CouldNotModifyMemberError,
  NotAdminOfGroupError,
  NotLoggedInError,
} from 'lib/errors';
import NoGroupSelectedError from 'lib/errors/NoGroupSelectedError';
import NotOwnerOfGroupError from 'lib/errors/NotOwnerOfGroupError';

/**
 * Helper function which combines all
 * api calls necessary to get a complete group.
 * @param id The id of the group
 * @returns The group with its members, cars and invites
 */
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

export interface SelectGroupParams {
  id: number;
  force?: boolean;
}
/**
 * Thunk to select and update a group.
 */
export const selectAndUpdateGroup = createAsyncThunk(
  'group/selectAndUpdateGroup',
  async (
    {id, force}: SelectGroupParams,
    {dispatch, getState, rejectWithValue},
  ) => {
    const state = getState() as RootState;
    const selectedGroup = state.group.selectedGroup;

    if (selectedGroup === null || selectedGroup.id !== id) {
      const groupEntity = state.group.entities[id];

      if (force || groupEntity) {
        try {
          const group = await getGroupFromApi(id);

          dispatch(selectGroup({group, force}));
        } catch (e) {
          const error = (e as AxiosError<RestError>).response?.data;
          return rejectWithValue(error);
        }
      }
    }
  },
);

/**
 * Update the currently selected group.
 */
export const updateSelectedGroup = createAsyncThunk(
  'group/updateSelectedGroup',
  async (id: number, {dispatch, rejectWithValue}) => {
    try {
      const group = await getGroupFromApi(id);

      dispatch(setSelectedGroup(group));
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);


export interface CreateGroupParams {
  name: string;
  description?: string;
}
/**
 * Creates a new group, adds it to the list of groups and
 * selects the group.
 */
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (
    {name, description}: CreateGroupParams,
    {dispatch, rejectWithValue, getState},
  ) => {
    try {
      const createGroupResponse = await api.createGroup(name, description);
      const newGroup = (await api.getGroup(createGroupResponse.data.id)).data;
      dispatch(addGroup(newGroup));
      const completeGroup = {
        ...newGroup,
        members: [
          {
            isAdmin: true,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            User: (getState() as RootState).auth.user!,
          },
        ],
        cars: [],
        invites: [],
      };
      dispatch(setSelectedGroup(completeGroup));
      return createGroupResponse.data;
    } catch (e) {
      const error = (e as AxiosError<RestError>).response?.data;
      return rejectWithValue(error);
    }
  },
);

/**
 * Updates groups and selectedGroup.
 */
export const update = createAsyncThunk(
  'group/update',
  async (_, {getState, dispatch, rejectWithValue}) => {
    try {
      const groupsResponse = await api.getGroups();
      const newGroups = groupsResponse.data.groups;

      dispatch(updateGroups(newGroups));

      const state = getState() as RootState;
      if (state.group.selectedGroup) {
        await dispatch(updateSelectedGroup(state.group.selectedGroup.id));
      }
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

export interface GetGroupParams {
  id: number;
}

/**
 * Gets the group.
 */
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

export interface InviteUserParams {
  groupId: number,
  usernameOrId: number | string;
}
/**
 * Invites the specified user to the specified group and
 * if the currently selected group is that group, also adds it
 * to the list of invites.
 */
export const inviteUser = createAsyncThunk(
  'group/inviteUser',
  async (params: InviteUserParams, {rejectWithValue, dispatch, getState}) => {
    const state = getState() as RootState;
    try {
      const res = await api.inviteUser(params.groupId, params.usernameOrId);

      const invite = {
        ...res.data,
        User: {
          username: params.usernameOrId,
        },
        InviteSender: {
          id: state.auth.user?.id,
          username: state.auth.user?.username,
        },
      };
      /*
       * //TODO: invite is missing Invite and User
       * field because api doesn't return them. Remove casting
       * when api returns them
       */
      if (
        state.group.selectedGroup &&
        state.group.selectedGroup.id === params.groupId
      ) {
        dispatch(addInvite(invite as InviteWithUserAndInviteSender));
      }
      return invite;
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }
  },
);

export interface LeaveGroupParams {
  id: number;
}
/**
 * Leave the specified group and removes it from the list of groups.
 */
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

export interface DeleteGroupParams {
  id: number;
}
/**
 * Delete the specified group and removes it from the list of groups.
 */
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

export interface DriveCarParams {
  groupId: number;
  carId: number;
}
/**
 * Drive the specified car of the specified group,
 * if it's a car of the currently selected group it also
 * updates the state of that car.
 */
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

    let res;
    try {
      res = await api.driveCar(groupId, carId);
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }

    if (user !== undefined &&
      selectedGroup !== null && selectedGroup.id === groupId &&
      groupCars && groupCars.some((car) => car.carId === carId)
    ) {
      dispatch(setDriverOfCar({groupId, carId, driver: user}));
    }

    return res.data;
  },
);

export interface ParkCarParams {
  groupId: number;
  carId: number;
  latitude: number;
  longitude: number;
}
/**
 * Park the specified car of the specified
 * group. If the car belongs to the currently selected
 * group, it also updates the state of that car.
 */
export const parkCar = createAsyncThunk(
  'group/parkCar',
  async (
    {groupId, carId, latitude, longitude}: ParkCarParams,
    {getState, dispatch, rejectWithValue},
  ) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    const {selectedGroup} = state.group;
    const groupCars = state.group.selectedGroup?.cars;

    let res;
    try {
      res = await api.parkCar(groupId, carId, latitude, longitude);
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }

    if (
      user &&
      selectedGroup !== null &&
      selectedGroup.id === groupId &&
      groupCars && groupCars.some((car) => car.carId === carId)
    ) {
      dispatch(setLocationOfCar({groupId, carId, latitude, longitude}));
    }
    return res.data;
  },
);

export interface CreateCarParams {
  groupId: number;
  name: string;
  color: CarColor;
}
/**
 * Creates a new car and adds it to the list of car. If the
 * car belongs to the currently selected group, also add
 * it to the list of cars.
 */
export const createCar = createAsyncThunk(
  'group/createCar',
  async (
    {groupId, name, color}: CreateCarParams,
    {dispatch, getState, rejectWithValue},
  ) => {
    const state = getState() as RootState;

    let res;
    try {
      res = await api.createCar(groupId, name, color);
    } catch (e) {
      return rejectWithValue((e as AxiosError<RestError>).response?.data);
    }

    if (
      state.group.selectedGroup && state.group.selectedGroup.id === groupId) {
      if (
        state.group.selectedGroup.cars.every((c) =>
          c.name !== name && c.color !== color)
      ) {
        dispatch(addCar(res.data));
      } else {
        return rejectWithValue(new CarAlreadyExistsError());
      }
    }
    return res.data;
  },
);

export interface GrantAdminRightsParams {
  groupId: number;
  userId: number;
}

export const grantAdminRights = createAsyncThunk(
  'group/grantAdminRights',
  async (
    {groupId, userId}: GrantAdminRightsParams,
    {dispatch, rejectWithValue, getState},
  ) => {
    const state = getState() as RootState;
    const group = state.group.selectedGroup;
    const user = state.auth.user;

    // Check if current user is an admin or owner of the group
    if (
      user &&
      group &&
      (
        group.Owner.id === user.id ||
        group.members.find((m) => m.User.id === user.id && m.isAdmin)
      ) &&
      group.members.find((m) => m.User.id === userId && !m.isAdmin)
    ) {
      try {
        await api.grantAdmin(groupId, userId);
        dispatch(setAdminOfMember({groupId, userId, isAdmin: true}));
      } catch (e) {
        return rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else if (!user) {
      return rejectWithValue(new NotLoggedInError());
    } else if (!group) {
      return rejectWithValue(new NoGroupSelectedError());
    } else if (
      group.Owner.id !== user.id &&
      group.members.find((m) => m.User.id === user.id && !m.isAdmin)
    ) {
      return rejectWithValue(new NotAdminOfGroupError());
    } else {
      return rejectWithValue(new CouldNotModifyMemberError());
    }
  },
);

export interface RemoveAdminRightsParams {
  groupId: number;
  userId: number;
}

export const revokeAdminRights = createAsyncThunk(
  'group/revokeAdminRights',
  async (
    {groupId, userId}: RemoveAdminRightsParams,
    {dispatch, rejectWithValue, getState},
  ) => {
    const state = getState() as RootState;
    const group = state.group.selectedGroup;
    const user = state.auth.user;

    // Check if current user is an admin or owner of the group
    if (
      user &&
      group &&
      group.Owner.id === user.id &&
      group.Owner.id !== userId &&
      group.members.find((m) => m.User.id === userId && m.isAdmin)
    ) {
      try {
        await api.revokeAdmin(groupId, userId);
        dispatch(setAdminOfMember({groupId, userId, isAdmin: false}));
      } catch (e) {
        return rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else if (!user) {
      return rejectWithValue(new NotLoggedInError());
    } else if (!group) {
      return rejectWithValue(new NoGroupSelectedError());
    } else if (group.Owner.id !== user.id) {
      return rejectWithValue(new NotOwnerOfGroupError());
    } else {
      return rejectWithValue(new CouldNotModifyMemberError());
    }
  },
);
