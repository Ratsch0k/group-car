import {ButtonProps} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import {Button} from 'lib';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const AddCarButton =
(props: Pick<ButtonProps, 'onClick'>): JSX.Element => {
  const {t} = useTranslation();
  const {onClick} = props;

  return (
    <Button
      size='large'
      variant='contained'
      color='primary'
      startIcon={<Add />}
      onClick={onClick}
      disableCapitalization
    >
      {t('modals.group.manage.tabs.cars.addCar.button')}
    </Button>
  );
};

export default AddCarButton;
