import {Box} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import ManageGroupDeleteAction from './ManageGroupDeleteAction';
import ManageGroupLeaveAction from './ManageGroupLeaveAction';

/**
 * Actions for the ManageGroup component.
 * Used to display important actions at the bottom of the
 * ManageGroup component.
 * @param props Props
 */
export const ManageGroupActions: React.FC = () => {
  const user = useShallowAppSelector(getUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;

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
