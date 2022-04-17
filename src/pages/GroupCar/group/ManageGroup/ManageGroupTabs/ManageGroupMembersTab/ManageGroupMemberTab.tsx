import {
  TabPanel,
} from 'lib';
import React, {RefObject, useEffect, useState} from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import {isAdmin as isAdminCheck} from 'lib/util';
import ManageGroupMemberTabSearchUser from './ManageGroupMemberTabSearchUser';
import {Portal} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';

/**
 * Props.
 */
export interface ManageGroupMembersTabProps {
  /**
   * Will be forwarded to the top element.
   */
  className?: string;
  /**
   * Whether this component should be visible.
   */
  visible: boolean;

  fabPortal: RefObject<HTMLDivElement>;
}

/**
 * The member tab in the group management dialog.
 * @param props Props
 */
export const ManageGroupMembersTab: React.FC<ManageGroupMembersTabProps> =
(props: ManageGroupMembersTabProps) => {
  const user = useShallowAppSelector(getUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  const [isAdmin, setIsAdmin] = useState<boolean>(
    isAdminCheck(group, user?.id));
  const [portal, setPortal] = useState(props.fabPortal.current);

  useEffect(() => {
    setPortal(props.fabPortal.current);
  }, [props.fabPortal]);

  // Update isAdmin state if either the group or the user changes
  useEffect(() => {
    setIsAdmin(isAdminCheck(group, user?.id));
  }, [user, group]);

  return (
    <TabPanel
      className={props.className}
      visible={props.visible}
      id='group-tabpanel-members'
      aria-labelledby='group-tab-members'
    >
      <ManageGroupMemberList />
      {
        isAdmin &&
        <Portal container={portal}>
          <ManageGroupMemberTabSearchUser />
        </Portal>

      }
    </TabPanel>
  );
};

export default ManageGroupMembersTab;
