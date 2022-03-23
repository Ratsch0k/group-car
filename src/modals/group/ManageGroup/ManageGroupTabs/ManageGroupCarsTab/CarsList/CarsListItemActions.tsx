import React, {useCallback, useState} from 'react';
import {
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
} from '@material-ui/core';
import {CarWithDriver, ConfirmActionDialog} from 'lib';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {deleteCar, getSelectedGroup} from 'lib/redux/slices/group';
import {isAdmin} from 'lib/util';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {useTranslation} from 'react-i18next';
import {unwrapResult} from '@reduxjs/toolkit';

export interface CarsListItemActionsProps {
  car: CarWithDriver;
}

export const CarsListItemActions = (
  {car}: CarsListItemActionsProps,
): JSX.Element | null => {
  const user = useShallowAppSelector(getUser);
  const group = useShallowAppSelector(getSelectedGroup);
  const {t} = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(async () => {
    setLoading(true);

    try {
      unwrapResult(
        await dispatch(
          deleteCar({groupId: car.groupId, carId: car.carId})));
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  if (group !== null && isAdmin(group, user?.id)) {
    return (
      <>
        <ListItemSecondaryAction>
          <Tooltip title={t('modals.group.manage.tabs.cars.delete').toString()}>
            <IconButton onClick={() => setOpen(true)}>
              <DeleteOutlineIcon color='error'/>
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
        <ConfirmActionDialog
          open={open}
          onConfirm={handleDelete}
          onCancel={() => setOpen(false)}
          loading={loading}
        />
      </>
    );
  } else {
    return null;
  }
};
