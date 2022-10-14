import {createStyles, makeStyles, Typography} from '@material-ui/core';
import {GroupCarTheme} from 'lib';
import SettingsTabTitle from 'lib/components/Settings/SettingsTabTitle';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {isOwnerOfSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import {useTranslation} from 'react-i18next';
import DeleteGroupSection from './DeleteGroupSection';
import LeaveGroupSection from './LeaveGroupSection';

const useStyles = makeStyles((theme: GroupCarTheme ) => createStyles({
  header: {
    paddingBottom: theme.spacing(2),
  },
}));

export const ManageGroupSettings = (): JSX.Element => {
  const {t} = useTranslation();
  const classes = useStyles();
  const isOwner = useShallowAppSelector(isOwnerOfSelectedGroup);

  return (
    <>
      <div className={classes.header}>
        <SettingsTabTitle>
          {t('modals.group.manage.tabs.settings.title')}
        </SettingsTabTitle>
        <Typography color='textSecondary'>
          {t('modals.group.manage.tabs.settings.description')}
        </Typography>
      </div>
      {
        !isOwner &&
          <LeaveGroupSection />
      }
      {
        isOwner &&
          <DeleteGroupSection />
      }
    </>
  );
};

export default ManageGroupSettings;
