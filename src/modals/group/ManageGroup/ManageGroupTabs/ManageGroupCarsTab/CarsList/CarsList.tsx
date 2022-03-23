import {List} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import CarsListItem from './CarsListItem';


/**
 * List of all cars.
 * @param props Props
 */
export const CarsList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;

  return (
    <List>
      {group.cars.map((car, index) => (
        <CarsListItem
          car={car}
          key={`car-${car.carId}`}
          divider={!(index === group.cars.length - 1)}
        />
      ))}
    </List>
  );
};

export default CarsList;
