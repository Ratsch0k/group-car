import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Grid,
  Theme,
  Typography,
} from '@material-ui/core';
import {CarWithDriver, RoleChip} from 'lib';
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
   * Whether or not this card should be disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not this car is available.
   *
   * If this is true, neither `isDriving` nor `isInUse` should
   * be true.
   */
  isAvailable?: boolean;

  /**
   * Whether or not the currently logged in user is currently
   * driving the car.
   *
   * If this is true, neither `isAvailable` nor `isInUse` should
   * be true.
   */
  isDriving?: boolean;

  /**
   * Whether or not another user is driving this car.
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionsRoot: {
      padding: 0,
    },
    actionsContainer: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    actionsContainerDriving: {
      borderTop: `1px solid ${theme.palette.primary.contrastText}`,
    },
    leftAction: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    leftActionDriving: {
      borderRight: `1px solid ${theme.palette.primary.contrastText}`,
    },
    parkOnMapText: {
      fontSize: '0.7rem',
    },
    carContainerDriving: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      border: `1px solid ${theme.palette.primary.contrastText}`,
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

  return (
    <Card
      variant='outlined'
      classes={{
        root: clsx({
          [classes.carContainerDriving]: isDriving,
        }),
      }}
    >
      <CardHeader
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
        <CardActions
          className={clsx({
            [classes.actionsContainer]: isAvailable,
            [classes.actionsContainerDriving]: isDriving,
          })}
          classes={{
            root: classes.actionsRoot,
          }}
        >
          <Grid
            container
            justify='space-between'
          >
            {
              isAvailable &&
              <>
                <Grid item xs={6} className={classes.leftAction}
                >
                  <Button
                    fullWidth
                    onClick={() => addDrivingCar(car)}
                    disabled={disabled}
                    id={`drive-car-${car.carId}`}
                  >
                    <DriveEtaIcon />
                    {t('drawer.cars.drive')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    disabled
                    fullWidth
                    id={`view-car-${car.carId}`}
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
                <Grid item xs={6} className={classes.leftActionDriving}>
                  <Button
                    fullWidth
                    disabled={disabled}
                    className={classes.textDriving}
                    onClick={() => parkAtCurrent(car.carId)}
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
                    onClick={() => parkWithMap(car)}
                    id={`park-map-car-${car.carId}`}
                  >
                    <MapIcon />
                    <Typography className={classes.parkOnMapText}>
                      {t('drawer.cars.parkMap')}
                    </Typography>
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
