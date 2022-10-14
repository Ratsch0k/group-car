import {
  createStyles,
  FabProps,
  makeStyles,
  Theme,
} from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {Fab} from 'lib';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(1),
    },
  }),
);

/**
 * Fab to add a new car to a group.
 */
export const AddCarFab =
(props: Pick<FabProps, 'onClick' | 'disabled'>): JSX.Element => {
  const classes = useStyles();
  const {onClick, disabled} = props;

  return (
    <Fab
      color='primary'
      className={classes.fab}
      id='create-car-fab'
      onClick={onClick}
      disabled={disabled}
    >
      <AddIcon />
    </Fab>
  );
};

export default AddCarFab;
