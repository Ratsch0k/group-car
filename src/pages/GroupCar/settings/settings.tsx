import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Settings from 'lib/components/Settings';
import Build from '@material-ui/icons/Build';
import AppSettingsTabSystem from './AppSettingsTabSystem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppSettingsTabAccount from './AppSettingsTabAccount';

export const AppSettings: FC = () => {
  const {t} = useTranslation();

  return (
    <Settings
      title={t('settings.title')}
      tabs={[
        {
          title: t('settings.account.title'),
          icon: <AccountCircleIcon/>,
          page: <AppSettingsTabAccount/>,
          path: 'account',
        },
        {
          title: t('settings.system.title'),
          icon: <Build />,
          page: <AppSettingsTabSystem />,
          path: 'system',
        },
      ]}
    />
  );
};

export default AppSettings;
