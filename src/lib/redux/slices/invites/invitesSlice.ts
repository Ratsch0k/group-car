import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {InviteWithGroupAndInviteSender} from 'lib/api';
import {RootState} from 'lib/redux/store';
import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';

export const invitesAdapter = createEntityAdapter<
InviteWithGroupAndInviteSender
>({selectId: (invite) => invite.groupId});

const name = 'invites';

export const initialState = {
  loading: false,
  ...invitesAdapter.getInitialState(),
};

const invitesSlice = createSlice({
  name,
  initialState,
  reducers: {
    addInvite: invitesAdapter.addOne,
    addInvites: invitesAdapter.addMany,
    removeInvite: invitesAdapter.removeOne,
    reset(state) {
      state.loading = initialState.loading;
      state.ids = invitesAdapter.getInitialState().ids;
      state.entities = invitesAdapter.getInitialState().entities;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPendingMatcher(name), (state) => {
        state.loading = true;
      })
      .addMatcher(isCompletedMatcher(name), (state) => {
        state.loading = false;
      });
  },
});

export const {
  addInvite,
  addInvites,
  removeInvite,
  reset,
} = invitesSlice.actions;

export const {
  selectById: getInviteById,
  selectAll: getAllInvites,
  selectEntities: getInviteEntities,
  selectIds: getInviteIds,
  selectTotal: getTotalInvites,
} = invitesAdapter.getSelectors((state: RootState) => state.invites);
export const getIsLoading = (state: RootState): boolean =>
  state.invites.loading;

export default invitesSlice.reducer;
