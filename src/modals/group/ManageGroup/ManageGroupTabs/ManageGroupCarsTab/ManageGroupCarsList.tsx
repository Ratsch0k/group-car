import {List} from '@material-ui/core';
import {useAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import ManageGroupCarsListItem from './ManageGroupCarsListItem';


/**
 * List of all cars.
 * @param props Props
 */
export const ManageGroupCarsList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useAppSelector(getSelectedGroup)!;

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
