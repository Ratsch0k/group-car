import React, {useState} from 'react';
import {GroupWithOwnerAndMembers, TabPanel} from 'lib';
import {Paper, Tab, Tabs, Theme} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import SwipeableView from 'react-swipeable-views';
import {createStyles, makeStyles} from '@material-ui/styles';
import ManageGroupMemberList from './ManageGroupMemberList';

/**
 * Props for the group management tabs.
 */
export interface ManageGroupsTabsProps {
  /**
   * The group data.
   */
  group: GroupWithOwnerAndMembers;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperOutlined: {
      borderColor: theme.palette.secondary.main,
    },
    tabContent: {
      height: '500px',
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
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Paper
      variant='outlined'
      classes={{
        outlined: classes.paperOutlined,
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(_event, index: number) => setSelectedTab(index)}
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
          disabled
        />
      </Tabs>
      <SwipeableView
        index={selectedTab}
        onChangeIndex={(index: number) => setSelectedTab(index)}
        className={classes.tabContent}
      >
        <TabPanel
          visible={selectedTab === 0}
          id='group-tabpanel-members'
          aria-labelledby='group-tab-members'
        >
          <ManageGroupMemberList group={props.group}/>
        </TabPanel>
        {
          /*
                  <TabPanel
          visible={selectedTab === 1}
          id='group-tabpanel-cars'
          aria-labelledby='group-tab-cars'
        >
          <Typography>CARS</Typography>
        </TabPanel>
          */
        }

      </SwipeableView>
    </Paper>
  );
};

export default ManageGroupTabs;
