import {Button, Grid, Box, Typography, Badge} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import React, {useState, useEffect} from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useTranslation} from 'react-i18next';
import {grey} from '@material-ui/core/colors';
import {GroupCarTheme} from 'lib';
import {
  useAppDispatch,
  useAppSelector,
  useShallowAppSelector,
} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getIsLoggedIn, getUser, logout} from 'lib/redux/slices/auth';
import {getAllInvites} from 'lib/redux/slices/invites';
import SettingsIcon from '@material-ui/icons/Settings';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const useStyle = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
    userInfo: {
      border: `1px solid ${grey[500]}`,
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
      minWidth: 180,
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
      height: 24,
      marginLeft: theme.spacing(3),
    },
  }),
);

interface UserOverviewProps {
  onClose?(): void;
}

export const UserOverview: React.FC<UserOverviewProps> =
(props: UserOverviewProps) => {
  const invites = useShallowAppSelector(getAllInvites);
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const user = useShallowAppSelector(getUser);
  const dispatch = useAppDispatch();

  /**
   * Store user info in state so that it doesn't
   * change while the popover for this component closes.
   */
  const [userInfo, setUserInfo] = useState<JSX.Element | null>(null);

  const {t} = useTranslation();

  const classes = useStyle();

  const handleLogout = () => {
    props.onClose && props.onClose();
    dispatch(logout());
  };

  useEffect(() => {
    // Only update the user info if the user changes
    if (isLoggedIn && user) {
      setUserInfo(
        <>
          <UserAvatar userId={user && user.id} size={100}/>
          <Typography align='center'>
            {user && user.username}
          </Typography>
          <Typography
            align='center'
            variant='caption'
            color='textSecondary'
          >
            {user && user.email}
          </Typography>
        </>,
      );
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <Box className={classes.container}>
      <Grid
        container
        direction='column'
        justify='flex-start'
        alignItems='stretch'
        spacing={1}
      >
        <Grid
          item
          className={classes.userInfo}
        >
          {userInfo}
        </Grid>
        <Grid item>

          <Button
            fullWidth
            color='primary'
            onClick={() => dispatch(goToModal('/invites'))}
          >
            <Grid container justify='flex-start' alignItems='center'>
              <Grid item className={classes.buttonIcon}>
                <MailOutlineIcon fontSize='small'/>
              </Grid>
              <Grid item>
                <Badge
                  color='secondary'
                  badgeContent={invites.length}
                  max={9}
                >
                  {t('user.invites')}
                </Badge>
              </Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            color='primary'
            onClick={() => dispatch(goToModal('/settings'))}
          >
            <Grid container justify='flex-start' alignItems='center'>
              <Grid item className={classes.buttonIcon}>
                <SettingsIcon fontSize='small'/>
              </Grid>
              <Grid item>
                {t('user.settings')}
              </Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item>
          <Button
            data-testid='logout-button'
            color='primary'
            variant='contained'
            onClick={handleLogout}
            fullWidth
          >
            {t('form.logout')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;
