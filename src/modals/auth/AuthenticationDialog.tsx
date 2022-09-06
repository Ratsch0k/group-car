/* eslint-disable react/display-name */
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
  Link,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, {useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import {Route, Switch, useRouteMatch, useLocation} from 'react-router-dom';
import {
  LoginForm,
  SignUpBody,
  useStateIfMounted,
} from 'lib';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getIsLoggedIn} from 'lib/redux/slices/auth';

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
    footer: {
      paddingTop: theme.spacing(1),
    },
  }),
);

interface AuthenticationDialogProps {
  open: boolean;
  close(): void;
}

export const AuthenticationDialog: React.FC<AuthenticationDialogProps> =
(props: AuthenticationDialogProps) => {
  const classes = useStyle();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const {path, isExact} = useRouteMatch();
  const {pathname} = useLocation();
  const [loading, setLoading] = useStateIfMounted<boolean>(false);

  /**
   * Handles navigation to sign up page
   */
  const handleSignUp = () => {
    dispatch(goToModal(`${path}/sign-up`));
  };

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    dispatch(goToModal(`${path}/login`));
  };

  /**
   * Handles go back action
   */
  const handleBack = () => {
    dispatch(goToModal(undefined));
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
    if (isLoggedIn) {
      onFinished();
    }

    // eslint-disable-next-line
  }, [isLoggedIn]);

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
            <Typography
              align='center'
              className={classes.footer}
              color='textSecondary'
            >
              <Trans
                i18nKey='auth.tryDemo'
                components={[
                  <Link
                    href='https://demo.mygroupcar.de'
                    referrerPolicy='no-referrer'
                    target='_blank'
                    key='demo-link'
                  />,
                ]}
              />
            </Typography>
          </Route>
        </Switch>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
