import React from 'react';
import {GroupWithOwnerAndMembersAndInvites} from 'lib';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';
import ManageGroupTabs from './ManageGroupTabs';

export interface ManageGroupOverviewProps {
  group: GroupWithOwnerAndMembersAndInvites;
}

/**
 * Overview over the specified group.
 */
export const ManageGroupOverview: React.FC<ManageGroupOverviewProps> =
(props: ManageGroupOverviewProps) => {
  const {group} = props;

  return (
    <div>
      <div>
        <ManageGroupOverviewInfo group={group}/>
      </div>
      <div>
        <ManageGroupTabs group={group}/>
      </div>
    </div>
  );
};

export default ManageGroupOverviewProps;
