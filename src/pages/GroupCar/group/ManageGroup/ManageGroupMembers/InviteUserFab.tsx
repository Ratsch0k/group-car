import {createStyles, makeStyles} from '@material-ui/core';
import {Send} from '@material-ui/icons';
import {GroupCarTheme, Fab} from 'lib';
import {useState} from 'react';
import React from 'react';
import InviteUserDialog from './InviteUserDialog';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  fab: {
    position: 'absolute',
    right: theme.spacing(1),
    bottom: theme.spacing(3),
  },
}));

export const InviteUserFab = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <Fab
        color='primary'
        onClick={() => setOpen(true)}
        className={classes.fab}
        size='large'
      >
        <Send />
      </Fab>
      <InviteUserDialog open={open} close={() => setOpen(false)}/>
    </>
  );
};

export default InviteUserFab;
