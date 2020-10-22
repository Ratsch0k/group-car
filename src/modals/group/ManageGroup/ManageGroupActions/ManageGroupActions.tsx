import {Box} from '@material-ui/core';
import {GroupWithOwnerAndMembersAndInvites, useAuth} from 'lib';
import React from 'react';
import ManageGroupLeaveAction from './ManageGroupLeaveAction';

/**
 * Props for the ManageGroupActions component.
 */
export interface ManageGroupActionsProps {
  /**
   * The displayed group.
   */
  group: GroupWithOwnerAndMembersAndInvites;
}

/**
 * Actions for the ManageGroup component.
 * Used to display important actions at the bottom of the
 * ManageGroup component.
 * @param props Props
 */
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
