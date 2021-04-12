import {Button, Grid, Box, Typography, Badge} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import React, {useState, useEffect} from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useTranslation} from 'react-i18next';
import {grey} from '@material-ui/core/colors';
import {GroupCarTheme, useAuth, useModalRouter} from 'lib';
import {useInvites} from 'lib/hooks/useInvites';

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
  const auth = useAuth();
  const {invites} = useInvites();
  const {goTo} = useModalRouter();

  /**
   * Store user info in state so that it doesn't
   * change while the popover for this component closes.
   */
  const [userInfo, setUserInfo] = useState<JSX.Element | null>(null);

  const {t} = useTranslation();

  const classes = useStyle();

  const handleLogout = () => {
    props.onClose && props.onClose();
    auth.logout();
  };

  useEffect(() => {
    // Only update the user info if the user changes
    if (auth.isLoggedIn && auth.user) {
      setUserInfo(
        <>
          <UserAvatar userId={auth.user && auth.user.id} size={100}/>
          <Typography align='center'>
            {auth.user && auth.user.username}
          </Typography>
          <Typography
            align='center'
            variant='caption'
            color='textSecondary'
          >
            {auth.user && auth.user.email}
          </Typography>
        </>,
      );
    }
    // eslint-disable-next-line
  }, [auth.user]);

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
            onClick={() => goTo('/invites')}
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
