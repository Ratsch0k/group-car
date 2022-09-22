import {
  alpha,
  Box,
  createStyles,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import {useTheme} from '@material-ui/core';
import React from 'react';
import HeaderBarUserButton from './HeaderBarUserButton';
import {GroupCarTheme} from 'lib';
import clsx from 'clsx';
import Logo from '../Icons/Logo';
import {isFirefox} from 'react-device-detect';

/**
 * Styles.
 */
const useStyles = makeStyles<
GroupCarTheme,
{isMedium: boolean}
>((theme: GroupCarTheme) =>
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
    appBar: ({isMedium}) => ({
      color: theme.palette.primary.main,
      left: 0,
      width: isMedium ? '100%' : `calc(100% - ${theme.shape.drawerWidth}px)`,
    }),
    blurred: {
      background: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: theme.palette.blur,
    },
    plain: {
      background: theme.palette.background.paper,
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
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const largerLg = useMediaQuery(theme.breakpoints.up('lg'));
  const classes = useStyles({isMedium: !largerLg});

  return (
    <AppBar
      className={clsx(
        classes.appBar,
        isFirefox ? classes.plain : classes.blurred,
      )}
      elevation={0}
    >
      <Toolbar
        className={classes.root}
        variant={smallerXs ? 'dense' : 'regular'}
      >
        <Box className={classes.logo}>
          <Logo fontSize={smallerXs ? 'default' : 'large'}/>
        </Box>
        <HeaderBarUserButton />
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
