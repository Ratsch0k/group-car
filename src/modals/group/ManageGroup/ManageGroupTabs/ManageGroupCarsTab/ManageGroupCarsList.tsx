import {List} from '@material-ui/core';
import {CarWithDriver, GroupWithOwnerAndMembersAndInvitesAndCars} from 'lib';
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

  /**
   * Additional cars which the user has created.
   */
  additionalCars: CarWithDriver[];
}

/**
 * List of all cars.
 * @param props Props
 */
export const ManageGroupCarsList: React.FC<ManageGroupCarsListProps> =
(props: ManageGroupCarsListProps) => {
  const {group, additionalCars} = props;

  return (
    <List>
      {group.cars.map((car, index) => (
        <ManageGroupCarsListItem
          car={car}
          key={`car-${car.carId}`}
          divider={!(additionalCars.length === 0 &&
            index === group.cars.length - 1)}
        />
      ))}
      {additionalCars.map((car, index) => (
        <ManageGroupCarsListItem
          car={car}
          key={`car-${car.carId}`}
          divider={index !== additionalCars.length - 1}
        />
      ))}
    </List>
  );
};

export default ManageGroupCarsList;
