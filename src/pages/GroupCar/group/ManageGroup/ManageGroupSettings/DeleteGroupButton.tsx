import {
  makeStyles,
} from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import {unwrapResult} from '@reduxjs/toolkit';
import {Button, useSnackBar} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {deleteGroup} from 'lib/redux/slices/group/groupThunks';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import ConfirmActionDialog
  from 'lib/components/ConfirmActionDialog/ConfirmActionDialog';
import DeleteForeverOutlinedIcon from
  '@material-ui/icons/DeleteForeverOutlined';


/**
 * Props for the group delete action.
 */
export interface ManageGroupDeleteActionProps {
  /**
   * Id of the displayed group.
   */
  groupId: number;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  button: {
    'backgroundColor': red['600'],
    'color': 'white',
    'alignSelf': 'flex-end',
    '&:hover': {
      backgroundColor: red['800'],
    },
  },
  contentText: {
    whiteSpace: 'pre-line',
  },
});

/**
 * Manage group action to delete the group.
 * @param props Props
 */
export const DeleteGroupButton: React.FC<ManageGroupDeleteActionProps> =
(props: ManageGroupDeleteActionProps) => {
  const {groupId} = props;
  const classes = useStyles();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {show} = useSnackBar();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const handleClick = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      unwrapResult(await dispatch(deleteGroup({id: groupId})));
      show({
        content: t('modals.group.manage.deleteGroup.success'),
        type: 'success',
      });
      history.push('/');
    } catch (e) {
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={classes.button}
        startIcon={<DeleteForeverOutlinedIcon />}
        size='large'
      >
        {t('modals.group.manage.deleteGroup.button')}
      </Button>
      <ConfirmActionDialog
        open={open}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        title={t('modals.group.manage.deleteGroup.dialog.title')}
        message={t('modals.group.manage.deleteGroup.dialog.content')}
        loading={loading}
      />
    </>
  );
};

export default DeleteGroupButton;
