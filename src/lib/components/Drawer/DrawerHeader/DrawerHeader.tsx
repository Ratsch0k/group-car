import React from 'react';
import {Box, IconButton, makeStyles, createStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {GroupCarTheme} from 'lib';

interface DrawerHeaderProps {
  noCloseButton?: boolean;
  close?(): void;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    closeButton: {
      float: 'right',
    },
    root: {
      paddingRight: theme.spacing(3),
      height: theme.shape.headerHeight.default,
      alignItems: 'center',
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
          className={classes.closeButton}
          onClick={close}
        >
          <CloseIcon fontSize='large'/>
        </IconButton>
      }
    </Box>
  );
};

export default DrawerHeader;

