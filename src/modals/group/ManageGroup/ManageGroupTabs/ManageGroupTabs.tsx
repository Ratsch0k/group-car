import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GroupWithOwnerAndMembersAndInvites, useModalRouter} from 'lib';
import {Paper, Tab, Tabs, Theme} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import SwipeableView from 'react-swipeable-views';
import {createStyles, makeStyles} from '@material-ui/styles';
import ManageGroupMembersTab from './ManageGroupMembersTab';
import ManageGroupCarsTab from './ManageGroupCarsTab';

/**
 * Props for the group management tabs.
 */
export interface ManageGroupsTabsProps {
  /**
   * The group data.
   */
  group: GroupWithOwnerAndMembersAndInvites;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperOutlined: {
      borderColor: theme.palette.secondary.main,
    },
    tabContent: {
      height: `calc(100% - ${theme.spacing(6)}px)`,
    },
    container: {
      height: '100%',
    },
    fabContainer: {
      position: 'relative',
    },
  }),
);


/**
 * Component for displaying the group management tabs.
 * @param props Props
 */
export const ManageGroupTabs: React.FC<ManageGroupsTabsProps> =
(props: ManageGroupsTabsProps) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const {goTo, route} = useModalRouter();
  const getTabFromRoute = useCallback(() => {
    return route.endsWith('cars') ? 1 : 0;
  }, [route]);
  const [selectedTab, setSelectedTab] = useState<number>(getTabFromRoute());
  const fabPortal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTab(getTabFromRoute());
  }, [route, getTabFromRoute]);

  const handleSelectTab = (index: number) => {
    if (index === 0) {
      goTo(`/group/manage/${props.group.id}/members`);
    } else {
      goTo(`/group/manage/${props.group.id}/cars`);
    }
    setSelectedTab(index);
  };

  return (
    <Paper
      variant='outlined'
      classes={{
        outlined: classes.paperOutlined,
      }}
      className={classes.container}
    >
      <Tabs
        value={selectedTab}
        onChange={(_event, index: number) => handleSelectTab(index)}
        variant='fullWidth'
      >
        <Tab
          label={t('modals.group.manage.tabs.members.title')}
          id='group-tab-members'
          aria-controls='group-tabpanel-members'
        />
        <Tab
          label={t('modals.group.manage.tabs.cars.title')}
          id='group-tab-cars'
          aria-controls='group-tabpanel-cars'
        />
      </Tabs>
      <SwipeableView
        index={selectedTab}
        onChangeIndex={(index: number) => handleSelectTab(index)}
        className={classes.tabContent}
        containerStyle={{height: '100%'}}
      >
        <ManageGroupMembersTab
          className={classes.tabContent}
          visible={selectedTab === 0}
          group={props.group}
          fabPortal={fabPortal}
        />
        <ManageGroupCarsTab
          className={classes.tabContent}
          group={props.group}
          visible={selectedTab === 1}
          fabPortal={fabPortal}
        />
      </SwipeableView>
      <div className={classes.fabContainer}>
        <div ref={fabPortal} />
      </div>
    </Paper>
  );
};

export default ManageGroupTabs;
