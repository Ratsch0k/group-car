import {
  TabPanel,
} from 'lib';
import {RefObject, useEffect, useState} from 'react';
import {isAdmin as isAdminCheck} from 'lib/util';
import React from 'react';
import ManageGroupCarsTabAddFab from './ManageGroupCarsTabAddFab';
import {Portal} from '@material-ui/core';
import ManageGroupCarsList from './ManageGroupCarsList';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';

/**
 * Props for the cars tab.
 */
export interface ManageGRoupCarsTabProps {
  /**
   * Whether or not this component should be visible.
   */
  visible: boolean;

  /**
   * Will be forwarded to the top element.
   */
  className?: string;

  /**
   * Portal to display the fab.
   */
  fabPortal: RefObject<HTMLDivElement>;
}

/**
 * Cars tab for the group management.
 * @param props Props
 */
export const ManageGroupCarsTab: React.FC<ManageGRoupCarsTabProps> =
(props: ManageGRoupCarsTabProps) => {
  const {visible, className, fabPortal} = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  const user = useShallowAppSelector(getUser);
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
      <ManageGroupCarsList />
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
