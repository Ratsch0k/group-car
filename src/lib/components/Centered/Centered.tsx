import {makeStyles, Box} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';

export interface CenteredProps {
  /**
   * Css class name.
   */
  className?: string;

  /**
   * If this flag is set, this component will use
   * `width: 100%` and `height: 100%` to fill
   * the parent component.
   */
  fillParent?: boolean;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  centered: {
    display: 'grid',
    placeItems: 'center',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});

/**
 * Component which centers itself.
 */
export const Centered: React.FC<CenteredProps> = (props) => {
  const classes = useStyles();

  return (
    <Box className={
      clsx(
        classes.centered,
        {[classes.fill]: props.fillParent},
        props.className,
      )
    }>
      <Box className={classes.centered}>
        {props.children}
      </Box>
    </Box>
  );
};

export default Centered;
