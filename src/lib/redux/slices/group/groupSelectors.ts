import {GroupWithOwner} from 'lib';
import {RootState} from 'lib/redux/store';

export const getIsLoading = (state: RootState): boolean => state.group.loading;
export const getGroups =
(state: RootState): GroupWithOwner[] => state.group.groups;
