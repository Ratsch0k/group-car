export type SocketGroupActionType = 'park' | 'drive' | 'add';

export interface SocketGroupActionData {
  action: SocketGroupActionType;
  car: CarWithDriver;
}
