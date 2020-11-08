import {
  useAuth,
  TabPanel,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  CarWithDriver,
} from 'lib';
import {RefObject, useEffect, useState} from 'react';
import {isAdmin as isAdminCheck} from 'lib/util';
import React from 'react';
import ManageGroupCarsTabAddFab from './ManageGroupCarsTabAddFab';
import {Portal} from '@material-ui/core';
import ManageGroupCarsList from './ManageGroupCarsList';

/**
 * Props for the cars tab.
 */
export interface ManageGRoupCarsTabProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvitesAndCars;

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
  const {group, visible, className, fabPortal} = props;
  const {user} = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(
      isAdminCheck(group, user?.id));
  const [additionalCars, setAdditionalCars] = useState<CarWithDriver[]>([]);

  useEffect(() => {
    setIsAdmin(isAdminCheck(group, user?.id));
  }, [user, group]);

  const addCar = (car: CarWithDriver) => {
    setAdditionalCars((prev) => prev.concat(car));
  };

  return (
    <TabPanel
      className={className}
      visible={visible}
      id='group-tabpanel-cars'
      aria-labelledby='group-tab-cars'
    >
      <ManageGroupCarsList group={group} additionalCars={additionalCars}/>
      {
        isAdmin &&
        <Portal container={fabPortal.current} >
          <ManageGroupCarsTabAddFab
            group={group}
            addCar={addCar}
            additionalCars={additionalCars}
          />
        </Portal>
      }
    </TabPanel>
  );
};

export default ManageGroupCarsTab;
