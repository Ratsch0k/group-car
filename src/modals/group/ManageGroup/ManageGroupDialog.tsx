import React from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  useModalRouter,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
} from '@material-ui/core';
import ManageGroup from './ManageGroup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
    },
  }),
);

export const ManageGroupDialog: React.FC = () => {
  const {t} = useTranslation();
  const {close} = useModalRouter();
  const classes = useStyles();

  return (
    <AutoFullscreenDialog open={true} breakpoint='sm' maxWidth='sm' fullWidth>
      <CloseableDialogTitle close={close}>
        {t('modals.group.manage.title')}
      </CloseableDialogTitle>
      <DialogContent className={classes.content}>
        <ManageGroup />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default ManageGroupDialog;
