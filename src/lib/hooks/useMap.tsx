import {MapContext} from 'lib';
import {useContext} from 'react';

export const useMap = (): MapContext => {
  return useContext(MapContext);
};

export default useMap;
