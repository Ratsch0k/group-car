import React from 'react';
import {Grid, Link} from '@material-ui/core';
import useModalRouter from 'lib/hooks/useModalRouter';

type GridProps = import('@material-ui/core').GridProps;

interface DrawerFooterProps extends GridProps {
  justify?: undefined;
}

const DrawerFooter: React.FC<DrawerFooterProps> =
(props: DrawerFooterProps) => {
  const {...rest} = props;
  const {goTo} = useModalRouter();

  return (
    <Grid container {...rest} justify='space-evenly'>
      <Grid item>
        <Link component='button' onClick={() => goTo('/privacy-policy')}>
          Datenschutzerklärung
        </Link>
      </Grid>
      <Grid item>
        <Link component='button' onClick={() => goTo('/imprint')}>
          Impressum
        </Link>
      </Grid>
    </Grid>
  );
};

export default DrawerFooter;
