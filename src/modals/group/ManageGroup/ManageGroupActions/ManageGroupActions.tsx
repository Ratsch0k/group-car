import {Box} from '@material-ui/core';
import {GroupWithOwnerAndMembersAndInvites} from 'lib';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth/authSelectors';
import React from 'react';
import ManageGroupDeleteAction from './ManageGroupDeleteAction';
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
  const user = useAppSelector(getUser);
  const {group} = props;

  let content: JSX.Element;
  if (user?.id === group.ownerId) {
    content = <ManageGroupDeleteAction groupId={group.id} />;
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
