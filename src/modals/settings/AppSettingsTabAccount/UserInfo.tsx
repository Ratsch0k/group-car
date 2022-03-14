import UserAvatar from '../../../lib/components/UserAvatar';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useShallowAppSelector} from '../../../lib/redux/hooks';
import {getUser} from '../../../lib/redux/slices/auth';
import {GroupCarTheme} from '../../../lib';
import AttributeField from '../../../lib/components/AttributeField';
import {
  AttributeFieldProps,
} from '../../../lib/components/AttributeField/AtttributeField';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  avatar: {
    border: `${theme.palette.divider} 2px solid`,
    margin: '0px !important',
  },
  values: {
    marginTop: theme.spacing(2),
  },
}));

const Field = (props: AttributeFieldProps) => {
  return (
    <Grid item>
      <AttributeField {...props} />
    </Grid>
  );
};

export const UserInfo = (): JSX.Element => {
  const {t} = useTranslation();
  const user = useShallowAppSelector(getUser);
  const classes = useStyles();

  return (
    <>
      <UserAvatar
        userId={user && user.id}
        size={150}
        className={classes.avatar}
      />
      <Box className={classes.values}>
        <Grid container direction='column' wrap='nowrap'>
          <Field label={t('misc.username')}>
            {user?.username}
          </Field>
          <Field label={t('misc.email')}>
            {user?.email}
          </Field>
          <Field label={t('misc.createdAt')}>
            {
              user !== undefined &&
              new Date(user.createdAt).toLocaleString()
            }
          </Field>
        </Grid>
      </Box>
    </>
  );
};
