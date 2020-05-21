import React from 'react';
import {Grid, Link} from '@material-ui/core';
import useModalRouter from 'lib/hooks/useModalRouter';
import {useTranslation} from 'react-i18next';

type GridProps = import('@material-ui/core').GridProps;

interface DrawerFooterProps extends GridProps {
  justify?: undefined;
}

const DrawerFooter: React.FC<DrawerFooterProps> =
(props: DrawerFooterProps) => {
  const {...rest} = props;
  const {goTo} = useModalRouter();
  const {t} = useTranslation();

  return (
    <Grid container {...rest} justify='space-evenly'>
      <Grid item>
        <Link component='button' onClick={() => goTo('/privacy-policy')}>
          {t('privacyPolicy.title')}
        </Link>
      </Grid>
      <Grid item>
        <Link component='button' onClick={() => goTo('/imprint')}>
          {t('imprint.title')}
        </Link>
      </Grid>
    </Grid>
  );
};

export default DrawerFooter;
