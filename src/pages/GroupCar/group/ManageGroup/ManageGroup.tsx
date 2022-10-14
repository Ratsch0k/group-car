import React, {useEffect} from 'react';
import {
  RestError,
  useStateIfMounted,
} from 'lib';
import {useParams} from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  useShallowAppSelector,
} from 'lib/redux/hooks';
import {
  getIsLoading,
  getSelectedGroup,
} from 'lib/redux/slices/group';
import Settings from 'lib/components/Settings';
import {useGroupTabs} from './useGroupTabs';
import {
  updateSelectedGroup,
  selectAndUpdateGroup,
} from 'lib/redux/slices/group/groupThunks';
import ManageGroupErrorHandler from './ManageGroupNoGroupError';
import {unwrapResult} from '@reduxjs/toolkit';

/**
 * Component for managing the specified group.
 * @param props - The props.
 */
export const ManageGroup: React.FC = () => {
  const dispatch = useAppDispatch();
  const {groupId: groupIdParam} = useParams<{groupId: string}>();
  const [error, setError] = useStateIfMounted<RestError | null | boolean>(null);
  const group = useShallowAppSelector(getSelectedGroup);
  const isLoading = useAppSelector(getIsLoading);
  const tabs = useGroupTabs();

  // Get the group
  useEffect(() => {
    const f = async () => {
    // Get the group id
      const selectedGroupId = parseInt(groupIdParam, 10);

      if (typeof selectedGroupId !== 'undefined' && !isNaN(selectedGroupId)) {
        try {
          if (group && group.id === selectedGroupId) {
            unwrapResult(await dispatch(updateSelectedGroup(selectedGroupId)));
          } else {
            unwrapResult(await dispatch(selectAndUpdateGroup({
              id: selectedGroupId,
            })));
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
  }, [groupIdParam]);

  return (
    <Settings
      tabs={tabs}
      loading={!group && isLoading}
      title={group ? group.name : ''}
      error={error ? <ManageGroupErrorHandler /> : undefined}
    />
  );
};

export default ManageGroup;
