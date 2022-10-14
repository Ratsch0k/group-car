import {Collapse, List, Theme, useMediaQuery} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getGroupCars} from 'lib/redux/slices/group';
import React from 'react';
import CarsListItem from './CarsListItem';
import {TransitionGroup} from 'react-transition-group';
import CarsListEmpty from './CarsListEmpty';


/**
 * List of all cars.
 */
export const CarsList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cars = useShallowAppSelector(getGroupCars)!;
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  if (!cars) {
    return null;
  }

  if (cars.length === 0) {
    return <CarsListEmpty />;
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
              divider={smUp && !(index === cars.length - 1)}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
};

export default CarsList;
