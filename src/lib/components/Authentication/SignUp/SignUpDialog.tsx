import React from 'react';
import {
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import SignUpForm from './SignUpForm';

type Theme = import('@material-ui/core').Theme;

const SignUpDialog: React.FC = () => {
  const useStyle = makeStyles((theme: Theme) =>
    createStyles({
      formContainer: {
        padding: theme.spacing(2),
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
        <SignUpForm withSubmit/>
      </DialogContent>
    </Dialog>
  );
};


export default SignUpDialog;
