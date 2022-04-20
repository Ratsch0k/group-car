import {Grid, Box, Typography, Badge} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import React, {useState, useEffect} from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useTranslation} from 'react-i18next';
import {grey} from '@material-ui/core/colors';
import {Button, ButtonProps, GroupCarTheme} from 'lib';
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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useButtonStyles = makeStyles({
  root: {
    justifyContent: 'flex-start',
  },
});

const ListButton = (props: ButtonProps) => {
  const {classes, ...rest} = props;
  const styleClasses = useButtonStyles();

  return (
    <Button
      fullWidth
      color='primary'
      classes={{
        root: styleClasses.root,
        ...classes,
      }}
      {...rest}
    />
  );
};

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
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
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
        justifyContent='flex-start'
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
          <ListButton
            onClick={() => dispatch(goToModal('/invites'))}
          >
            <MailOutlineIcon fontSize='small' className={classes.buttonIcon} />
            <Badge
              color='secondary'
              badgeContent={invites.length}
              max={9}
            >
              {t('user.invites')}
            </Badge>
          </ListButton>
        </Grid>
        <Grid item>
          <ListButton
            onClick={() => dispatch(goToModal('/settings'))}
          >
            <SettingsIcon fontSize='small' className={classes.buttonIcon} />
            {t('user.settings')}
          </ListButton>
        </Grid>
        <Grid item>
          <ListButton
            data-testid='logout-button'
            color={undefined}
            onClick={handleLogout}
          >
            <ExitToAppIcon fontSize='small' className={classes.buttonIcon} />
            {t('form.logout')}
          </ListButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;
