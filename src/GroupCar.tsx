import React from 'react';
import {makeStyles, createStyles} from '@material-ui/styles';
import HeaderBar from 'lib/components/HeaderBar/HeaderBar';
import {NavLink} from 'react-router-dom';
import Routes from 'lib/Routes';
import {Box} from '@material-ui/core';

type GroupCarTheme = import('lib/theme').GroupCarTheme;

const useStyle = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    pageContainer: {
      marginTop: theme.shape.headerHeight,
    },
  }),
);

const GroupCar: React.FC = () => {
  const classes = useStyle();

  return (
    <Box>
      <div className="App">
        <HeaderBar />
      </div>
      <Box className={classes.pageContainer}>
        <NavLink to='/legal/policy'>
              Datenschutzerklärung
        </NavLink>
        <NavLink to='/legal/imprint'>
              Impressum
        </NavLink>
        <Routes />
      </Box>
    </Box>
  );
};

export default GroupCar;
