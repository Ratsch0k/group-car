import React from 'react';
import {GroupWithOwnerAndMembers} from 'lib';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';
import ManageGroupTabs from './ManageGroupTabs';
import {makeStyles} from '@material-ui/styles';

export interface ManageGroupOverviewProps {
  group: GroupWithOwnerAndMembers;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
  },
  noStretch: {
    flex: '0 0 auto',
  },
  stretch: {
    flex: '1 1 auto',
  },
});

/**
 * Overview over the specified group.
 */
export const ManageGroupOverview: React.FC<ManageGroupOverviewProps> =
(props: ManageGroupOverviewProps) => {
  const {group} = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.noStretch}>
        <ManageGroupOverviewInfo group={group}/>
      </div>
      <div className={classes.stretch}>
        <ManageGroupTabs group={group}/>
      </div>
    </div>
  );
};

export default ManageGroupOverviewProps;
