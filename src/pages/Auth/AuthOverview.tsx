import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import {Button} from '../../lib';
import {Trans, useTranslation} from 'react-i18next';

const useStyles = makeStyles({
  buttonContainer: {
    maxWidth: 300,
    width: '100%',
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
});


interface AuthButtonProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const AuthButton = (
  {children, onClick}: AuthButtonProps,
): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid item className={classes.buttonContainer}>
      <Button
        variant='contained'
        fullWidth
        onClick={onClick}
        color='primary'
        classes={{
          label: classes.buttonLabel,
        }}
      >
        {children}
      </Button>
    </Grid>
  );
};

export interface AuthOverviewProps {
  toLogin(): void;
  toSignUp(): void;
}

export const AuthOverview = (props: AuthOverviewProps): JSX.Element => {
  const {toLogin, toSignUp} = props;
  const {t} = useTranslation();

  return (
    <Container maxWidth='xs'>
      <Grid
        container
        direction='column'
        alignItems='center'
        spacing={4}
      >
        <Typography align='center' variant='h6' color='textSecondary'>
          {t('auth.title')}
        </Typography>
        <AuthButton onClick={toLogin}>
          {t('form.login')}
        </AuthButton>
        <AuthButton onClick={toSignUp}>
          {t('form.sign-up')}
        </AuthButton>
        <Typography color='textSecondary'>
          <Trans
            i18nKey='auth.tryDemo'
            components={[
              <Link
                referrerPolicy='no-referrer'
                target='_blank'
                href='https://demo.mygroupcar.de'
                key='demo-link'
              />,
            ]}
          />
        </Typography>
      </Grid>
    </Container>
  );
};

export default AuthOverview;
