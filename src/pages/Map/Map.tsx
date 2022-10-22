import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
} from '@monsonjeremy/react-leaflet';
import {
  Fab,
  GroupCarTheme,
  LocationMarker,
  PositionMarker,
  useMap,
  useSnackBar,
} from 'lib';
import {LatLng, LeafletMouseEvent} from 'leaflet';
import CarMarker from './CarMarker';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getGroupCars} from 'lib/redux/slices/group';
import {
  alpha,
  createStyles,
  darken,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {LocationSearching, MyLocation} from '@material-ui/icons';
import clsx from 'clsx';
import {blue} from '@material-ui/core/colors';
import useGeolocation from 'lib/hooks/useGeolocation';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles<
GroupCarTheme,
{isSmall: boolean}
>((theme: GroupCarTheme) => createStyles({
  map: ({isSmall}) => ({
    '& .leaflet-top': {
      top: theme.shape.headerHeight[isSmall ? 'small' : 'default'],
    },
    '& .leaflet-right': {
      right: isSmall ? 0 : theme.shape.drawerWidth,
    },
  }),
  fab: {
    position: 'absolute',
    top: theme.shape.headerHeight.small + theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      top: theme.shape.headerHeight.default + theme.spacing(1),
    },
    right: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      right: theme.shape.drawerWidth + theme.spacing(1),
    },
    zIndex: 1000,
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: theme.palette.blur,
    ['&:hover']: {
      background: alpha(darken(theme.palette.background.paper, 0.1), 0.7),
    },
    color: theme.palette.text.primary,
  },
  fabActive: {
    color: blue[600],
  },
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
}));

/**
 * Map component.
 */
export const Map: React.FC = () => {
  const [location, setLocation] = useState<LatLng>();
  const [acc, setAcc] = useState<number>(0);
  const {map, setMap, selectedCar, selectionDisabled} = useMap();
  const [selectedLocation, setSelectedLocation] = useState<LatLng>();
  const groupCars = useShallowAppSelector(getGroupCars);
  const id = useRef<number>();
  const flew = useRef<boolean>(false);
  const timeoutId = useRef<NodeJS.Timeout>();
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({isSmall: smallerXs});
  const [watchCurrentPos, setWatchCurrentPos] = useState(false);
  const geolocation = useGeolocation();
  const {show} = useSnackBar();
  const {t} = useTranslation();

  const handleCurrentLocation = useCallback(() => {
    if (!map) {
      return;
    }

    if (watchCurrentPos) {
      if (location) {
        map?.flyTo(location);
      }
    } else {
      geolocation.watchPosition((position) => {
        const latLng = new LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        if (!flew.current) {
          map?.flyTo(latLng, 18, {duration: 1});
          flew.current = true;
          timeoutId.current = setTimeout(() =>
            setAcc(position.coords.accuracy), 1000);
        } else {
          setAcc(position.coords.accuracy);
        }

        setLocation(latLng);
      }).then((watchId) => {
        setWatchCurrentPos(true);
        id.current = watchId;
      }).catch(() => {
        show({
          type: 'error',
          content: t('map.locationDenied'),
          withClose: true,
        });
      });
    }

    return () => {
      if (id.current) {
        geolocation.clearWatch(id.current);
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [watchCurrentPos, location, map]);

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
    <div className={classes.root}>
      <MapContainer
        center={new LatLng(50.815781, 10.055568)}
        zoom={6}
        whenCreated={setMap}
        className={classes.map}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          watchCurrentPos &&
            location &&
            <Marker position={location} icon={PositionMarker} />
        }
        {
          watchCurrentPos && location && acc &&
            <Circle center={location} radius={acc} opacity={0.5}/>
        }
        {
          selectedCar && selectedLocation &&
        <Marker
          position={selectedLocation}
          icon={LocationMarker[selectedCar.color]}
        />
        }
        {
          !selectedCar &&
        groupCars &&
        groupCars.filter((car) => car.driverId === null).map((car) => {
          return <CarMarker key={`car-marker-${car.carId}`} car={car} />;
        })
        }
      </MapContainer>
      <Tooltip title={
        watchCurrentPos && location ?
          t('map.showLocation').toString() :
          t('map.moveToLocation').toString()
      }>
        <Fab
          id='show-current-position'
          className={clsx(
            classes.fab,
            {[classes.fabActive]: watchCurrentPos && location},
          )}
          size='small'
          onClick={handleCurrentLocation}
        >
          {
            watchCurrentPos && location ?
              <MyLocation /> :
              <LocationSearching />
          }
        </Fab>

      </Tooltip>
    </div>
  );
};

export default Map;

