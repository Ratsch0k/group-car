import React from 'react';
import {Button} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {useModalRouter} from 'lib';
import useGroups from 'lib/hooks/useGroups';
import GroupOptionsButton from './GroupOptionsButton';

export const DrawerBody: React.FC = () => {
  const {t} = useTranslation();
  const {goTo} = useModalRouter();
  const {groups} = useGroups();

  if (groups.length <= 0) {
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
  } else {
    return (
      <GroupOptionsButton />
    );
  }
};

export default DrawerBody;
