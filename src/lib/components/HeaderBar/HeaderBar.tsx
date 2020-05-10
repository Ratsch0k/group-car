import React, {useContext, useEffect, useState} from 'react';
import {
  makeStyles,
  Popper,
  ClickAwayListener,
  Box,
  Paper,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import UserAvatar from '../UserAvatar';
import IconButton from '@material-ui/core/IconButton';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AuthContext from 'lib/context/auth/authContext';
import UserOverview from '../UserOverview/UserOverview';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: 'left',
  },
  title: {
    flexGrow: 1,
  },
});

const HeaderBar: React.FC = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [userId, setUserId] = useState<number>();
  const [userOverviewAnchor, setUserOverviewAnchor] =
      useState<HTMLElement | null>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    if (auth.user && auth.user.username) {
      setUserOverviewAnchor(event.currentTarget);
    } else {
      auth.openAuthDialog();
    }
  };

  const handleUserOverviewClose = () => {
    setUserOverviewAnchor(null);
  };

  useEffect(() => {
    if (auth.user && auth.user.id !== undefined) {
      setUserId(auth.user.id);
    } else {
      setUserId(undefined);
    }
  }, [auth.user]);

  return (
    <AppBar>
      <Toolbar className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Group Car
        </Typography>
        <ClickAwayListener
          onClickAway={handleUserOverviewClose}
        >
          <Box>
            <IconButton color='inherit' onClick={handleAvatarClick}>
              <UserAvatar
                userId={userId}
              />
            </IconButton>

            <Popper
              open={Boolean(userOverviewAnchor)}
              anchorEl={userOverviewAnchor}
              placement='bottom'
              disablePortal={true}
            >
              <Paper
                elevation={6}
              >
                <UserOverview
                  onClose={handleUserOverviewClose}
                />
              </Paper>
            </Popper>
          </Box>
        </ClickAwayListener>
        <IconButton color='inherit'>
          <EmojiTransportationIcon fontSize='large'/>
        </IconButton>
        <IconButton color='inherit'>
          <MenuIcon fontSize='large'/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
