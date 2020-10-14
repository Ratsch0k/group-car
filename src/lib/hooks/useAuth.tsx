import {AuthContext} from 'lib/context';
import {useContext} from 'react';

/**
 * Hook for accessing the `AuthContext`.
 */
export const useAuth = (): AuthContext => {
  return useContext(AuthContext);
};

export default useAuth;
