import {CarWithDriver} from 'lib';
import {GroupWithOwner, InviteWithUserAndInviteSender, Member} from 'lib/api';
import {RootState} from 'lib/redux/store';
import {isAdmin} from 'lib/util';
import {createSelector} from 'reselect';
import {getUser} from '../auth/authSelectors';
import groupsAdapter from './groupAdapter';

export const {
  selectById: getGroupById,
  selectAll: getAllGroups,
  selectIds: getGroupIds,
  selectEntities: getGroupEntities,
  selectTotal: getTotalGroups,
} = groupsAdapter.getSelectors((state: RootState) => state.group);

export const getIsLoading = (state: RootState): boolean => state.group.loading;

export const getGroupState = (state: RootState): typeof state.group =>
  state.group;

export const getSelectedGroup =
(state: RootState): typeof state.group.selectedGroup =>
  state.group.selectedGroup;

export const getGroupCars =
(state: RootState): CarWithDriver[] | undefined =>
  state.group.selectedGroup?.cars;

export const getNotSelectedGroups = (state: RootState): GroupWithOwner[] => {
  const groups = getAllGroups(state);

  if (state.group.selectedGroup) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return groups.filter((g) => g.id !== state.group.selectedGroup!.id);
  } else {
    return groups;
  }
};

export const getMembers = (state: RootState): Member[] | undefined =>
  state.group.selectedGroup?.members;

export const getGroupInvites = (state: RootState):
InviteWithUserAndInviteSender[] | undefined =>
  state.group.selectedGroup?.invites;

export const isAdminOfSelectedGroup = createSelector(
  [getUser, getSelectedGroup],
  (user, group) => {
    if (user && group) {
      return isAdmin(group, user.id);
    }
  },
);

export const isOwnerOfSelectedGroup = createSelector(
  [getUser, getSelectedGroup],
  (user, selectedGroup) => {
    return user && selectedGroup && selectedGroup.ownerId === user.id;
  },
);
