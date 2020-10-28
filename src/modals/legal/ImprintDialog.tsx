import React from 'react';
import {DialogContent, Dialog} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {useModalRouter, CloseableDialogTitle, Imprint} from 'lib';

export const ImprintDialog: React.FC = () => {
  const {t} = useTranslation();
  const {close} = useModalRouter();

  return (
    <Dialog open={true}>
      <CloseableDialogTitle close={close}>
        {t('imprint.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <Imprint />
      </DialogContent>
    </Dialog>
  );
};

export default ImprintDialog;
