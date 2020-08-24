import React from 'react';
import {GroupWithOwnerAndMembers} from 'lib';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';

export interface ManageGroupOverviewProps {
  group: GroupWithOwnerAndMembers;
}

/**
 * Overview over the specified group.
 */
export const ManageGroupOverview: React.FC<ManageGroupOverviewProps> =
(props: ManageGroupOverviewProps) => {
  const {group} = props;

  return (
    <ManageGroupOverviewInfo group={group}/>
  );
};

export default ManageGroupOverviewProps;
