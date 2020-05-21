import {makeStyles} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import HeaderBarUserButton from './HeaderBarUserButton';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: 'left',
  },
  title: {
    flexGrow: 1,
  },
});

interface HeaderBarProps {
  openDrawer(): void;
  noMenuButton: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = (props: HeaderBarProps) => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Group Car
        </Typography>
        <HeaderBarUserButton />
        <IconButton color='inherit'>
          <EmojiTransportationIcon fontSize='large'/>
        </IconButton>
        {
          !props.noMenuButton &&
          <IconButton color='inherit' onClick={props.openDrawer}>
            <MenuIcon fontSize='large'/>
          </IconButton>
        }
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
