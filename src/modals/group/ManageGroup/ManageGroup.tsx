import React, {useEffect} from 'react';
import {
  RestError,
  useStateIfMounted,
  CenteredCircularProgress,
} from 'lib';
import ManageGroupErrorHandler from './ManageGroupNoGroupError';
import {ManageGroupOverview} from './ManageGroupOverview';
import {useParams} from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  useShallowAppSelector,
} from 'lib/redux/hooks';
import {
  getIsLoading,
  getSelectedGroup,
  selectAndUpdateGroup,
  updateSelectedGroup,
} from 'lib/redux/slices/group';

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
  const dispatch = useAppDispatch();
  const {groupId: groupIdParam} = useParams<{groupId: string}>();
  const [error, setError] = useStateIfMounted<RestError | null | boolean>(null);
  const group = useShallowAppSelector(getSelectedGroup);
  const isLoading = useAppSelector(getIsLoading);


  // Get the group
  useEffect(() => {
    const f = async () => {
    // Get the group id
      let selectedGroupId: number;

      if (typeof props.groupId === 'number') {
        selectedGroupId = props.groupId;
      } else {
      // Try to get the groupId from the path
        selectedGroupId = parseInt(groupIdParam);
      }

      if (typeof selectedGroupId !== 'undefined' && !isNaN(selectedGroupId)) {
        try {
          if (group && group.id === selectedGroupId) {
            await dispatch(updateSelectedGroup(selectedGroupId));
          } else {
            await dispatch(selectAndUpdateGroup({
              id: selectedGroupId, force: true,
            }));
          }
        } catch {
          setError(true);
        }
      } else {
        setError(true);
      }
    };

    f();
    // eslint-disable-next-line
  }, [props.groupId, groupIdParam]);

  if (isLoading && group === null && error === null) {
    return <CenteredCircularProgress />;
  } else if (error === null && group !== null) {
    return <ManageGroupOverview />;
  } else {
    return <ManageGroupErrorHandler/>;
  }
};

export default ManageGroup;
