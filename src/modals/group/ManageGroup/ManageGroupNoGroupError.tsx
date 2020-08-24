import React from 'react';
import {Typography} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {Centered} from 'lib';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

/**
 * Component for handling and showing top level error
 * regarding managing group.
 */
export const ManageGroupErrorHandler: React.FC = () => {
  const {t} = useTranslation();

  return (
    <Centered>
      <ErrorOutlineIcon color='error' fontSize='large'/>
      <Typography variant='subtitle1' color="textSecondary">
        {t('modals.group.manage.loadingFailed')}
      </Typography>
    </Centered>
  );
};

export default ManageGroupErrorHandler;
