import React from 'react';
import {DialogTitle, Grid, IconButton} from '@material-ui/core';
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
      flex: '0 0 auto',
      marginTop: `-${theme.spacing(1)}px`,
      marginRight: `-${theme.spacing(2)}px`,
    },
    title: {
      flex: '1 1 auto',
    },
  }),
);

export const CloseableDialogTitle: React.FC<CloseableDialogPropsProps> =
(props: CloseableDialogPropsProps) => {
  const classes = useStyles();

  const {close, ...rest} = props;

  return (
    <DialogTitle {...rest}>
      <Grid container>
        <Grid item className={classes.title}>
          {props.children}
        </Grid>
        <Grid item className={classes.closeButton}>
          <IconButton
            onClick={close}
            disabled={props.disabled}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </DialogTitle>
  );
};

export default CloseableDialogTitle;
