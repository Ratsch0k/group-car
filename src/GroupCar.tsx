import {Box} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import HeaderBar from 'lib/components/HeaderBar/HeaderBar';
import Routes from 'lib/Routes';
import React from 'react';
import {NavLink} from 'react-router-dom';
import Map from './Map';

type GroupCarTheme = import('lib/theme').GroupCarTheme;

const useStyle = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    body: {
      height: '100%',
      width: '100%',
    },
    pageContainer: {
      paddingTop: theme.shape.headerHeight,
      width: '100%',
      height: `calc(100% - ${theme.shape.headerHeight}px)`,
    },
  }),
);

const GroupCar: React.FC = () => {
  const classes = useStyle();

  return (
    <Box className={classes.body}>
      <HeaderBar />
      <Box className={classes.pageContainer}>
        <NavLink to='/legal/policy' style={{position: 'absolute', top: 100}}>
              Datenschutzerklärung
        </NavLink>
        <NavLink to='/legal/imprint' style={{position: 'absolute', top: 100}}>
              Impressum
        </NavLink>
        <Map />
        <Routes />
      </Box>
    </Box>
  );
};

export default GroupCar;
