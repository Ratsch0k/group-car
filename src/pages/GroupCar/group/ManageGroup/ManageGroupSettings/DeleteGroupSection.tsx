import {Typography} from '@material-ui/core';
import SettingsSection from 'lib/components/SettingsSection';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import {useTranslation} from 'react-i18next';
import DeleteGroupButton from './DeleteGroupButton';

/**
 * Section of the group management settings that allows the owner to
 * delete the group.
 */
export const DeleteGroupSection = (): JSX.Element | null => {
  const {t} = useTranslation();
  const group = useShallowAppSelector(getSelectedGroup);

  if (!group) {
    return null;
  }

  return (
    <>
      <SettingsSection
        title={t('modals.group.manage.deleteGroup.title')}
      >
        <Typography color='textSecondary'>
          {t('modals.group.manage.deleteGroup.description')}
        </Typography>
        <br />
        <DeleteGroupButton groupId={group.id} />
      </SettingsSection>
    </>
  );
};

export default DeleteGroupSection;
