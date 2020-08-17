import React from 'react';
import {
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import SignUpBody from './SignUpBody';

type Theme = import('@material-ui/core').Theme;

const SignUpDialog: React.FC = () => {
  const useStyle = makeStyles((theme: Theme) =>
    createStyles({
      formContainer: {
        padding: theme.spacing(2),
        height: 430,
      },
    }),
  );

  const classes = useStyle();

  return (
    <Dialog open={true}>
      <DialogTitle>
        Sign up
      </DialogTitle>
      <DialogContent className={classes.formContainer}>
        <SignUpBody withSubmit/>
      </DialogContent>
    </Dialog>
  );
};


export default SignUpDialog;
