import {List} from '@material-ui/core';
import {GroupWithOwnerAndMembersAndInvitesAndCars} from 'lib';
import React from 'react';
import ManageGroupCarsListItem from './ManageGroupCarsListItem';

/**
 * Props for the manage group cars list.
 */
export interface ManageGroupCarsListProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvitesAndCars;
}

/**
 * List of all cars.
 * @param props Props
 */
export const ManageGroupCarsList: React.FC<ManageGroupCarsListProps> =
(props: ManageGroupCarsListProps) => {
  const {group} = props;

  return (
    <List>
      {group.cars.map((car, index) => (
        <ManageGroupCarsListItem
          car={car}
          key={`car-${car.carId}`}
          divider={!(index === group.cars.length - 1)}
        />
      ))}
    </List>
  );
};

export default ManageGroupCarsList;
