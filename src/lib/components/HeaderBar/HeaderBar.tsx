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

/**
 * Styles.
 */
const useStyles = makeStyles<
GroupCarTheme,
{isSmall: boolean}
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
    appBar: ({isSmall}) => ({
      height: isSmall ?
        theme.shape.headerHeight.small :
        theme.shape.headerHeight.default,
      background: alpha(theme.palette.primary.light, 0.7),
      backdropFilter: 'blur(4px)',
      color: theme.palette.primary.dark,
    }),
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
  const classes = useStyles({isSmall: smallerXs});

  return (
    <AppBar className={classes.appBar}>
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
