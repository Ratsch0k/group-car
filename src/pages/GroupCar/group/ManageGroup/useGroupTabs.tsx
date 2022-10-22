import {SettingsTab} from 'lib/components/Settings';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';
import {useTranslation} from 'react-i18next';
import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import HomeIcon from '@material-ui/icons/Home';
import ManageGroupCars from './ManageGroupCars';
import ManageGroupMembers from './ManageGroupMembers';
import ManageGroupGeneral from './ManageGroupGeneral';
import ManageGroupSettings from './ManageGroupSettings';
import {Settings} from '@material-ui/icons';

/**
 * Default list of tabs that are always shown.
 */
const DEFAULT_TABS = [
  {
    title: 'modals.group.manage.tabs.general.title',
    page: <ManageGroupGeneral />,
    path: 'general',
    icon: <HomeIcon />,
  },
  {
    title: 'modals.group.manage.tabs.members.title',
    page: <ManageGroupMembers />,
    path: 'members',
    icon: <AccountCircleIcon />,
  },
  {
    title: 'modals.group.manage.tabs.cars.title',
    page: <ManageGroupCars />,
    path: 'cars',
    icon: <DriveEtaIcon />,
  },
  {
    title: 'modals.group.manage.tabs.settings.title',
    page: <ManageGroupSettings />,
    path: 'settings',
    icon: <Settings />,
  },
];

/**
 * Hook to get a list of configurations for settings
 * tabs for the group management dialog.
 *
 * The list is generated based on if the group exists,
 * the user is authenticated, and on the privileges on the user in the group.
 * @returns Array of setting tab configurations based on the group and the user.
 */
export const useGroupTabs = (): SettingsTab[] => {
  const group = useShallowAppSelector(getSelectedGroup);
  const user = useShallowAppSelector(getUser);
  const {t} = useTranslation();
  if (group && user) {
    const tabs = DEFAULT_TABS.map((tab) => {
      tab.title = t(tab.title);
      return tab;
    });

    return tabs;
  }

  return [];
};
