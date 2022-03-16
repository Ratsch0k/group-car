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

export interface ConfirmActionDialogProps {
  open: boolean;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

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
