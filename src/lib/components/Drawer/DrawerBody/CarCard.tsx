import {Card, CardHeader, Typography} from '@material-ui/core';
import {CarWithDriver, RoleChip} from 'lib';
import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

  return (
    <Card variant='outlined'>
      <CardHeader
        avatar={<RoomIcon fontSize='large' htmlColor={car.color}/>}
        title={
          <>
            <Typography>
              {car.name}
            </Typography>
            {
              car.driverId === null ?
              <RoleChip
                color={'primary'}
                label={t('misc.available')}
                variant='outlined'
                size='small'
              /> :
              <Typography color='textSecondary'>
                {t('drawer.cars.drivenBy', {driver: car.Driver?.username})}
              </Typography>
            }
          </>
        }
      />
    </Card>
  );
};

export default CarCard;
