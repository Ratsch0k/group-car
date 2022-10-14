import React, {useCallback, useEffect, useRef} from 'react';
import {
  alpha,
  Box,
  Container,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Paper,
} from '@material-ui/core';
import {
  GradientBackground,
  GroupCarTheme,
  LoginForm,
  SignUpBody,
} from '../../lib';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useAppDispatch, useShallowAppSelector} from '../../lib/redux/hooks';
import {getLocation, push, replace} from 'connected-react-router';
import AuthOverview from './AuthOverview';
import AuthHeader from './AuthHeader';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {getIsLoggedIn} from '../../lib/redux/slices/auth';
import useSnackbar from '../../lib/hooks/useSnackbar';
import {useTranslation} from 'react-i18next';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    border: `2px solid ${theme.palette.background.default}`,
    margin: 'auto',
    minHeight: '25rem',
    backdropFilter: 'blur(4px)',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadiusSized.large,
  },
  contentWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'height 500ms',
    position: 'relative',
  },
  paperRounded: {
    borderRadius: theme.shape.borderRadiusSized.large,
  },
  paperRoot: {
    backgroundColor: 'unset',
  },
  content: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  contentRoot: {
    zIndex: 10,
  },
  divider: {
    backgroundColor: theme.palette.background.default,
    height: 2,
  },
  enter: {
    opacity: 0,
  },
  enterActive: {
    opacity: 1,
    transition: 'opacity 125ms',
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    transition: 'opacity 125ms',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    margin: 'auto',
    width: '100%',
    zIndex: 0,
  },
  footerLinks: {
    margin: 'auto',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    background: alpha(theme.palette.background.paper, 0.4),
    borderRadius: theme.shape.borderRadiusSized.default,
    width: 'fit-content',
    color: theme.palette.primary.dark,
  },
}));

export interface AuthenticationProps {
  preloadMain(): Promise<unknown>;
}

export const Authentication = (props: AuthenticationProps): JSX.Element => {
  const {preloadMain} = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentObserver = useRef<ResizeObserver>();
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const location = useShallowAppSelector(getLocation);
  const isLoggedIn = useShallowAppSelector(getIsLoggedIn);
  const {show} = useSnackbar();
  const {t} = useTranslation();
  const {path: basePath} = useRouteMatch();

  /**
   * Handles navigating to the login route
   */
  const handleToLogin = useCallback(() => {
    dispatch(push(`${basePath}/login`));
  }, []);

  /**
   * Handles navigating to the sign-up route
   */
  const handleToSignUp = useCallback(() => {
    dispatch(push(`${basePath}/sign-up`));
  }, []);

  /**
   * Handles navigating back
   */
  const handleGoBack = useCallback(() => {
    dispatch(replace(basePath));
  }, []);

  /**
   * Handles a successful login/sign-up event.
   * Notifies the user that they are authenticated via
   * a snack and preloads the main page. Then it
   * navigates to the root path.
   */
  const handleFinished = useCallback(async () => {
    show('success', t('auth.success'));
    await preloadMain();
    dispatch(push('/'));
  }, []);


  /**
   * Handles the case when this route is accessed while
   * the user is already logged-in. Replaces this route
   * with the root route.
   */
  useEffect(() => {
    const f = async () => {
      if (isLoggedIn) {
        await preloadMain();
        dispatch(replace('/'));
      }
    };
    f();
  }, [isLoggedIn]);

  /*
   * Animate resizing the component
   */
  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver(handleResize);
      observer.observe(contentRef.current);

      contentObserver.current = observer;
    }
  }, []);

  /**
   * Handles resize events.
   * Gets the new height of the component and sets the height
   * of the content wrapper to the correct height
   */
  const handleResize: ResizeObserverCallback = useCallback((
    [observerEntry],
  ) => {
    if (contentWrapperRef.current) {
      const height = observerEntry.contentRect.height;
      if (height > 0) {
        contentWrapperRef.current.style.height = height + 'px';
      }
    }
  }, []);

  return (
    <Box className={classes.root}>
      <GradientBackground />
      <Container maxWidth='sm' className={classes.contentRoot}>
        <Paper
          elevation={15}
          classes={{
            rounded: classes.paperRounded,
            root: classes.paperRoot,
          }}
        >
          <Box className={classes.container}>
            <AuthHeader />
            <div className={classes.contentWrapper} ref={contentWrapperRef}>
              <div ref={contentRef} className={classes.content}>
                <SwitchTransition>
                  <CSSTransition
                    key={location.key}
                    timeout={250}
                    classNames={{
                      enter: classes.enter,
                      enterActive: classes.enterActive,
                      exit: classes.exit,
                      exitActive: classes.exitActive,
                    }}
                  >
                    <Switch location={location}>
                      <Route key={basePath} exact path={basePath}>
                        <AuthOverview
                          toLogin={handleToLogin}
                          toSignUp={handleToSignUp}
                        />
                      </Route>
                      <Route
                        key={`${basePath}/login`}
                        path={`${basePath}/login`}
                      >
                        <LoginForm
                          withSubmit
                          withGoBack
                          goBack={handleGoBack}
                          onFinished={handleFinished}
                        />
                      </Route>
                      <Route
                        key={`${basePath}/sign-up`}
                        path={`${basePath}/sign-up`}
                      >
                        <SignUpBody
                          withSubmit
                          goBack={handleGoBack}
                          onFinished={handleFinished}
                        />
                      </Route>
                    </Switch>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            </div>
          </Box>
        </Paper>
      </Container>
      <Box className={classes.footer}>
        <Grid container spacing={2} className={classes.footerLinks}>
          <Grid item>
            <Link
              color='inherit'
              component='button'
              onClick={() => dispatch(goToModal('/privacy-policy'))}
            >
              {t('privacyPolicy.title')}
            </Link>
          </Grid>
          <Grid item>
            <Link
              color='inherit'
              component='button'
              onClick={() => dispatch(goToModal('/imprint'))}
            >
              {t('imprint.title')}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Authentication;
