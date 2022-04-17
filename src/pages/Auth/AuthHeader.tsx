import React from 'react';
import {
  Container,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {LargeLogo} from '../../lib/components/Icons/LargeLogo';
import {GroupCarTheme} from '../../lib';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    color: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    flexGrow: 0,
    flexShrink: 0,
  },
}));


const AuthHeader = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <LargeLogo />
      <Typography variant='h5'>
        <b>My Group Car</b>
      </Typography>
    </Container>
  );
};

export default AuthHeader;
