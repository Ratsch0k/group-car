import React, {useState, useEffect} from 'react';
import {Typography, CircularProgress} from '@material-ui/core';
import {GroupWithOwner, useApi} from 'lib';

/**
 * Props for the manage group component.
 */
export interface ManageGroupProps {
  /**
   * The id of the group to display.
   */
  groupId: number;
  /**
   * Callback for when the group data was successfully loaded.
   * @param group The group data.
   */
  onGroupLoaded?(group: GroupWithOwner): void;
}

/**
 * Component for managing the specified group.
 * @param props - The props.
 */
export const ManageGroup: React.FC<ManageGroupProps> =
(props: ManageGroupProps) => {
  const {getGroup} = useApi();

  const {groupId} = props;
  const [groupData, setGroupData] = useState<GroupWithOwner | null>(null);

  // Get the group
  useEffect(() => {
    getGroup(groupId).then((res) => {
      setGroupData(res.data);
      props.onGroupLoaded && props.onGroupLoaded(res.data);
    }).catch((e) => {
      console.dir(e);
    });
  }, [groupId, props, getGroup]);

  return (
    <Typography>
      {
        groupData ?
        JSON.stringify(groupData) :
        <CircularProgress />
      }
    </Typography>
  );
};

export default ManageGroup;
