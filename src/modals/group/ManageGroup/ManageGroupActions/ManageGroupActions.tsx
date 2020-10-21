import {Box} from '@material-ui/core';
import {GroupWithOwnerAndMembersAndInvites, useAuth} from 'lib';
import React from 'react';
import ManageGroupLeaveAction from './ManageGroupLeaveAction';

export interface ManageGroupActionsProps {
  group: GroupWithOwnerAndMembersAndInvites;
}

export const ManageGroupActions: React.FC<ManageGroupActionsProps> =
(props: ManageGroupActionsProps) => {
  const {user} = useAuth();
  const {group} = props;

  let content: JSX.Element;
  if (user?.id === group.ownerId) {
    content = <div></div>;
  } else {
    content = <ManageGroupLeaveAction groupId={group.id} />;
  }

  return (
    <Box>
      {content}
    </Box>
  );
};

export default ManageGroupActions;
