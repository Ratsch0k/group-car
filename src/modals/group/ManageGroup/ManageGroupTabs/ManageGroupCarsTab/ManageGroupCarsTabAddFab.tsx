import {createStyles, Fab, makeStyles, Theme} from '@material-ui/core';
import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import ManageGroupCarsCreateDialog from './ManageGroupCarsCreateDialog';
import {CarWithDriver, GroupWithOwnerAndMembersAndInvitesAndCars} from 'lib';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  }),
);

export interface ManageGroupCarsTabAddFabProps {
  group: GroupWithOwnerAndMembersAndInvitesAndCars;
  additionalCars: CarWithDriver[];
  addCar(car: CarWithDriver): void;
}

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
