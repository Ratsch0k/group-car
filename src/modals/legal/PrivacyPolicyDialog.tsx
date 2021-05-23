import React from 'react';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import {
  CloseableDialogTitle,
  PrivacyPolicy,
  AutoFullscreenDialog,
} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';

export const PrivacyPolicyDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  return (
    <AutoFullscreenDialog open={true}>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('privacyPolicy.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <PrivacyPolicy />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default PrivacyPolicyDialog;

