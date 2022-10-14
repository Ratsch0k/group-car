import {Typography} from '@material-ui/core';
import React from 'react';
import {Trans} from 'react-i18next';

export interface PermissionDescription {
  name: string;
}

export const PermissionDescription =
({name}: PermissionDescription): JSX.Element => {
  return (
    <Typography>
      <Trans i18nKey={`modals.permissionPrompt.${name}.description`} />
    </Typography>
  );
};

export default PermissionDescription;
