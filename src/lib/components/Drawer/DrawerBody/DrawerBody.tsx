import React from 'react';
import {Button} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {useModalRouter} from 'lib';

export const DrawerBody: React.FC = () => {
  const {t} = useTranslation();
  const {goTo} = useModalRouter();

  return (
    <Button
      fullWidth
      disableElevation
      color='primary'
      variant='contained'
      onClick={() => goTo('/group/create')}
    >
      {t('drawer.createGroup')}
    </Button>
  );
};

export default DrawerBody;
