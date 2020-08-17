import React from 'react';
import {DialogTitle, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';

type DialogTitleProps = import('@material-ui/core').DialogTitleProps;

interface CloseableDialogPropsProps extends DialogTitleProps {
  close(): void;
}

const useStyles = makeStyles({
  closeButton: {
    float: 'right',
  },
});

export const CloseableDialogTitle: React.FC<CloseableDialogPropsProps> =
(props: CloseableDialogPropsProps) => {
  const classes = useStyles();

  const {close, ...rest} = props;

  return (
    <DialogTitle {...rest}>
      {props.children}
      <IconButton
        className={classes.closeButton}
        onClick={close}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default CloseableDialogTitle;
