import React from 'react';
import {DialogTitle, IconButton} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import {GroupCarTheme} from 'lib';

type DialogTitleProps = import('@material-ui/core').DialogTitleProps;

interface CloseableDialogPropsProps extends DialogTitleProps {
  close(): void;
  disabled?: boolean;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    closeButton: {
      float: 'right',
      marginTop: `-${theme.spacing(1)}px`,
      marginRight: `-${theme.spacing(2)}px`,
    },
  }),
);

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
        disabled={props.disabled}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default CloseableDialogTitle;
