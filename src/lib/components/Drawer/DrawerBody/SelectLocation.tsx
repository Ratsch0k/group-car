import {Button, Grid, Typography} from '@material-ui/core';
import {unwrapResult} from '@reduxjs/toolkit';
import {LatLng, LeafletMouseEvent} from 'leaflet';
import {useMap, CarWithDriver, ProgressButton} from 'lib';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup, parkCar} from 'lib/redux/slices/group';
import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';


/**
 * Component for selecting the location
 * of a selected car. Expects to have access to the
 * MapContext and that a car is selected. Doesn't provide the map interface.
 * @param props Props
 */
export const SelectLocation: React.FC = () => {
  const {t} = useTranslation();
  const {
    map,
    setSelectionDisabled,
    selectedCar,
    setSelectedCar,
  } = useMap();
  const car = selectedCar as CarWithDriver;
  const dispatch = useAppDispatch();
  const selectedGroup = useAppSelector(getSelectedGroup);
  const [location, setLocation] = useState<LatLng>();
  const loading = useRef<boolean>(false);

  useEffect(() => {
    /**
     * Listener for click events on the map.
     * If the component is not currently loading,
     * the click will changed the stored location.
     * @param event Click event
     */
    const listener = (event: LeafletMouseEvent) => {
      if (!loading.current) {
        setLocation(event.latlng);
      }
    };

    map?.addEventListener('click', listener);

    return () => {
      map?.removeEventListener('click', listener);
    };
  }, [map]);

  /**
   * Handles click on the cancel button.
   */
  const handleClose = () => {
    setLocation(undefined);
    setSelectedCar(undefined);
  };

  /**
   * Handles click on the confirm button.
   */
  const handleConfirm = async () => {
    if (selectedGroup && location) {
      loading.current = true;
      setSelectionDisabled(true);

      try {
        unwrapResult(await dispatch(parkCar({
          groupId: selectedGroup.id,
          carId: car.carId,
          latitude: location.lat,
          longitude: location.lng,
        })));
        loading.current = false;
        setSelectionDisabled(false);
        handleClose();
      } catch {
        setSelectionDisabled(false);
        loading.current = false;
      }
    }
  };

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <Typography align='center' variant='h5'>
          {t('drawer.selectLocation.title')}
        </Typography>
        <Typography align='center'>
          {t('drawer.selectLocation.showCar', {name: car.name})}
        </Typography>
      </Grid>
      <Grid item>
        <Typography color='textSecondary'>
          {t('drawer.selectLocation.description')}
        </Typography>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs={12} md={6}>
          <ProgressButton
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleConfirm}
            disabled={location === undefined}
            loading={loading.current}
            id={`park-map-${car.carId}-confirm`}
          >
            {t('misc.confirm')}
          </ProgressButton>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClose}
            fullWidth
            disabled={loading.current}
            id={`park-map-${car.carId}-cancel`}
          >
            {t('misc.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectLocation;
