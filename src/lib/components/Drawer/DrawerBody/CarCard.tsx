import {Card, CardHeader} from '@material-ui/core';
import {CarWithDriver} from 'lib/api';
import React from 'react';
import RoomIcon from '@material-ui/icons/Room';

/**
 * Props for the car card.
 */
export interface CarCardProps {
  /**
   * The car to display.
   */
  car: CarWithDriver;
}

/**
 * Card to visualize a car.
 * @param props Props
 */
export const CarCard: React.FC<CarCardProps> = (props: CarCardProps) => {
  const {car} = props;

  return (
    <Card variant='outlined'>
      <CardHeader
        avatar={<RoomIcon fontSize='large' htmlColor={car.color}/>}
        title={car.name}
      />
    </Card>
  );
};

export default CarCard;
