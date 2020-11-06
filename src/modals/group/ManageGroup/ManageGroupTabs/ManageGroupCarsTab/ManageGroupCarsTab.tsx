import {
  GroupWithOwnerAndMembersAndInvites,
  useAuth,
  TabPanel,
} from 'lib';
import {RefObject, useEffect, useState} from 'react';
import {isAdmin as isAdminCheck} from 'lib/util';
import React from 'react';
import ManageGroupCarsTabAddFab from './ManageGroupCarsTabAddFab';
import {Portal} from '@material-ui/core';

/**
 * Props for the cars tab.
 */
export interface ManageGRoupCarsTabProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvites;

  /**
   * Whether or not this component should be visible.
   */
  visible: boolean;

  /**
   * Will be forwarded to the top element.
   */
  className?: string;

  fabPortal: RefObject<HTMLDivElement>;
}

/**
 * Cars tab for the group management.
 * @param props Props
 */
export const ManageGroupCarsTab: React.FC<ManageGRoupCarsTabProps> =
(props: ManageGRoupCarsTabProps) => {
  const {group, visible, className, fabPortal} = props;
  const {user} = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(
      isAdminCheck(group, user?.id));


  useEffect(() => {
    setIsAdmin(isAdminCheck(group, user?.id));
  }, [user, group]);


  return (
    <TabPanel
      className={className}
      visible={visible}
      id='group-tabpanel-cars'
      aria-labelledby='group-tab-cars'
    >
      {
        isAdmin &&
        <Portal container={fabPortal.current} >
          <ManageGroupCarsTabAddFab />
        </Portal>
      }
    </TabPanel>
  );
};

export default ManageGroupCarsTab;
