import {Dialog, DialogContent, DialogTitle, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {CarWithDriver, CenteredCircularProgress} from 'lib';
import {useMap, useSnackBar} from 'lib/hooks';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import CarCard from './CarCard';
import {
  getGroupCars,
  getSelectedGroup,
} from 'lib/redux/slices/group';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  driveCar,
  parkCar as parkCarThunk,
} from 'lib/redux/slices/group/groupThunks';
import useGeolocation from 'lib/hooks/useGeolocation';

/**
 * Styles.
 */
const useStyles = makeStyles({
  root: {
    overflow: 'visible',
  },
});

/**
 * List of cars.
 */
export const CarCards: React.FC = () => {
  const groupCars = useShallowAppSelector(getGroupCars);
  const selectedGroup = useShallowAppSelector(getSelectedGroup);
  const {setSelectedCar} = useMap();
  const user = useShallowAppSelector(getUser);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {getCurrentPosition} = useGeolocation();
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
      unwrapResult(
        await dispatch(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          driveCar({groupId: selectedGroup!.id, carId: car.carId})));
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
        return getCurrentPosition((position) => {
          resolve(position);
        }, (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(t('map.locationDenied'));
          } else {
            reject(t('error.LocationUnavailableError'));
          }
        }).catch(() => {
          reject(t('map.locationDenied'));
        });
      });
      await parkCar(carId, position.coords.latitude, position.coords.longitude);
    } catch (e) {
      show('error', e as string);
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
      unwrapResult(await dispatch(parkCarThunk({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        groupId: selectedGroup!.id,
        carId,
        latitude,
        longitude,
      })));
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
        spacing={4}
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
