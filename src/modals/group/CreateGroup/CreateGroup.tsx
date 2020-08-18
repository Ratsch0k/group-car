import React from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  useModalRouter,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import CreateGroupForm from './CreateGroupForm';

export const CreateGroup: React.FC = () => {
  const {close} = useModalRouter();
  const {t} = useTranslation();

  return (
    <AutoFullscreenDialog open={true} fullWidth>
      <CloseableDialogTitle close={close}>
        {t('modals.group.create.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <CreateGroupForm />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default CreateGroup;
