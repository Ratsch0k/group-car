import {
  GroupWithOwnerAndMembersAndInvitesAndCars,
  GroupWithOwner,
} from '../../../api/index';
import {EntityState} from '@reduxjs/toolkit';

export interface GroupState extends EntityState<GroupWithOwner> {
  /**
   * The selected group.
   *
   * If no group is selected this is null.
   */
  selectedGroup: GroupWithOwnerAndMembersAndInvitesAndCars | null;

  /**
   * Whether some request is currently loading.
   */
  loading: boolean;
}

export default GroupState;
