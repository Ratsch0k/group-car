import {Fab, Theme} from '@material-ui/core';
import {GroupWithOwnerAndMembers, TabPanel, useAuth} from 'lib';
import React, { useEffect, useState } from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, makeStyles } from '@material-ui/styles';
import {isAdmin as isAdminCheck} from '../../../util';


export interface ManageGroupMembersTab {
  group: GroupWithOwnerAndMembers;
  className?: string;
  visible: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  }),
);

export const ManageGroupMembersTab: React.FC<ManageGroupMembersTab> =
(props: ManageGroupMembersTab) => {
  const classes = useStyles();
  const {user} = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminCheck(props.group, user?.id));

  useEffect(() => {
    setIsAdmin(isAdminCheck(props.group, user?.id));
  }, [user, props.group]);

  return (
    <TabPanel
      className={props.className}
      visible={props.visible}
      id='group-tabpanel-members'
      aria-labelledby='group-tab-members'
    >
      <ManageGroupMemberList group={props.group}/>
      {
        isAdmin &&
        <Fab color='secondary' className={classes.fab}>
          <AddIcon />
        </Fab>
      }
    </TabPanel>
  );
};

export default ManageGroupMembersTab;
