import {Collapse, List} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getGroupCars} from 'lib/redux/slices/group';
import React from 'react';
import CarsListItem from './CarsListItem';
import {TransitionGroup} from 'react-transition-group';


/**
 * List of all cars.
 */
export const CarsList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cars = useShallowAppSelector(getGroupCars)!;

  if (!cars) {
    return null;
  }

  return (
    <List
    >
      <TransitionGroup
        component={null}
      >
        {cars.map((car, index) => (
          <Collapse key={`car-${car.carId}`}>
            <CarsListItem
              car={car}
              divider={!(index === cars.length - 1)}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
};

export default CarsList;
