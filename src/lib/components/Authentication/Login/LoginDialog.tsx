import React from 'react';
import LoginForm from './LoginForm';
import {
  Dialog,
  DialogTitle,
  Container,
  makeStyles,
  createStyles,
} from '@material-ui/core';

type Theme = import('@material-ui/core').Theme;

export const LoginDialog: React.FC = () => {
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
        Log in
      </DialogTitle>
      <Container className={classes.formContainer}>
        <LoginForm withSubmit />
      </Container>
    </Dialog>
  );
};

export default LoginDialog;
