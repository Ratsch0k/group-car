import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  makeStyles,
  createStyles,
  Container,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, {useState, useEffect, useContext} from 'react';
import {LoginForm} from '../../lib/components/Authentication/Login';
import {useTranslation} from 'react-i18next';
import AuthContext from 'lib/context/auth/authContext';
import CloseIcon from '@material-ui/icons/Close';
import {Route, Switch, useRouteMatch, useLocation} from 'react-router-dom';
import useModalRouter from 'lib/hooks/useModalRouter';
import SignUpBody from 'lib/components/Authentication/SignUp/SignUpBody';

type Theme = import('@material-ui/core').Theme;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
    },
    divider: {
      margin: theme.spacing(2),
    },
    dividerContainer: {
      position: 'relative',
    },
    dividerText: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      margin: 'auto',
      top: '50%',
      right: '50%',
      position: 'absolute',
      transform: 'translate(50%, -50%)',
      background: theme.palette.background.paper,
    },
    closeButton: {
      float: 'right',
    },
  }),
);

interface AuthenticationDialogProps {
  open: boolean;
  close(): void;
}

const AuthenticationDialog: React.FC<AuthenticationDialogProps> =
(props: AuthenticationDialogProps) => {
  const classes = useStyle();
  const {t} = useTranslation();
  const auth = useContext(AuthContext);
  const {goTo} = useModalRouter();
  const {path, isExact} = useRouteMatch();
  const {pathname} = useLocation();
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles navigation to sign up page
   */
  const handleSignUp = () => {
    goTo(`${path}/sign-up`);
  };

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    goTo(`${path}/login`);
  };

  /**
   * Handles go back action
   */
  const handleBack = () => {
    goTo(undefined);
  };

  /**
   * Navigates to the page from which auth was called.
   */
  const onFinished = () => {
    setLoading(false);
    props.close();
  };

  /**
   * Checks every time the `isLoggedIn` attribute changes
   * if the client is authenticated. If it is go to the origin.
   */
  useEffect(() => {
    if (auth.isLoggedIn) {
      onFinished();
    }
    // eslint-disable-next-line
  }, [auth.isLoggedIn]);

  return (
    <Dialog open={props.open} fullWidth maxWidth='xs'>
      <DialogTitle>
        <IconButton
          id='auth-go-back'
          edge='start'
          disableRipple
          disabled={loading}
          onClick={handleBack}
          style={{visibility: isExact ? 'hidden' : 'visible'}}
        >
          <ArrowBackIcon/>
        </IconButton>
        {
          isExact ?
          t('auth.dialog.title.authenticate') :
          t(`auth.dialog.title.${pathname}`)
        }
        <IconButton
          className={classes.closeButton}
          onClick={onFinished}
          disabled={loading}
          id='auth-close-dialog'
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Switch>
          <Route path={`${path}/login`}>
            <LoginForm
              withSubmit
              onFinished={onFinished}
              setLoading={setLoading}
            />
          </Route>
          <Route path={`${path}/sign-up`}>
            <SignUpBody
              withSubmit
              onFinished={onFinished}
              setLoading={setLoading}
            />
          </Route>
          <Route exact path={path}>
            <Button
              id='auth-to-login'
              fullWidth
              variant='outlined'
              color='primary'
              onClick={handleLogin}
            >
              {t('form.login')}
            </Button>
            <Container className={classes.dividerContainer}>
              <Divider orientation='horizontal' className={classes.divider}/>
              <Typography component='span' className={classes.dividerText}>
                {t('misc.or')}
              </Typography>
            </Container>
            <Button
              id='auth-to-signup'
              fullWidth
              variant='outlined'
              color='primary'
              onClick={handleSignUp}
            >
              {t('form.sign-up')}
            </Button>
          </Route>
        </Switch>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
