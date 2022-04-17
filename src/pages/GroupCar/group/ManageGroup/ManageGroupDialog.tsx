import React from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
} from '@material-ui/core';
import ManageGroup from './ManageGroup';
import {useAppDispatch} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
      overflowX: 'hidden',
    },
  }),
);

/**
 * Dialog for managing groups.
 */
export const ManageGroupDialog: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const classes = useStyles();

  return (
    <AutoFullscreenDialog open={true} breakpoint='sm' maxWidth='sm' fullWidth>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('modals.group.manage.title')}
      </CloseableDialogTitle>
      <DialogContent className={classes.content}>
        <ManageGroup />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default ManageGroupDialog;
