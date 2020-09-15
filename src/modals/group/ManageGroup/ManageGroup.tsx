import React, {useEffect} from 'react';
import {
  RestError,
  useStateIfMounted,
  GroupWithOwnerAndMembers,
  CenteredCircularProgress,
  useGroups,
} from 'lib';
import ManageGroupErrorHandler from './ManageGroupNoGroupError';
import {ManageGroupOverview} from './ManageGroupOverview';
import {useParams} from 'react-router-dom';

/**
 * Props for the manage group component.
 */
export interface ManageGroupProps {
  /**
   * Id of the group. If not provided this
   * component will try to get the parameter `:groupId` from
   * the path. If that's not possible it will show an error
   * message.
   */
  groupId?: number;
}

/**
 * Component for managing the specified group.
 * @param props - The props.
 */
export const ManageGroup: React.FC<ManageGroupProps> =
(props: ManageGroupProps) => {
  const {getGroup} = useGroups();
  const {groupId: groupIdParam} = useParams<{groupId: string}>();
  const [groupData, setGroupData] =
      useStateIfMounted<GroupWithOwnerAndMembers | null>(null);
  const [error, setError] = useStateIfMounted<RestError | null | boolean>(null);


  // Get the group
  useEffect(() => {
    // Get the group id
    let selectedGroupId: number;

    if (typeof props.groupId === 'number') {
      selectedGroupId = props.groupId;
    } else {
      // Try to get the groupId from the path
      selectedGroupId = parseInt(groupIdParam);
    }

    if (typeof selectedGroupId !== 'undefined' && !isNaN(selectedGroupId)) {
      getGroup(selectedGroupId).then((res) => {
        setGroupData(res.data);
      }).catch(() => {
        setError(true);
      });
    } else {
      setError(true);
    }

    // eslint-disable-next-line
  }, [props, groupIdParam]);

  if (groupData === null && error === null) {
    return <CenteredCircularProgress />;
  } else if (error === null && groupData !== null) {
    return <ManageGroupOverview group={groupData}/>;
  } else {
    return <ManageGroupErrorHandler/>;
  }
};

export default ManageGroup;
