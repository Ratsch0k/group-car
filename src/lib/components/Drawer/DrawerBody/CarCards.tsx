import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {CarWithDriver, useAuth, useGroups} from 'lib';
import React, {useEffect, useState} from 'react';
import CarCard from './CarCard';

/**
 * Styles.
 */
const useStyles = makeStyles({
  root: {
    overflowY: 'auto',
  },
});

/**
 * List of cars.
 */
export const CarCards: React.FC = () => {
  const {groupCars, selectedGroup} = useGroups();
  const {user} = useAuth();
  const classes = useStyles();
  const {driveCar} = useGroups();
  const [loading, setLoading] = useState<boolean>(false);
  const [drivingCars, setDrivingCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) => car.driverId === user?.id) || [],
  );
  const [availableCars, setAvailableCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) => car.driverId === null) || [],
  );
  const [usedCars, setUsedCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) =>
      car.driverId !== null &&
      car.driverId !== user?.id
    ) || [],
  );

  const handleAddDrivingCar = async (car: CarWithDriver) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await driveCar(selectedGroup!.id, car.carId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDrivingCars(groupCars?.filter((car) => car.driverId === user?.id) || []);
    setAvailableCars(groupCars?.filter((car) => car.driverId === null) || []);
    setUsedCars(
      groupCars?.filter((car) =>
        car.driverId !== null &&
        car.driverId !== user?.id
      ) || []);
  }, [groupCars, user]);

  return (
    <Grid
      container
      direction='column'
      spacing={1}
      wrap='nowrap'
      className={classes.root}
    >
      {
        drivingCars.map((car) => (
          <Grid item key={`drawer-car-${car.carId}`}>
            <CarCard
              car={car}
              addDrivingCar={handleAddDrivingCar}
              isDriving
              disabled={loading}
            />
          </Grid>
        ))
      }
      {
        availableCars.map((car) => (
          <Grid item key={`drawer-car-${car.carId}`}>
            <CarCard
              car={car}
              addDrivingCar={handleAddDrivingCar}
              isAvailable
              disabled={loading}
            />
          </Grid>
        ))
      }
      {
        usedCars.map((car) => (
          <Grid item key={`drawer-car-${car.carId}`}>
            <CarCard
              car={car}
              addDrivingCar={handleAddDrivingCar}
              isInUse
              disabled={loading}
            />
          </Grid>
        ))
      }
    </Grid>
  );
};

export default CarCards;
