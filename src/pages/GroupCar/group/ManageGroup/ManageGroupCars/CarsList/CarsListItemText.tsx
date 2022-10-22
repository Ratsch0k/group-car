import {ListItemText, makeStyles} from '@material-ui/core';
import React from 'react';
import {Chip, CarWithDriver} from 'lib';
import {Trans, useTranslation} from 'react-i18next';

interface SecondaryTextProps {
  isDriven?: boolean;
  car: CarWithDriver;
}

/**
 * Secondary text for a car in the cars list.
 * @param isDriven Whether the car is currently driven
 * @param car The car
 */
const SecondaryText = ({isDriven, car}: SecondaryTextProps): JSX.Element => {
  const {t} = useTranslation();

  if (!isDriven) {
    return (
      <Chip
        label={t('misc.available')}
        color='primary'
        size='small'
      />
    );
  } else {
    return (
      <Trans
        i18nKey='modals.group.manage.tabs.cars.drivenBy'
        values={{driver: car.Driver?.username}}
      />
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

/**
 * ListText for a car in the cars list.
 * @param car Car for which the text is
 */
export const CarsListItemText =
({car}: ManageGroupCarsListItemTextProps): JSX.Element => {
  const classes = useStyles();

  return (
    <ListItemText
      primaryTypographyProps={{className: classes.primaryText}}
      primary={car.name}
      secondaryTypographyProps={{component: 'div'}}
      secondary={
        <SecondaryText isDriven={car.driverId !== null} car={car}/>
      }
    />
  );
};

export default CarsListItemText;
