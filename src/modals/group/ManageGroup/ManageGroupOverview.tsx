import React from 'react';
import {GroupWithOwnerAndMembers} from 'lib';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';
import ManageGroupTabs from './ManageGroupTabs';
import {makeStyles} from '@material-ui/styles';

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
