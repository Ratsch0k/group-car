import {LatLng} from 'leaflet';
import {CarWithDriver} from 'lib';
import {Marker} from 'react-leaflet';
import React from 'react';
import {LocationMarker} from 'lib';

export interface CarMarkerProps {
  car: CarWithDriver;
}

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
