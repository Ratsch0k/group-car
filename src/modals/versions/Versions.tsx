import React, {FC} from 'react';
import {
  CloseableDialogTitle,
} from '../../lib';
import {useTranslation} from 'react-i18next';
import {
  Dialog,
  DialogContent,
} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {closeModal} from '../../lib/redux/slices/modalRouter/modalRouterSlice';
import VersionsOverview from '../../lib/components/VersionsOverview';

/**
 * Modal which shows the versions of the front- and backend.
 */
export const Versions: FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  return (
    <Dialog open={true}>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('versions.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <VersionsOverview />
      </DialogContent>
    </Dialog>
  );
};

export default Versions;
