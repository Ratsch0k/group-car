import {red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/styles';
import {unwrapResult} from '@reduxjs/toolkit';
import {push} from 'connected-react-router';
import {Button, ConfirmActionDialog, useSnackBar} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {leaveGroup} from 'lib/redux/slices/group/groupThunks';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

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
    'backgroundColor': red['500'],
    'color': 'white',
    '&:hover': {
      backgroundColor: red['700'],
    },
  },
});

/**
 * Button to leave the specified group.
 * @param props Props
 */
export const LeaveGroupButton: React.FC<ManageGroupLeaveActionProps> =
(props: ManageGroupLeaveActionProps) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const {groupId} = props;
  const {show} = useSnackBar();
  const [open, setOpen] = useState<boolean>(false);

  const handleLeave = async () => {
    setLoading(true);
    try {
      unwrapResult(await dispatch(leaveGroup({id: groupId})));
      setLoading(false);
      show('success', t('modals.group.manage.leaveGroup.success'));
      dispatch(push('/'));
    } catch {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        className={classes.button}
        onClick={handleClick}
        variant='contained'
        disableCapitalization
      >
        {t('modals.group.manage.leaveGroup.button')}
      </Button>
      <ConfirmActionDialog
        onConfirm={handleLeave}
        onCancel={() => setOpen(false)}
        open={open}
        title={t('modals.group.manage.leaveGroup.dialog.title')}
        message={t('modals.group.manage.leaveGroup.dialog.content')}
        loading={loading}
      />
    </>
  );
};

export default LeaveGroupButton;
