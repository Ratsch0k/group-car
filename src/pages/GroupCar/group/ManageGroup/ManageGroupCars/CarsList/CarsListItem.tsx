import {
  Divider,
  ListItem,
  ListItemAvatar,
} from '@material-ui/core';
import {CarWithDriver} from 'lib';
import React from 'react';
import getIcon from 'lib/util/getIcon';
import {CarsListItemActions} from './CarsListItemActions';
import CarsListItemText from './CarsListItemText';

/**
 * Props for the car list item.
 */
export interface ManageGroupCarsListItemProps {
  /**
   * Data of the car.
   */
  car: CarWithDriver;

  /**
   * Whether a divider should be placed under this item.
   */
  divider?: boolean;
}

/**
 * List item for the car list.
 * @param props Props
 */
export const CarsListItem: React.FC<ManageGroupCarsListItemProps> =
(props: ManageGroupCarsListItemProps) => {
  const {car, divider} = props;

  return (
    <>
      <ListItem
        id={`car-tab-${car.carId}`}
      >
        <ListItemAvatar>
          <img
            src={getIcon(car.color)}
            height='35x'
            width='35px'
            alt={`car-icon-${car.color}`}
          />
        </ListItemAvatar>
        <CarsListItemText car={car}/>
        <CarsListItemActions car={car} />
      </ListItem>
      {
        divider && <Divider variant='inset' />
      }
    </>
  );
};

export default CarsListItem;

