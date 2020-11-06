import {createStyles, Fab, makeStyles, Theme} from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  }),
);

export const ManageGroupCarsTabAddFab: React.FC = () => {
  const classes = useStyles();

  return (
    <Fab
      color='secondary'
      className={classes.fab}
      id='car-fab'
    >
      <AddIcon />
    </Fab>
  );
};

export default ManageGroupCarsTabAddFab;
