import PermissionHandlerContext from
  'lib/context/PermissionHandler/PermissionHandlerContext';
import {useCallback, useContext, useState} from 'react';

export type WatchPosition = (
  successCallback: PositionCallback,
  errorCallback?: PositionErrorCallback,
  options?: PositionOptions,
) => Promise<number>;
export type ClearWatch = (watchId: number) => Promise<void>;
export type GetCurrentPosition = (
  successCallback: PositionCallback,
  errorCallback?: PositionErrorCallback,
  options?: PositionOptions,
) => Promise<void>;

export interface UseGeolocation {
  watchPosition: WatchPosition;
  clearWatch: ClearWatch;
  getCurrentPosition: GetCurrentPosition;
}

/**
 * Hook to access the geolocation object with additional
 * permission handling provided by {@link PermissionHandlerContext}
 * @returns Modified Geolocation object
 */
function useGeolocation(): UseGeolocation {
  /**
   * Cache if permission is granted.
   */
  const [permissionGranted, setPermissionGranted] = useState(false);

  const {
    checkPermission,
    requestPermission,
  } = useContext(PermissionHandlerContext);

  /**
   * Checks if we have the permission to access geolocation and
   * if not, request it.
   */
  const handlePermissionCheck = useCallback(async () => {
    if (permissionGranted) {
      return;
    }

    const permissionStatus = await checkPermission('geolocation');

    if (permissionStatus.state === 'granted') {
      setPermissionGranted(true);
      return;
    }

    await requestPermission('geolocation');
  }, [permissionGranted]);

  /**
   * @see {@link Geolocation.watchPosition}
   */
  const watchPosition: WatchPosition = useCallback((
    successCallback,
    errorCallback,
    options,
  ) => {
    return handlePermissionCheck().then(() => {
      return navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        options,
      );
    });
  }, [handlePermissionCheck]);

  /**
   * @see {@link Geolocation.clearWatch}
   */
  const clearWatch: ClearWatch = useCallback((watchId) => {
    return handlePermissionCheck().then(() => {
      return navigator.geolocation.clearWatch(watchId);
    });
  }, []);

  /**
   * @see {@link Geolocation.getCurrentPosition}
   */
  const getCurrentPosition: GetCurrentPosition = useCallback((
    successCallback,
    errorCallback,
    options,
  ) => {
    return handlePermissionCheck().then(() => {
      return navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options,
      );
    });
  }, []);

  return {
    watchPosition,
    clearWatch,
    getCurrentPosition,
  };
}

export default useGeolocation;
