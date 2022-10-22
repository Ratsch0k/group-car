import {useCallback, useState} from 'react';
import React from 'react';
import CarsList from './CarsList';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {isAdminOfSelectedGroup} from 'lib/redux/slices/group';
import {Theme, Typography, useMediaQuery} from '@material-ui/core';
import AddCarFab from './AddCarFab';
import {useTranslation} from 'react-i18next';
import SettingsTabTitle from 'lib/components/Settings/SettingsTabTitle';
import AddCarButton from './AddCarButton';
import CreateCarDialog from './CreateCarDialog';


/**
 * Cars tab for the group management.
 * @param props Props
 */
export const ManageGroupCarsTab: React.FC = () => {
  const isAdmin = useShallowAppSelector(isAdminOfSelectedGroup);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <SettingsTabTitle
        actions={
          mdUp && isAdmin ?
            <AddCarButton onClick={openDialog} /> :
            undefined
        }
      >
        {t('modals.group.manage.tabs.cars.title')}
      </SettingsTabTitle>
      <Typography color='textSecondary'>
        {t('modals.group.manage.tabs.cars.description')}
      </Typography>
      <br />
      <CarsList />
      {
        !mdUp && isAdmin && <AddCarFab onClick={openDialog}/>
      }
      <CreateCarDialog open={open} close={closeDialog} />
    </>
  );
};

export default ManageGroupCarsTab;
