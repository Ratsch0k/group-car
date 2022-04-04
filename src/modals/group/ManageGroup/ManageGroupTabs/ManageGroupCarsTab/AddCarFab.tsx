import {createStyles, Fab, makeStyles, Theme} from '@material-ui/core';
import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import CreateCarDialog from './CreateCarDialog';
import config from 'config';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import {glowShadow} from '../../../../../lib/util/glowShadow';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
      boxShadow: glowShadow(theme.palette.secondary.main, 1),
    },
  }),
);

/**
 * Fab to add a new car to a group.
 */
export const AddCarFab: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;

  return (
    <>
      <Fab
        color='secondary'
        className={classes.fab}
        id='create-car-fab'
        onClick={() => setOpen(true)}
        disabled={
          group.cars.length === config.group.maxCars
        }
      >
        <AddIcon />
      </Fab>
      <CreateCarDialog
        open={open}
        close={() => setOpen(false)}
      />
    </>
  );
};

export default AddCarFab;
