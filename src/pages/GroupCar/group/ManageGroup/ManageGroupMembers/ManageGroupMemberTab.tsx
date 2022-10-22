import React from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';
import SettingsTabTitle from 'lib/components/Settings/SettingsTabTitle';
import {useTranslation} from 'react-i18next';
import {isAdmin} from 'lib/util';
import InviteUserButton from './InviteUserButton';
import {Typography, useMediaQuery, useTheme} from '@material-ui/core';
import InviteUserFab from './InviteUserFab';

/**
 * The member tab in the group management dialog.
 * @param props Props
 */
export const ManageGroupMembersTab: React.FC = () => {
  const user = useShallowAppSelector(getUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  const userIsAdmin = isAdmin(group, user?.id);
  const {t} = useTranslation();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <SettingsTabTitle
        actions={userIsAdmin && mdUp ? <InviteUserButton /> : undefined}
      >
        {t('modals.group.manage.tabs.members.title')}
      </SettingsTabTitle>
      <Typography color='textSecondary'>
        {t('modals.group.manage.tabs.members.description')}
      </Typography>
      <br/>
      <ManageGroupMemberList />
      {
        userIsAdmin && !mdUp && <InviteUserFab />
      }
    </>
  );
};

export default ManageGroupMembersTab;
