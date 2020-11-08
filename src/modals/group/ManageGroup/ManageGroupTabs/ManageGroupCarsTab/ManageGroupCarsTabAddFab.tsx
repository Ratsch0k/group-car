import {createStyles, Fab, makeStyles, Theme} from '@material-ui/core';
import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import ManageGroupCarsCreateDialog from './ManageGroupCarsCreateDialog';
import {CarWithDriver, GroupWithOwnerAndMembersAndInvitesAndCars} from 'lib';
import config from 'config';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  }),
);

/**
 * Props for the fab.
 */
export interface ManageGroupCarsTabAddFabProps {
  /**
   * Data of the displayed group.
   */
  group: GroupWithOwnerAndMembersAndInvitesAndCars;

  /**
   * A list of additional cars.
   * Additional cars are cars which the user
   * has added.
   */
  additionalCars: CarWithDriver[];

  /**
   * Callback to add a new car.
   * @param car The car
   */
  addCar(car: CarWithDriver): void;
}

/**
 * Fab to add a new car to a group.
 * @param props Props
 */
export const ManageGroupCarsTabAddFab: React.FC<ManageGroupCarsTabAddFabProps> =
(props: ManageGroupCarsTabAddFabProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const {group, addCar, additionalCars} = props;

  return (
    <>
      <Fab
        color='secondary'
        className={classes.fab}
        id='create-car-fab'
        onClick={() => setOpen(true)}
        disabled={
          additionalCars.length + group.cars.length === config.group.maxCars
        }
      >
        <AddIcon />
      </Fab>
      <ManageGroupCarsCreateDialog
        open={open}
        close={() => setOpen(false)}
        group={group}
        addCar={addCar}
        additionalCars={additionalCars}
      />
    </>
  );
};

export default ManageGroupCarsTabAddFab;
