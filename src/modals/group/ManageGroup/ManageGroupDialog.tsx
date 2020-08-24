import React from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  useModalRouter,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import ManageGroup from './ManageGroup';

export const ManageGroupDialog: React.FC = () => {
  const {t} = useTranslation();
  const {close} = useModalRouter();

  return (
    <AutoFullscreenDialog open={true} breakpoint='sm' maxWidth='sm' fullWidth>
      <CloseableDialogTitle close={close}>
        {t('modals.group.manage.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <ManageGroup />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default ManageGroupDialog;
