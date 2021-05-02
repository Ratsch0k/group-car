import React from 'react';
import {DialogContent, Dialog} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {CloseableDialogTitle, Imprint} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';

export const ImprintDialog: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Dialog open={true}>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('imprint.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <Imprint />
      </DialogContent>
    </Dialog>
  );
};

export default ImprintDialog;
