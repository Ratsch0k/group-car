import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ModalProps,
} from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/styles';
import {unwrapResult} from '@reduxjs/toolkit';
import {Button, ProgressButton, useSnackBar} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {leaveGroup} from 'lib/redux/slices/group';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

/**
 * Props.
 */
export interface ManageGroupLeaveActionProps {
  groupId: number;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  button: {
    'color': red['700'],
    '&:hover': {
      backgroundColor: red['50'],
    },
  },
});

/**
 * Button to leave the specified group.
 * @param props Props
 */
export const ManageGroupLeaveAction: React.FC<ManageGroupLeaveActionProps> =
(props: ManageGroupLeaveActionProps) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const {groupId} = props;
  const {show} = useSnackBar();
  const [open, setOpen] = useState<boolean>(false);
  const history = useHistory();

  const handleLeave = async () => {
    setLoading(true);
    try {
      unwrapResult(await dispatch(leaveGroup({id: groupId})));
      setLoading(false);
      show('success', t('modals.group.manage.leaveGroup.success'));
      history.push('/');
    } catch {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleOnClose: ModalProps['onClose'] = useCallback((
    _event,
    reason,
  ) => {
    if (reason === 'backdropClick') {
      setOpen(false);
    }
  }, []);

  return (
    <>
      <Button
        className={classes.button}
        onClick={handleClick}
        noBold
      >
        {t('modals.group.manage.leaveGroup.button')}
      </Button>
      <Dialog open={open} onClose={handleOnClose}>
        <DialogTitle>
          {t('modals.group.manage.leaveGroup.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('modals.group.manage.leaveGroup.dialog.content')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t('misc.no')}
          </Button>
          <ProgressButton
            onClick={handleLeave}
            loading={loading}
            color='primary'
          >
            {t('misc.yes')}
          </ProgressButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageGroupLeaveAction;
