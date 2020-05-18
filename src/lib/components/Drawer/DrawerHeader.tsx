import React from 'react';
import {Box, IconButton, makeStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface DrawerHeaderProps {
  close(): void;
  noCloseButton?: boolean;
}

const useStyles = makeStyles({
  closeButton: {
    float: 'right',
  },
});

const DrawerHeader: React.FC<DrawerHeaderProps> =
(props: DrawerHeaderProps) => {
  const classes = useStyles();
  const {
    noCloseButton,
  } = props;

  return (
    <Box>
      {
        !noCloseButton &&
        <IconButton
          className={classes.closeButton}
          onClick={props.close}
        >
          <CloseIcon fontSize='large'/>
        </IconButton>
      }
    </Box>
  );
};

export default DrawerHeader;

