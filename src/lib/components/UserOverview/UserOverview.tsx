import {Button, Grid, Box, Typography, Badge} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import React, {useState, useEffect} from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useTranslation} from 'react-i18next';
import {grey} from '@material-ui/core/colors';
import {GroupCarTheme} from 'lib';
import {useInvites} from 'lib/hooks/useInvites';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getIsLoggedIn, getUser, logout} from 'lib/redux/slices/auth';

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
  }),
);

interface UserOverviewProps {
  onClose?(): void;
}

export const UserOverview: React.FC<UserOverviewProps> =
(props: UserOverviewProps) => {
  const {invites} = useInvites();
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const user = useAppSelector(getUser);
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
            <Badge
              color='secondary'
              badgeContent={invites.length}
              max={9}
            >
              {t('user.invites')}
            </Badge>
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
