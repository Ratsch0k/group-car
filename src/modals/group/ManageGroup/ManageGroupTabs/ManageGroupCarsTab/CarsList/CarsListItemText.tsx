import {ListItemText, makeStyles} from '@material-ui/core';
import React from 'react';
import {RoleChip, CarWithDriver} from 'lib';
import {useTranslation} from 'react-i18next';

interface SecondaryTextProps {
  isDriven?: boolean;
  car: CarWithDriver;
}

const SecondaryText = ({isDriven, car}: SecondaryTextProps): JSX.Element => {
  const {t} = useTranslation();

  if (isDriven) {
    return (
      <RoleChip
        variant='outlined'
        label={t('misc.available')}
        color='primary'
        size='small'
      />
    );
  } else {
    return t(
      'modals.group.manage.tabs.cars.drivenBy',
      {driver: car.Driver?.username},
    );
  }
};

const useStyles = makeStyles({
  primaryText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});

export interface ManageGroupCarsListItemTextProps {
  car: CarWithDriver;
}

export const CarsListItemText =
({car}: ManageGroupCarsListItemTextProps): JSX.Element => {
  const classes = useStyles();

  return (
    <ListItemText
      primaryTypographyProps={{className: classes.primaryText}}
      primary={car.name}
      secondaryTypographyProps={{component: 'div'}}
      secondary={
        <SecondaryText isDriven={car.driverId !== undefined} car={car}/>
      }
    />
  );
};

export default CarsListItemText;
