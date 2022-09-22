import React from 'react';
import {
  AutoFullscreenDialog,
} from 'lib';
import {
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
} from '@material-ui/core';
import ManageGroup from './ManageGroup';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
      overflowX: 'hidden',
    },
  }),
);

/**
 * Dialog for managing groups.
 */
export const ManageGroupDialog: React.FC = () => {
  const classes = useStyles();

  return (
    <AutoFullscreenDialog open={true} breakpoint='sm' maxWidth='sm' fullWidth>
      <DialogContent className={classes.content}>
        <ManageGroup />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default ManageGroupDialog;
