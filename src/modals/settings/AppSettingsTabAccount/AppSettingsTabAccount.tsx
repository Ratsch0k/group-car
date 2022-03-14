import React, {FC} from 'react';
import {
  SettingsTabContent,
  SettingsTabContentProps,
} from '../../../lib/components/Settings';
import {
  Container,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {UserInfo} from './UserInfo';
import SettingsSection from '../../../lib/components/SettingsSection';
import Security from './Security';


export const AppSettingsTabAccount: FC<SettingsTabContentProps<string>> = (
  props,
) => {
  const {index, value} = props;
  const {t} = useTranslation();

  return (
    <SettingsTabContent
      index={index}
      value={value}
      id='settings-account-tab-content'
    >
      <Container maxWidth='md'>
        <SettingsSection title={t('settings.account.userInfo')}>
          <UserInfo />
        </SettingsSection>
        <SettingsSection title={t('settings.account.security.title')}>
          <Security />
        </SettingsSection>
      </Container>
    </SettingsTabContent>
  );
};

export default AppSettingsTabAccount;
