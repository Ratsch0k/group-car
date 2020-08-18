import React from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  useModalRouter,
  GroupCarTheme,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import CreateGroupForm from './CreateGroupForm';
import {makeStyles, createStyles} from '@material-ui/styles';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
    },
  }),
);

export const CreateGroup: React.FC = () => {
  const {close} = useModalRouter();
  const {t} = useTranslation();
  const classes = useStyles();

  return (
    <AutoFullscreenDialog open={true} fullWidth>
      <CloseableDialogTitle close={close}>
        {t('modals.group.create.title')}
      </CloseableDialogTitle>
      <DialogContent className={classes.content}>
        <CreateGroupForm />
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default CreateGroup;
