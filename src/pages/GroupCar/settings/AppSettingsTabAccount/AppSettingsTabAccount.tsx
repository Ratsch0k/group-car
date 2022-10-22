import React, {FC} from 'react';
import {
  Box,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {UserInfo} from './UserInfo';
import SettingsSection from 'lib/components/SettingsSection';
import Security from './Security';
import SettingsTabTitle from 'lib/components/Settings/SettingsTabTitle';


export const AppSettingsTabAccount: FC = () => {
  const {t} = useTranslation();

  return (
    <>
      <SettingsTabTitle>
        {t('settings.account.title')}
      </SettingsTabTitle>
      <Box>
        <SettingsSection title={t('settings.account.userInfo')}>
          <UserInfo />
        </SettingsSection>
        <SettingsSection title={t('settings.account.security.title')}>
          <Security />
        </SettingsSection>
      </Box>
    </>
  );
};

export default AppSettingsTabAccount;
