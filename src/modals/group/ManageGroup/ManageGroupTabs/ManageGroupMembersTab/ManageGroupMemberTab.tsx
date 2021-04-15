import {
  GroupWithOwnerAndMembersAndInvites,
  InviteWithUserAndInviteSender,
  TabPanel,
} from 'lib';
import React, {RefObject, useEffect, useState} from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import {isAdmin as isAdminCheck} from 'lib/util';
import ManageGroupMemberTabSearchUser from './ManageGroupMemberTabSearchUser';
import {Portal} from '@material-ui/core';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth/authSelectors';

/**
 * Props.
 */
export interface ManageGroupMembersTabProps {
  /**
   * The group to show the members of.
   */
  group: GroupWithOwnerAndMembersAndInvites;
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
  const user = useAppSelector(getUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    isAdminCheck(props.group, user?.id));
  const [additionalInvites, setAdditionalInvites] =
    useState<InviteWithUserAndInviteSender[]>([]);
  const [portal, setPortal] = useState(props.fabPortal.current);

  useEffect(() => {
    setPortal(props.fabPortal.current);
  }, [props.fabPortal]);

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
      <ManageGroupMemberList
        group={props.group}
        additionalInvites={additionalInvites}
      />
      {
        isAdmin &&
        <Portal container={portal}>
          <ManageGroupMemberTabSearchUser group={props.group}
            addInvite={(invite: InviteWithUserAndInviteSender) => {
              setAdditionalInvites((prev) => [...prev, invite]);
            }}/>
        </Portal>

      }
    </TabPanel>
  );
};

export default ManageGroupMembersTab;
