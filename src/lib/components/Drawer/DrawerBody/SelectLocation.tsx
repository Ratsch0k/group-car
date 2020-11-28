import {Button, Grid, Typography} from '@material-ui/core';
import {LatLng, LeafletMouseEvent} from 'leaflet';
import {useMap} from 'lib';
import {CarWithDriver} from 'lib/api';
import {ProgressButton} from 'lib/components/Input';
import {useGroups} from 'lib/hooks';
import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the SelectLocation component.
 */
export interface SelectLocationProps {
  /**
   * The car for which the location should be
   * selected.
   */
  car: CarWithDriver;

  /**
   * Callback to cancel the selection.
   */
  cancel(): void;
}

/**
 * Component for selecting the location
 * of a selected car. Expects to have access to the
 * MapContext. Doesn't provide the map interface.
 * @param props Props
 */
export const SelectLocation: React.FC<SelectLocationProps> =
(props: SelectLocationProps) => {
  const {car, cancel} = props;
  const {t} = useTranslation();
  const {map, setSelectionDisabled} = useMap();
  const {parkCar, selectedGroup} = useGroups();
  const [location, setLocation] = useState<LatLng>();
  const loading = useRef<boolean>(false);

  useEffect(() => {
    /**
     * Listener for click events on the map.
     * If the component is not currently loading,
     * the click will changed the stored location.
     * @param event 
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
  const handleCancel = () => {
    setLocation(undefined);
    cancel();
  };

  /**
   * Handles click on the confirm button.
   */
  const handleConfirm = async () => {
    if (selectedGroup && location) {
      loading.current = true;
      setSelectionDisabled(true);

      try {
        await parkCar(selectedGroup.id, car.carId, location.lat, location.lng);
        loading.current = false;
        setSelectionDisabled(false);
        handleCancel();
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
          >
            {t('misc.confirm')}
          </ProgressButton>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleCancel}
            fullWidth
            disabled={loading.current}
          >
            {t('misc.cancel')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectLocation;
