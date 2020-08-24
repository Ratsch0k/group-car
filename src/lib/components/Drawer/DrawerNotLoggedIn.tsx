import React from 'react';
import {Box, makeStyles, Typography} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import clsx from 'clsx';

/**
 * Styles
 */
const useStyles = makeStyles({
  center: {
    display: 'grid',
    placeItems: 'center',
  },
  fullHeight: {
    height: '100%',
  },
});

/**
 * Shows the user a message, that he/she has to be logged in to
 * access the features.
 */
export const DrawerNotLoggedIn: React.FC = () => {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <Box className={clsx(classes.fullHeight, classes.center)}>
      <Box className={classes.center}>
        <Typography variant='h5' align='center'>
          {t('drawer.notLoggedIn.title')}
        </Typography>
        <Typography align='center' color='textSecondary'>
          {t('drawer.notLoggedIn.message')}
        </Typography>
      </Box>
    </Box>
  );
};

export default DrawerNotLoggedIn;
