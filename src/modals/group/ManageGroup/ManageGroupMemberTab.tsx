import {
  GroupWithOwnerAndMembers,
  TabPanel,
  useAuth,
} from 'lib';
import React, {useEffect, useState} from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import {isAdmin as isAdminCheck} from '../../../util';
import ManageGroupMemberTabSearchUser from './ManageGroupMemberTabSearchUser';

/**
 * Props.
 */
export interface ManageGroupMembersTab {
  /**
   * The group to show the members of.
   */
  group: GroupWithOwnerAndMembers;
  /**
   * Will be forwarded to the top element.
   */
  className?: string;
  /**
   * Whether this component should be visible.
   */
  visible: boolean;
}

/**
 * The member tab in the group management dialog.
 * @param props Props
 */
export const ManageGroupMembersTab: React.FC<ManageGroupMembersTab> =
(props: ManageGroupMembersTab) => {
  const {user} = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(
      isAdminCheck(props.group, user?.id));

  // Update isAdmin state if either the group or the user changes
  useEffect(() => {
    setIsAdmin(isAdminCheck(props.group, user?.id));
  }, [user, props.group]);

  return (
    <TabPanel
      className={props.className}
      visible={props.visible}
      id='group-tabpanel-members'
      aria-labelledby='group-tab-members'
    >
      <ManageGroupMemberList group={props.group}/>
      {
        isAdmin &&
        <ManageGroupMemberTabSearchUser group={props.group} />
      }
    </TabPanel>
  );
};

export default ManageGroupMembersTab;
