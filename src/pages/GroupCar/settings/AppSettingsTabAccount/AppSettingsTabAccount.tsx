import React, {FC} from 'react';
import {
  Box,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {UserInfo} from './UserInfo';
import SettingsSection from 'lib/components/SettingsSection';
import Security from './Security';


export const AppSettingsTabAccount: FC = () => {
  const {t} = useTranslation();

  return (
    <Box>
      <SettingsSection title={t('settings.account.userInfo')}>
        <UserInfo />
      </SettingsSection>
      <SettingsSection title={t('settings.account.security.title')}>
        <Security />
      </SettingsSection>
    </Box>
  );
};

export default AppSettingsTabAccount;
