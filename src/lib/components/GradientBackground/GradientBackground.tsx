import React from 'react';
import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
});

export const GradientBackground = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div id='spot1' className='spot-primary'/>
      <div id='spot2' className='spot-primary-dark'/>
      <div id='spot3' className='spot-secondary'/>
    </Box>
  );
};

export default GradientBackground;
