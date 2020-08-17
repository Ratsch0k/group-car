import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dialog, DialogContent, useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/styles';
import {
  CloseableDialogTitle,
  PrivacyPolicy,
  useModalRouter,
  GroupCarTheme,
} from 'lib';

export const PrivacyPolicyDialog: React.FC = () => {
  const {close} = useModalRouter();
  const {t} = useTranslation();
  const theme: GroupCarTheme = useTheme();
  const largerLg = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Dialog open={true} maxWidth='lg' fullScreen={!largerLg}>
      <CloseableDialogTitle close={close}>
        {t('privacyPolicy.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <PrivacyPolicy />
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;

