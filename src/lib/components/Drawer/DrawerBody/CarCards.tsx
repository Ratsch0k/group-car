import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {useGroups} from 'lib/hooks';
import React from 'react';
import CarCard from './CarCard';

const useStyles = makeStyles({
  root: {
    overflowY: 'auto',
  },
});

export const CarCards: React.FC = () => {
  const {groupCars} = useGroups();
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      spacing={1}
      wrap='nowrap'
      className={classes.root}
    >
      {groupCars?.map((car) => (
        <Grid item key={`drawer-car-${car.carId}`}>
          <CarCard car={car} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CarCards;
