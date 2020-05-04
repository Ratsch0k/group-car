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

export const AuthType = ['login', 'sign-up'];
export type AuthType = 'login' | 'sign-up' | undefined;
interface AuthenticationDialogProps {
  open: boolean;
  close(): void;
  initialAuthType?: AuthType;
  onAuthTypeChange?(type: AuthType): void;
}

const AuthenticationDialog: React.FC<AuthenticationDialogProps> =
(props: AuthenticationDialogProps) => {
  const classes = useStyle();
  const {t} = useTranslation();
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [authType, setAuthType] = useState<AuthType>(props.initialAuthType);

  const {onAuthTypeChange} = props;

  /**
   * Handles navigation to sign up page
   */
  const handleSignUp = () => {
    onAuthTypeChange && onAuthTypeChange('login');
    setAuthType('sign-up');
  };

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    onAuthTypeChange && onAuthTypeChange('sign-up');
    setAuthType('login');
  };

  /**
   * Handles go back action
   */
  const handleBack = () => {
    onAuthTypeChange && onAuthTypeChange(undefined);
    setAuthType(undefined);
  };

  /**
   * Navigates to the page from which auth was called.
   */
  const onFinished = () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn]);

  let authContainer: JSX.Element;
  if (authType === 'login') {
    authContainer = (
      <LoginForm
        withSubmit
        onFinished={onFinished}
        setLoading={setLoading}
      />
    );
  } else if (authType === 'sign-up') {
    authContainer = (
      <SignUpForm
        withSubmit
        onFinished={onFinished}
        setLoading={setLoading}
      />
    );
  } else {
    authContainer = (
      <>
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
      </>
    );
  }

  return (
    <Dialog open={props.open} fullWidth maxWidth='xs'>
      <DialogTitle>
        <IconButton
          data-testid='go-back'
          edge='start'
          disableRipple
          disabled={loading}
          onClick={handleBack}
          style={{visibility: authType === undefined ? 'hidden' : 'visible'}}
        >
          <ArrowBackIcon/>
        </IconButton>
        {
          authType === undefined ?
          t('auth.dialog.title.authenticate') :
          t(`auth.dialog.title.${authType}`)
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
        {authContainer}
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
