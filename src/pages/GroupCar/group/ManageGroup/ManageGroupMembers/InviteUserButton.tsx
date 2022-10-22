import {Button} from 'lib';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useState} from 'react';
import {Send} from '@material-ui/icons';
import InviteUserDialog from './InviteUserDialog';

export const InviteUserButton = (): JSX.Element => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button
        size='large'
        color='primary'
        variant='contained'
        startIcon={<Send />}
        disableCapitalization
        onClick={() => setOpen(true)}
      >
        {t('misc.invite')}
      </Button>
      <InviteUserDialog open={open} close={handleClose}/>
    </>
  );
};

export default InviteUserButton;
