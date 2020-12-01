import {LatLng} from 'leaflet';
import {CarWithDriver} from 'lib';
import {Marker} from 'react-leaflet';
import React from 'react';
import {LocationMarker} from 'lib';

/**
 * Props for CarMarker.
 */
export interface CarMarkerProps {
  /**
   * The car for which the marker should be.
   */
  car: CarWithDriver;
}

/**
 * If the car has latitude and longitude values this component will
 * render the appropriate Marker for the car.
 * @param props Props
 */
export const CarMarker: React.FC<CarMarkerProps> = (props: CarMarkerProps) => {
  const {car} = props;

  if (car.latitude && car.longitude) {
    return (
      <Marker
        position={new LatLng(car.latitude, car.longitude)}
        icon={LocationMarker[car.color]}
      />
    );
  } else {
    return null;
  }
};

export default CarMarker;
