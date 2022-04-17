import React, {useCallback, useEffect, useState} from 'react';
import {Box, Theme} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {Button, useMap} from 'lib';
import GroupOptionsButton from './GroupOptionsButton';
import CarCards from './CarCards';
import {createStyles, makeStyles} from '@material-ui/styles';
import SelectLocation from './SelectLocation';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getAllGroups} from 'lib/redux/slices/group';

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
  const groups = useShallowAppSelector(getAllGroups);
  const classes = useStyles();
  const dispatch = useAppDispatch();
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
            onClick={() => dispatch(goToModal('/group/create'))}
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
    [groups, goToModal, t],
  );
  const [btn, setBtn] = useState<JSX.Element>(getOptionsButton());

  useEffect(() => {
    setBtn(getOptionsButton());
    // eslint-disable-next-line
  }, [groups, goToModal]);

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
