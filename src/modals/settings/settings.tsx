import React, {FC} from 'react';
import {AutoFullscreenDialog, CloseableDialogTitle} from '../../lib';
import {useDispatch} from 'react-redux';
import {closeModal} from '../../lib/redux/slices/modalRouter/modalRouterSlice';
import {useTranslation} from 'react-i18next';

export const Settings: FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  return (
    <AutoFullscreenDialog open={true} fullWidth maxWidth='md'>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('settings.title')}
      </CloseableDialogTitle>
    </AutoFullscreenDialog>
  );
};

export default Settings;
