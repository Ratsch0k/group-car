import {Box, createStyles, makeStyles, useMediaQuery} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import {useTheme} from '@material-ui/core';
import React from 'react';
import HeaderBarUserButton from './HeaderBarUserButton';
import {GroupCarTheme} from 'lib';
import clsx from 'clsx';
import Logo from '../Icons/Logo';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      display: 'flex',
      textAlign: 'left',
    },
    logo: {
      flexGrow: 1,
      display: 'flex',
      alignSelf: 'center',
    },
    appBar: {
      height: theme.shape.headerHeight,
    },
    smallIconButton: {
      padding: theme.spacing(1),
    },
  }),
);

/**
 * Props for the header bar.
 */
interface HeaderBarProps {
  /**
   * Callback to open the drawer.
   */
  openDrawer(): void;
  /**
   * Whether to show a button to open the drawer.
   */
  noMenuButton: boolean;
}

/**
 * HeaderBar component.
 * @param props Props.
 */
export const HeaderBar: React.FC<HeaderBarProps> = (props: HeaderBarProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.root}>
        <Box className={classes.logo}>
          <Logo />
        </Box>
        <HeaderBarUserButton />
        <IconButton
          color='inherit'
          className={clsx({[classes.smallIconButton]: smallerXs})}
          disabled
        >
          <EmojiTransportationIcon fontSize={smallerXs ? 'default' : 'large'}/>
        </IconButton>
        {
          !props.noMenuButton &&
          <IconButton
            color='inherit'
            onClick={props.openDrawer}
            className={clsx({[classes.smallIconButton]: smallerXs})}
          >
            <MenuIcon fontSize={smallerXs ? 'default' : 'large'}/>
          </IconButton>
        }
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
