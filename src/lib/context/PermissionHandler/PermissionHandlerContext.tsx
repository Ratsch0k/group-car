import {createContext} from 'react';

export const Permission = ['geolocation'] as const;


export interface PermissionHandlerContext {
  checkPermission: (name: typeof Permission[number]) =>
  Promise<PermissionStatus>;

  requestPermission: (name: typeof Permission[number]) =>
  Promise<void>;
}

export const PermissionHandlerContext =
createContext<PermissionHandlerContext>({
  checkPermission: () => Promise.reject(new Error('Context is missing')),
  requestPermission: () => Promise.reject(new Error('Context is missing')),
});

export default PermissionHandlerContext;
