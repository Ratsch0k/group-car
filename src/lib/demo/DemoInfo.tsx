import React from 'react';
import {DialogContent, DialogContentText} from '@material-ui/core';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {CloseableDialogTitle, Dialog} from '../components';

const SESSION_KEY = 'demoInfoClose';

/**
 * Shows information that app is in demo mode and what this means.
 * Will only show this dialog once per session.
 */
const DemoInfo = (): JSX.Element => {
  const {t} = useTranslation();
  /**
   * Loads state from session storage
   */
  const [open, setOpen] = useState<boolean>(
    !sessionStorage.getItem(SESSION_KEY));

  /**
   * Handles close.
   * Stores in session storage that user has closed dialog and closes it.
   */
  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, true.toString());
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <CloseableDialogTitle close={handleClose}>
        {t('demo.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('demo.info')}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default DemoInfo;
