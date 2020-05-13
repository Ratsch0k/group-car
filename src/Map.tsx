import React, {useEffect, useState} from 'react';
import {Map as LMap, TileLayer, Marker, Popup} from 'react-leaflet';

type LatLngTuple = import('leaflet').LatLngTuple;

const Map: React.FC = () => {
  const [location, setLocation] = useState<LatLngTuple>([49.958958, 8.308246]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <LMap center={location} zoom={18}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={location}>
        <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </LMap>
  );
};

export default Map;
