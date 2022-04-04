import React from 'react';
import {
  Box,
  IconButton,
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {GroupCarTheme} from 'lib';

interface DrawerHeaderProps {
  noCloseButton?: boolean;
  close?(): void;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing(2),
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      ...theme.mixins.toolbar,
    },
  }),
);

/**
 * Top header for the drawer
 * @param props Props for the component
 */
export const DrawerHeader: React.FC<DrawerHeaderProps> =
(props: DrawerHeaderProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isLessEqualXs = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    noCloseButton,
    close,
  } = props;

  return (
    <Box className={classes.root}>
      {
        !noCloseButton &&
        <IconButton
          id='drawer-close'
          data-testid='close'
          onClick={close}
        >
          <CloseIcon fontSize={isLessEqualXs ? 'medium' : 'large'}/>
        </IconButton>
      }
    </Box>
  );
};

export default DrawerHeader;

