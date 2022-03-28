import {
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import {ProgressButton} from '../Input';
import React, {MouseEvent} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the {@link ConfirmActionDialog}
 */
export interface ConfirmActionDialogProps {
  /**
   * Open state of dialog.
   */
  open: boolean;
  /**
   * Title of the dialog.
   */
  title?: string | React.ReactNode;
  /**
   * Message display as content.
   */
  message?: string | React.ReactNode;
  /**
   * Called when the user clicks **yes**.
   * @param event
   */
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Called when user click **no**.
   * @param event
   */
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Sets loading state of component.
   *
   * If true, a circular loader is s displayed
   * on the yes button.
   */
  loading?: boolean;
}

/**
 * Dialog for letting the user confirm an action.
 *
 * It is recommended that this dialog is shown before letting
 * the user do some critical irreversible action, like deleting a group.
 *
 * A message is shown asking if the user is sure they want to do that action.
 * They can either click **no** or **yes** which call the appropriate
 * callback.
 * @param props Props
 */
export const ConfirmActionDialog = (
  props: ConfirmActionDialogProps,
): JSX.Element => {
  const {t} = useTranslation();

  const {
    open,
    title = t('misc.confirmAction.title'),
    message = t('misc.confirmAction.message'),
    onConfirm,
    onCancel,
    loading,
  } = props;

  return (
    <Dialog open={open}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          {t('misc.no')}
        </Button>
        <ProgressButton
          loading={loading}
          color='primary'
          onClick={onConfirm}
        >
          {t('misc.yes')}
        </ProgressButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
