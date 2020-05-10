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
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import {LoginForm} from './Login';
import {SignUpForm} from './SignUp';
import {useTranslation} from 'react-i18next';
import AuthContext from 'lib/context/auth/authContext';
import CloseIcon from '@material-ui/icons/Close';

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

const Authentication: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyle();
  const {t} = useTranslation();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Save the url from which the client navigated to this component
   */
  const [origin] = useState<string>('/');

  /**
   * Handles navigation to sign up page
   */
  const handleSignUp = () => {
    history.push(`${match.url}/sign-up`);
  };

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    history.push(`${match.url}/login`);
  };

  /**
   * Handles go back action
   */
  const handleBack = () => {
    history.goBack();
  };

  /**
   * Navigates to the page from which auth was called.
   */
  const onFinished = () => {
    history.replace(origin);
  };

  /**
   * Checks every time the `isLoggedIn` attribute changes
   * if the client is authenticated. If it is go to the origin.
   */
  useEffect(() => {
    if (auth.isLoggedIn) {
      onFinished();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn]);

  return (
    <Dialog open={true} fullWidth maxWidth='xs'>
      <DialogTitle>
        <IconButton
          data-testid='go-back'
          edge='start'
          disableRipple
          disabled={loading}
          onClick={handleBack}
          style={{visibility: match.isExact ? 'hidden' : 'visible'}}
        >
          <ArrowBackIcon/>
        </IconButton>
        {
          match.isExact ?
          t('auth.dialog.title.authenticate') :
          t('auth.dialog.title.' +
            location.pathname.replace(match.path + '/', ''))
        }
        <IconButton
          className={classes.closeButton}
          onClick={onFinished}
          disabled={loading}
          data-testid='close-dialog'
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Switch>
          <Route exact path={match.path}>
            <Button
              data-testid='to-login'
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
              data-testid='to-signup'
              fullWidth
              variant='outlined'
              color='primary'
              onClick={handleSignUp}
            >
              {t('form.sign-up')}
            </Button>
          </Route>
          <Route path={`${match.path}/sign-up`}>
            <SignUpForm
              withSubmit
              onFinished={onFinished}
              setLoading={setLoading}
            />
          </Route>
          <Route path={`${match.path}/login`}>
            <LoginForm
              withSubmit
              onFinished={onFinished}
              setLoading={setLoading}
            />
          </Route>
          <Route path='*'>
            <Redirect to='/auth' />
          </Route>
        </Switch>
      </DialogContent>
    </Dialog>
  );
};

export default Authentication;
