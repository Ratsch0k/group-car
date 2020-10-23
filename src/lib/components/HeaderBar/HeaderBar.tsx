import {createStyles, makeStyles, useMediaQuery} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import MenuIcon from '@material-ui/icons/Menu';
import {useTheme} from '@material-ui/core';
import React from 'react';
import HeaderBarUserButton from './HeaderBarUserButton';
import {GroupCarTheme} from 'lib';
import clsx from 'clsx';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: 'left',
    },
    title: {
      flexGrow: 1,
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
   * Whether or not to show a button to open the drawer.
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
        <Typography className={classes.title} variant={smallerXs ? 'h5' : 'h4'}>
          Group Car
        </Typography>
        <HeaderBarUserButton />
        <IconButton
          color='inherit'
          className={clsx({[classes.smallIconButton]: smallerXs})}
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
