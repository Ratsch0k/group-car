import {Typography} from '@material-ui/core';
import SettingsSection from 'lib/components/SettingsSection';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import {useTranslation} from 'react-i18next';
import LeaveGroupButton from './LeaveGroupButton';

/**
 * Section of the Group management settings tab that provides the user
 * the ability to leave the group.
 *
 * Should not be shown to the owner. Instead, show them the delete group or
 * transfer ownership sections.
 */
export const LeaveGroupSection = (): JSX.Element | null => {
  const {t} = useTranslation();
  const group = useShallowAppSelector(getSelectedGroup);

  if (!group) {
    return null;
  }

  return (
    <SettingsSection
      title={t('modals.group.manage.leaveGroup.title')}
    >
      <Typography color='textSecondary'>
        {t('modals.group.manage.leaveGroup.description')}
      </Typography>
      <br />
      <LeaveGroupButton groupId={group.id}/>
    </SettingsSection>
  );
};

export default LeaveGroupSection;
