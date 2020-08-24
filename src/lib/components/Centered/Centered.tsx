import {makeStyles, Box} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';

export interface CenteredProps {
  /**
   * Css class name.
   */
  className?: string;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  centered: {
    display: 'grid',
    placeItems: 'center',
  },
});

/**
 * Component which centers itself.
 */
export const Centered: React.FC<CenteredProps> = (props) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.centered, props.className)}>
      <Box className={classes.centered}>
        {props.children}
      </Box>
    </Box>
  );
};

export default Centered;
