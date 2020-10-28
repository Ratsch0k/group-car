import {useContext} from 'react';
import {GroupContext} from 'lib/context/groupContext';

/**
 * Hook for accessing the `GroupContext`.
 */
export const useGroups: () => GroupContext = () => {
  return useContext(GroupContext);
};

export default useGroups;
