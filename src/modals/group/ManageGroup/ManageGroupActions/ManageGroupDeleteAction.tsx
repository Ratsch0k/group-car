import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import {ProgressButton, useGroups, useModalRouter, useSnackBar} from 'lib';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the group delete action.
 */
export interface ManageGroupDeleteActionProps {
  /**
   * Id of the displayed group.
   */
  groupId: number;
}

const useStyles = makeStyles({
  button: {
    color: red['700'],
    borderColor: red['700'],
  },
  contentText: {
    whiteSpace: 'pre-line',
  },
});

/**
 * Manage group action to delete the group.
 * @param props Props
 */
export const ManageGroupDeleteAction: React.FC<ManageGroupDeleteActionProps> =
(props: ManageGroupDeleteActionProps) => {
  const {groupId} = props;
  const classes = useStyles();
  const {t} = useTranslation();
  const {deleteGroup} = useGroups();
  const {close} = useModalRouter();
  const {show} = useSnackBar();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const handleClick = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    console.log(typeof groupId);
    await deleteGroup(groupId);
    show({
      content: t('modals.group.manage.deleteGroup.success'),
      type: 'success',
    });
    close();
  };

  const handleNo = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant='outlined'
        fullWidth
        onClick={handleClick}
        className={classes.button}
      >
        {t('modals.group.manage.deleteGroup.button')}
      </Button>
      <Dialog open={open}>
        <DialogTitle>
          {t('modals.group.manage.deleteGroup.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.contentText}>
            {t('modals.group.manage.deleteGroup.dialog.content')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNo}
            disabled={loading}
          >
            {t('misc.no')}
          </Button>
          <ProgressButton
            loading={loading}
            color='primary'
            onClick={handleDelete}
          >
            {t('misc.yes')}
          </ProgressButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageGroupDeleteAction;
