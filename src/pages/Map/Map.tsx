import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, Marker, Circle} from 'react-leaflet';
import {PositionMarker, useMap} from 'lib';
import {LatLng, LeafletMouseEvent} from 'leaflet';

/**
 * Map component.
 */
export const Map: React.FC = () => {
  const [location, setLocation] = useState<LatLng>();
  const [acc, setAcc] = useState<number>(0);
  const {map, setMap, selectedCar, selectionDisabled} = useMap();
  const [selectedLocation, setSelectedLocation] = useState<LatLng>();
  const id = useRef<number>();
  const flew = useRef<boolean>(false);

  useEffect(() => {
    if (map) {
      id.current = navigator.geolocation.watchPosition((position) => {
        const latLng = new LatLng(
            position.coords.latitude,
            position.coords.longitude,
        );

        if (!flew.current) {
          map?.flyTo(latLng, 17);
          flew.current = true;
        }

        setLocation(latLng);
        setAcc(position.coords.accuracy);
      });
    }

    return () => {
      if (id.current) {
        navigator.geolocation.clearWatch(id.current);
      }
    };
  }, [map]);

  useEffect(() => {
    const listener = (event: LeafletMouseEvent) => {
      setSelectedLocation(event.latlng);
    };

    if (selectedCar && !selectionDisabled) {
      map?.addEventListener('click', listener);
    } else {
      map?.removeEventListener('click', listener);

      if (!selectedCar) {
        setSelectedLocation(undefined);
      }
    }

    return () => {
      map?.removeEventListener('click', listener);
    };
  }, [map, selectedCar, selectionDisabled]);

  return (
    <MapContainer
      center={new LatLng(50.815781, 10.055568)}
      zoom={4}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        location &&
        <Marker position={location} icon={PositionMarker} />
      }
      {
        location && acc &&
        <Circle center={location} radius={acc} opacity={0.5}/>
      }
      {
        selectedCar && selectedLocation &&
        <Marker position={selectedLocation} />
      }
    </MapContainer>
  );
};

export default Map;
