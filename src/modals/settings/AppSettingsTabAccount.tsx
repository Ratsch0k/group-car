import React, {FC} from 'react';
import {
  SettingsTabContent,
  SettingsTabContentProps,
} from '../../lib/components/Settings';
import UserAvatar from '../../lib/components/UserAvatar';
import {useShallowAppSelector} from '../../lib/redux/hooks';
import {getUser} from '../../lib/redux/slices/auth';
import {createStyles, makeStyles, Typography} from '@material-ui/core';
import shadows from '@material-ui/core/styles/shadows';
import {useTranslation} from 'react-i18next';
import {GroupCarTheme} from '../../lib';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  avatar: {
    boxShadow: shadows[5],
  },
  info: {
    marginTop: theme.spacing(1),
  },
}));

export const AppSettingsTabAccount: FC<SettingsTabContentProps<string>> = (
  props,
) => {
  const {index, value} = props;
  const user = useShallowAppSelector(getUser);
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <SettingsTabContent index={index} value={value}>
      <UserAvatar
        userId={user && user.id}
        size={100}
        className={classes.avatar}
      />
      <Typography align='center'>
        <b>{t('misc.email')}:</b>{' '}
        {user?.email}
      </Typography>
    </SettingsTabContent>
  );
};

export default AppSettingsTabAccount;
