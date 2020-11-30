import {MapContext} from 'lib';
import {useContext} from 'react';

/**
 * Shortcut hook for accessing the MapContext.
 */
export const useMap = (): MapContext => {
  return useContext(MapContext);
};

export default useMap;
