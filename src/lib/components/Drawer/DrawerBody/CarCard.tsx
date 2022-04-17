import {
  alpha,
  Card,
  CardActions,
  CardHeader,
  Grid,
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import {Button, CarWithDriver, GroupCarTheme, RoleChip, useMap} from 'lib';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {createStyles, makeStyles} from '@material-ui/styles';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import MapIcon from '@material-ui/icons/Map';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import {grey} from '@material-ui/core/colors';
import getIcon from 'lib/util/getIcon';
import {LatLng} from 'leaflet';

/**
 * Props for the car card.
 */
export interface CarCardProps {
  /**
   * The car to display.
   */
  car: CarWithDriver;

  /**
   * Add the car to the list of driving cars.
   * @param car The car
   */
  addDrivingCar(car: CarWithDriver): Promise<void>;

  /**
   * Whether this card should be disabled.
   */
  disabled?: boolean;

  /**
   * Whether this car is available.
   *
   * If this is true, neither `isDriving` nor `isInUse` should
   * be true.
   */
  isAvailable?: boolean;

  /**
   * Whether the currently logged in user is currently
   * driving the car.
   *
   * If this is true, neither `isAvailable` nor `isInUse` should
   * be true.
   */
  isDriving?: boolean;

  /**
   * Whether another user is driving this car.
   *
   * If this is true, neither `isAvailable` nor `isDriving` should
   * be true.
   */
  isInUse?: boolean;

  /**
   * Should park the car with the specified id at the
   * current location of the device.
   */
  parkAtCurrent: (carId: number) => Promise<void>;

  /**
   * Should change to location selection.
   */
  parkWithMap: (car: CarWithDriver) => void;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    cardHeader: {
      paddingBottom: theme.spacing(1),
    },
    cardRoot: {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    carContainerDriving: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      border: `1px solid ${theme.palette.primary.main}`,
    },
    frostedBackground: {
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
    },
    avatarIcon: {
      backgroundColor: grey[200],
      borderRadius: '50%',
    },
    textDriving: {
      color: theme.palette.primary.contrastText,
    },
  }),
);


/**
 * Card to visualize a car.
 * @param props Props
 */
export const CarCard: React.FC<CarCardProps> = (props: CarCardProps) => {
  const {
    car,
    addDrivingCar,
    isAvailable,
    isDriving,
    isInUse,
    disabled,
    parkAtCurrent,
    parkWithMap,
  } = props;
  const {t} = useTranslation();
  const classes = useStyles();
  const {map} = useMap();
  const theme = useTheme();
  const isLargerLg = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Card
      variant='outlined'
      classes={{
        root: clsx(
          classes.cardRoot,
          {
            [classes.frostedBackground]: isLargerLg && !isDriving,
            [classes.carContainerDriving]: isDriving,
          },
        ),
      }}
    >
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <img
            src={getIcon(car.color)}
            height='35x'
            width='35px'
            alt={`car-icon-${car.color}`}
          />
        }
        title={<b>{car.name}</b>}
        subheader={
          isAvailable ?
            <RoleChip
              color={'primary'}
              label={t('misc.available')}
              variant='outlined'
              size='small'
            /> :
            isInUse ?
              <Typography color='textSecondary' variant='subtitle2'>
                {t('drawer.cars.drivenBy', {driver: car.Driver?.username})}
              </Typography>:
              <Typography className={classes.textDriving} variant='subtitle2'>
                {t('drawer.cars.youAreDriving')}
              </Typography>
        }
      />
      {
        (isAvailable || isDriving) &&
        <CardActions>
          <Grid
            container
            spacing={1}
          >
            {
              isAvailable &&
              <>
                <Grid item xs={6}
                >
                  <Button
                    fullWidth
                    color='primary'
                    onClick={() => addDrivingCar(car)}
                    disabled={disabled}
                    id={`drive-car-${car.carId}`}
                    noBold
                  >
                    <DriveEtaIcon />
                    {t('drawer.cars.drive')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    disabled={!car.latitude || !car.longitude}
                    fullWidth
                    color='primary'
                    id={`view-car-${car.carId}`}
                    noBold
                    onClick={() => {
                      // eslint-disable-next-line
                      map?.flyTo(new LatLng(car.latitude!, car.longitude!), 18, {duration: 1});
                    }}
                  >
                    <SearchIcon />
                    {t('drawer.cars.view')}
                  </Button>
                </Grid>
              </>
            }
            {
              isDriving &&
              <>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    disabled={disabled}
                    className={classes.textDriving}
                    onClick={() => parkAtCurrent(car.carId)}
                    noBold
                    id={`park-current-car-${car.carId}`}
                  >
                    <GpsFixedIcon />
                    {t('drawer.cars.parkCurrent')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    disabled={disabled}
                    className={classes.textDriving}
                    noBold
                    onClick={() => parkWithMap(car)}
                    id={`park-map-car-${car.carId}`}
                  >
                    <MapIcon />
                    {t('drawer.cars.parkMap')}
                  </Button>
                </Grid>
              </>
            }
          </Grid>
        </CardActions>
      }
    </Card>
  );
};

export default CarCard;
