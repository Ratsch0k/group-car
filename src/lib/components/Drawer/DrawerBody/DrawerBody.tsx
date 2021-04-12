import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Theme} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {useMap, useModalRouter} from 'lib';
import useGroups from 'lib/hooks/useGroups';
import GroupOptionsButton from './GroupOptionsButton';
import CarCards from './CarCards';
import {createStyles, makeStyles} from '@material-ui/styles';
import SelectLocation from './SelectLocation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    btn: {
      flex: '0 0 auto',
    },
    cars: {
      marginTop: theme.spacing(2),
      flex: '1 1 100%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  }),
);

/**
 * Body of the drawer.
 */
export const DrawerBody: React.FC = () => {
  const {t} = useTranslation();
  const {goTo} = useModalRouter();
  const {groups} = useGroups();
  const classes = useStyles();
  const {selectedCar} = useMap();
  const getOptionsButton = useCallback(
    () => {
      if (groups.length <= 0) {
        return (
          <Button
            fullWidth
            disableElevation
            color='primary'
            variant='contained'
            onClick={() => goTo('/group/create')}
          >
            {t('drawer.createGroup')}
          </Button>
        );
      } else {
        return (
          <GroupOptionsButton />
        );
      }
    },
    [groups, goTo, t],
  );
  const [btn, setBtn] = useState<JSX.Element>(getOptionsButton());

  useEffect(() => {
    setBtn(getOptionsButton());
    // eslint-disable-next-line
  }, [groups, goTo]);

  if (selectedCar) {
    return (
      <SelectLocation />
    );
  } else {
    return (
      <Box className={classes.root}>
        <Box className={classes.btn}>
          {btn}
        </Box>
        <Box className={classes.cars}>
          <CarCards />
        </Box>
      </Box>
    );
  }
};

export default DrawerBody;
