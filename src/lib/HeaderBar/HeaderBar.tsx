import React from 'react';
import {makeStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '../Avatar/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: 'left',
  },
  toolbarIcon: {
    fontSize: 35,
  },
  title: {
    flexGrow: 1,
  },
});

const HeaderBar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Group Car
        </Typography>
        <Avatar iconName={classes.toolbarIcon} />
        <IconButton color="inherit">
          <EmojiTransportationIcon className={classes.toolbarIcon}/>
        </IconButton>
        <IconButton color="inherit">
          <MenuIcon className={classes.toolbarIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
