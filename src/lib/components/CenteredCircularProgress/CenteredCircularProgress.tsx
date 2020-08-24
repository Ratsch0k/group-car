import React from 'react';
import {
  makeStyles,
  CircularProgress,
  CircularProgressProps,
} from '@material-ui/core';
import {Centered} from 'lib';

const useStyles = makeStyles({
  /**
   * To avoid that rotation of progress component will overflow
   * this component.
   */
  container: {
    paddingTop: 1,
    paddingBottom: 1,
  },
});

/**
 * Variant of the circular progress component which always centers itself.
 */
export const CenteredCircularProgress: React.FC<CircularProgressProps> =
(props) => {
  const classes = useStyles();

  return (
    <Centered className={classes.container}>
      <CircularProgress {...props}/>
    </Centered>
  );
};

export default CenteredCircularProgress;

