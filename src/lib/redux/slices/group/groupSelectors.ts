import {CarWithDriver} from 'lib';
import {RootState} from 'lib/redux/store';

export const getIsLoading = (state: RootState): boolean => state.group.loading;

export const getGroups =
(state: RootState): typeof state.group.groups => state.group.groups;

export const getGroupState = (state: RootState): typeof state.group =>
  state.group;

export const getSelectedGroup =
(state: RootState): typeof state.group.selectedGroup =>
  state.group.selectedGroup;

export const getGroupCars =
(state: RootState): CarWithDriver[] | undefined =>
  state.group.selectedGroup?.cars;
