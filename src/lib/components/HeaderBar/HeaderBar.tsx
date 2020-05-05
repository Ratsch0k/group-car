import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '../Avatar';
import IconButton from '@material-ui/core/IconButton';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AuthContext from 'lib/context/auth/authContext';

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

  const handleAvatarClick = () => {
    if (auth.user && auth.user.username) {

    } else {
      auth.openAuthDialog();
    }
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
        <IconButton color='inherit' onClick={handleAvatarClick}>
          <Avatar
            userId={userId}
          />
        </IconButton>
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
