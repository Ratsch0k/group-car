import React from 'react';
import {Grid} from '@material-ui/core';
import {NavLink} from 'react-router-dom';

type GridProps = import('@material-ui/core').GridProps;

interface DrawerFooterProps extends GridProps {
  justify?: undefined;
}

const DrawerFooter: React.FC<DrawerFooterProps> =
(props: DrawerFooterProps) => {
  const {...rest} = props;

  return (
    <Grid container {...rest} justify='space-evenly'>
      <Grid item>
        <NavLink to='/?modal=/policy'>
          Datenschutzerklärung
        </NavLink>
      </Grid>
      <Grid item>
        <NavLink to='/?modal=/imprint'>
          Impressum
        </NavLink>
      </Grid>
    </Grid>
  );
};

export default DrawerFooter;
