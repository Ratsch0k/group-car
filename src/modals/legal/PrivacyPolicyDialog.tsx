import React from 'react';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import {
  CloseableDialogTitle,
  PrivacyPolicy,
  useModalRouter,
  AutoFullscreenDialog,
} from 'lib';

export const PrivacyPolicyDialog: React.FC = () => {
  const {close} = useModalRouter();
  const {t} = useTranslation();

  return (
    <AutoFullscreenDialog open={true}>
      <CloseableDialogTitle close={close}>
        {t('privacyPolicy.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <PrivacyPolicy />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default PrivacyPolicyDialog;

