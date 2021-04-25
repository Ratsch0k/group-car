import {createAsyncThunk} from '@reduxjs/toolkit';
import {NoInviteForGroupError, NotLoggedInError} from 'lib/errors';
import {RootState} from 'lib/redux/store';
import * as api from 'lib/api';
import {AxiosError} from 'axios';
import {addInvites, getInviteById, removeInvite} from './invitesSlice';
import {RestError} from 'lib/api';
import {update} from '../group';

/**
 * Gets all invites from the currently logged in user.
 * Invites will also be added to invites state.
 */
export const getInvites = createAsyncThunk(
  'invites/getInvites',
  async (_, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as RootState;

    if (state.auth.user) {
      try {
        const res = await api.getInvitesOfUser();

        dispatch(addInvites(res.data.invites));

        return res.data.invites;
      } catch (e) {
        return rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else {
      return rejectWithValue(new NotLoggedInError());
    }
  },
);

/**
 * Accepts the invite to the specified invite.
 */
export const acceptInvite = createAsyncThunk(
  'invites/acceptInvite',
  async (
    groupId: number,
    {dispatch, rejectWithValue, getState},
  ) => {
    const state = getState() as RootState;
    const invite = getInviteById(state, groupId);

    if (state.auth.user && invite) {
      try {
        const res = await api.acceptInvite(groupId);

        dispatch(removeInvite(groupId));
        await dispatch(update());
        return res.data;
      } catch (e) {
        return rejectWithValue((e as AxiosError<RestError>).response?.data);
      }
    } else if (!state.auth.user) {
      return rejectWithValue(new NotLoggedInError());
    } else {
      return rejectWithValue(new NoInviteForGroupError(groupId));
    }
  },
);

/**
 * Rejects the invite for the specified group.
 */
export const rejectInvite = createAsyncThunk(
  'invites/rejectInvite',
  async (
    groupId: number,
    {dispatch, rejectWithValue, getState},
  ) => {
    const state = getState() as RootState;
    const invite = getInviteById(state, groupId);

    if (state.auth.user && invite) {
      // TODO: Add api call if available
      dispatch(removeInvite(groupId));
      dispatch(update());
    } else if (state.auth.user) {
      return rejectWithValue(new NotLoggedInError());
    } else {
      return rejectWithValue(new NoInviteForGroupError(groupId));
    }
  },
);
