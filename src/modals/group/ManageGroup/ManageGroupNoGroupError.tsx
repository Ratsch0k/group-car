import React from 'react';
import {Typography} from '@material-ui/core';
import {useTranslation} from 'react-i18next';

export const ManageGroupNoGroupError: React.FC = () => {
  const {t} = useTranslation();

  return (
    <Typography>
      {t('modal.group.manage.noGroup')}
    </Typography>
  );
};

export default ManageGroupNoGroupError;
