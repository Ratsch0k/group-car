import React from 'react';
import {
  alpha,
  Box,
  Container,
  createStyles,
  makeStyles,
  Paper,
} from '@material-ui/core';
import {replace} from 'connected-react-router';
import {useAppDispatch} from 'lib/redux/hooks';
import AuthHeader from 'pages/Auth/AuthHeader';
import {GradientBackground, GroupCarTheme, LoginForm} from '../../lib';
import {loginUser} from './state';
import DemoInfo from './DemoInfo';

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
    justifyContent: 'space-evenly',
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
}));

/**
 * Modified authentication page that only allows log in with defined username
 * and password and has no sign up page.
 */
const DemoAuthentication = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  return (
    <Box className={classes.root}>
      <GradientBackground />
      <DemoInfo />
      <Container maxWidth='sm'>
        <Paper
          elevation={15}
          classes={{
            rounded: classes.paperRounded,
            root: classes.paperRoot,
          }}
        >
          <Box className={classes.container}>
            <AuthHeader />
            <Box>
              <LoginForm
                withSubmit
                onFinished={() => dispatch(replace('/'))}
                username={loginUser.username}
                password={loginUser.password}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DemoAuthentication;
