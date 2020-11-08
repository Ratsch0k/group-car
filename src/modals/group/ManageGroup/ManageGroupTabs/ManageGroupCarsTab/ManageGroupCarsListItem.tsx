import {ListItem, ListItemAvatar, ListItemText} from '@material-ui/core';
import {CarWithDriver} from 'lib';
import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import {useTranslation} from 'react-i18next';


export interface ManageGroupCarsListItemProps {
  car: CarWithDriver;
  key?: string;
  divider?: boolean;
}

export const ManageGroupCarsListItem: React.FC<ManageGroupCarsListItemProps> =
(props: ManageGroupCarsListItemProps) => {
  const {car, key, divider} = props;
  const {t} = useTranslation();
  const secondaryText = car.driverId === null ?
    t('misc.available') :
    t('modals.group.manage.tabs.cars.drivenBy', {driver: car.Driver?.username});

  return (
    <ListItem key={key} divider={divider}>
      <ListItemAvatar>
        <RoomIcon
          htmlColor={car.color}
          fontSize='large'
        />
      </ListItemAvatar>
      <ListItemText
        primary={car.name}
        secondary={secondaryText}
      />
    </ListItem>
  );
};

export default ManageGroupCarsListItem;

