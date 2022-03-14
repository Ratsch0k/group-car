import React, {FC} from 'react';
import {
  SettingsTabContent,
  SettingsTabContentProps,
} from '../../lib/components/Settings';
import UserAvatar from '../../lib/components/UserAvatar';
import {useShallowAppSelector} from '../../lib/redux/hooks';
import {getUser} from '../../lib/redux/slices/auth';
import {
  Container,
  createStyles,
  Grid,
  makeStyles, Typography,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {GroupCarTheme} from '../../lib';

const AccountLine: FC = (props) => {
  const classes = makeStyles((theme: GroupCarTheme) => createStyles({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: `${theme.spacing(1)}px 0`,
      padding: theme.spacing(1),
    },
  }))();

  const {children} = props;

  return (
    <Grid container item spacing={2} className={classes.root}>
      {children}
    </Grid>
  );
};

const AccountType: FC = (props) => {
  const classes = makeStyles({
    root: {
      flexBasis: 100,
    },
  })();

  const {children} = props;

  return (
    <Grid item className={classes.root} xs={12} sm='auto'>
      <Typography variant='body2' color='primary'>
        <b>
          {children}
        </b>
      </Typography>
    </Grid>
  );
};

const AccountValue: FC = (props) => {
  const {children} = props;

  return (
    <Grid item xs={12} sm='auto'>
      {children}
    </Grid>
  );
};

export const AppSettingsTabAccount: FC<SettingsTabContentProps<string>> = (
  props,
) => {
  const {index, value} = props;
  const user = useShallowAppSelector(getUser);
  const classes = makeStyles((theme: GroupCarTheme) => createStyles({
    avatar: {
      border: `${theme.palette.divider} 2px solid`,
    },
    values: {
      marginTop: theme.spacing(2),
    },
  }))();
  const {t} = useTranslation();

  return (
    <SettingsTabContent
      index={index}
      value={value}
      id='settings-account-tab-content'
    >
      <Container maxWidth='md'>
        <UserAvatar
          userId={user && user.id}
          size={150}
          className={classes.avatar}
        />
        <Container maxWidth='sm' className={classes.values}>
          <Grid container>
            <AccountLine>
              <AccountType>
                {t('misc.username')}
              </AccountType>
              <AccountValue>
                {user?.username}
              </AccountValue>
            </AccountLine>
            <AccountLine>
              <AccountType>
                {t('misc.email')}
              </AccountType>
              <AccountValue>
                {user?.email}
              </AccountValue>
            </AccountLine>
            <AccountLine>
              <AccountType>
                {t('settings.account.createdAt')}
              </AccountType>
              <AccountValue>
                {
                  user !== undefined &&
                  new Date(user.createdAt).toLocaleString()
                }
              </AccountValue>
            </AccountLine>
          </Grid>
        </Container>
      </Container>
    </SettingsTabContent>
  );
};

export default AppSettingsTabAccount;
