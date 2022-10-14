import {Typography} from '@material-ui/core';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {isAdminOfSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';

export const CarsListEmpty = (): JSX.Element => {
  const {t} = useTranslation();
  const isAdmin = useShallowAppSelector(isAdminOfSelectedGroup);

  return (
    <div>
      <Typography variant='h6'>
        {t('modals.group.manage.tabs.cars.emptyList.title')}
      </Typography>
      <Typography color='textSecondary' variant='body2'>
        <Trans
          i18nKey={
            isAdmin ?
              'modals.group.manage.tabs.cars.emptyList.adminDescription':
              'modals.group.manage.tabs.cars.emptyList.description'
          }
        />
      </Typography>
    </div>
  );
};

export default CarsListEmpty;
