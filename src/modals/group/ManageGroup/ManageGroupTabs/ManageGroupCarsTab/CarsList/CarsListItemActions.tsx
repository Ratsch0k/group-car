import React, {useCallback, useState} from 'react';
import {
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
} from '@material-ui/core';
import {CarWithDriver, ConfirmActionDialog} from 'lib';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';
import {isAdmin} from 'lib/util';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {useTranslation} from 'react-i18next';

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

  const handleDelete = useCallback(() => {

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
        />
      </>
    );
  } else {
    return null;
  }
};
