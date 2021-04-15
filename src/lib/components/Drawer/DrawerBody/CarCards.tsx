import {Dialog, DialogContent, DialogTitle, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {CarWithDriver, CenteredCircularProgress, useGroups} from 'lib';
import {useMap, useSnackBar} from 'lib/hooks';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
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
  const {groupCars, selectedGroup, parkCar: parkCarApi} = useGroups();
  const {setSelectedCar} = useMap();
  const user = useAppSelector(getUser);
  const classes = useStyles();
  const {driveCar} = useGroups();
  const {t} = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [drivingCars, setDrivingCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) => car.driverId === user?.id) || [],
  );
  const [availableCars, setAvailableCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) => car.driverId === null) || [],
  );
  const {show} = useSnackBar();
  const [usedCars, setUsedCars] = useState<CarWithDriver[]>(
    groupCars?.filter((car) =>
      car.driverId !== null &&
      car.driverId !== user?.id,
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

  const handleParkAtCurrent = async (carId: number) => {
    setLoading(true);
    setOpen(true);

    try {
      const position = await new Promise<
      GeolocationPosition
      >((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position);
        }, (error) => {
          reject(error);
        });
      });
      await parkCar(carId, position.coords.latitude, position.coords.longitude);
    } catch (e) {
      show('error', (e as GeolocationPositionError).message);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const parkCar = async (
    carId: number,
    latitude:
    number,
    longitude: number,
  ) => {
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await parkCarApi(selectedGroup!.id, carId, latitude, longitude);
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
        car.driverId !== user?.id,
      ) || []);
  }, [groupCars, user]);

  return (
    <>
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
                parkAtCurrent={handleParkAtCurrent}
                parkWithMap={setSelectedCar}
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
                parkAtCurrent={handleParkAtCurrent}
                parkWithMap={setSelectedCar}
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
                parkAtCurrent={handleParkAtCurrent}
                parkWithMap={setSelectedCar}
              />
            </Grid>
          ))
        }
      </Grid>
      <Dialog open={open}>
        <DialogTitle>
          {t('drawer.cars.gettingLocation')}
        </DialogTitle>
        <DialogContent>
          <CenteredCircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarCards;
