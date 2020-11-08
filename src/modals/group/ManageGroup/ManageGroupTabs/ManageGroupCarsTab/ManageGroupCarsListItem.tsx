import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {CarWithDriver, RoleChip} from 'lib';
import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import {useTranslation} from 'react-i18next';

/**
 * Props for the car list item.
 */
export interface ManageGroupCarsListItemProps {
  /**
   * Data of the car.
   */
  car: CarWithDriver;

  /**
   * Whether or not a divider should be placed under this item.
   */
  divider?: boolean;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  primaryText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});

/**
 * List item for the car list.
 * @param props Props
 */
export const ManageGroupCarsListItem: React.FC<ManageGroupCarsListItemProps> =
(props: ManageGroupCarsListItemProps) => {
  const classes = useStyles();
  const {car, divider} = props;
  const {t} = useTranslation();
  const secondaryText = car.driverId === null ?
    (
      <RoleChip
        variant='outlined'
        label={t('misc.available')}
        color='primary'
        size='small'
      />
    ) :
    t('modals.group.manage.tabs.cars.drivenBy', {driver: car.Driver?.username});

  return (
    <ListItem divider={divider}>
      <ListItemAvatar>
        <RoomIcon
          htmlColor={car.color}
          fontSize='large'
        />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{className: classes.primaryText}}
        primary={car.name}
        secondaryTypographyProps={{component: 'div'}}
        secondary={secondaryText}
      />
    </ListItem>
  );
};

export default ManageGroupCarsListItem;

