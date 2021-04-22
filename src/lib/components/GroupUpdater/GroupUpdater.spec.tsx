import React from 'react';
import {waitFor} from '@testing-library/react';
import GroupProvider, { GroupUpdater } from './GroupUpdater';
import { CarColor } from '../../api';
import {SnackbarContext} from '../../context/snackbarContext';
import io from 'socket.io-client';
import testRender from '../../../__test__/testRender';
import '../../../__test__/mockI18n';

jest.mock('socket.io-client');


describe('GroupProvider', () => {
  function customRender<T>(
    state: T,
    snackContext: SnackbarContext,
    children: React.ReactNode
  ) {
    return testRender(
      state,
        <SnackbarContext.Provider value={snackContext}>
            <GroupProvider>
              {children}
            </GroupProvider>
        </SnackbarContext.Provider>
    );
  };

  let snackContext: SnackbarContext;

  const groups = [
    {
      id: 0,
      name: 'group-1',
      description: 'desc-1',
    },
    {
      id: 1,
      name: 'group-2',
      description: 'desc-2',
    },
  ];

  const cars = [
    {
      groupId: 1,
      carId: 1,
      name: 'car-1',
      color: CarColor.Red,
      driverId: null,
      Driver: null,
    },
    {
      groupId: 1,
      carId: 2,
      name: 'car-2',
      color: CarColor.Black,
      driverId: null,
      Driver: null,
    },
    {
      groupId: 1,
      carId: 3,
      name: 'car-3',
      color: CarColor.Blue,
      driverId: null,
      Driver: null,
    },
  ];

  const fakeUser = {
    id: 5,
    username: 'test',
    isBetaUser: true,
    email: 'test@mail.com',
  }

  beforeEach(() => {
    snackContext = {
      show: jest.fn(),
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

it('dispatch no update action if user is not logged in', async () => {
  const state = {
    auth: {
      user: undefined,
    },
    group: {
      selectedGroup: null,
    },
  };

  const {store} = customRender(
    state,
    snackContext,
    <GroupUpdater />
  );

  const actions = store.getActions();

  const expectedAction = {
    type: 'group/update/pending',
    payload: undefined,
    meta: expect.anything(),
  }
  expect(actions).not.toContainEqual(expectedAction);
  expect(actions).toHaveLength(1);
});

it('dispatch update action if user logged in', async () => {
  const state = {
    auth: {
      user: {
        username: 'test',
      },
    },
    group: {
      selectedGroup: null,
    },
  };

  const {store} = customRender(
    state,
    snackContext,
    <GroupUpdater />
  );

  const actions = store.getActions();

  const expectedAction = {
    type: 'group/update/pending',
    payload: undefined,
    meta: expect.anything(),
  }
  expect(actions).toContainEqual(expectedAction);
  expect(actions).toHaveLength(3);
});

  describe('websocket', () => {
    it('tries to connect to namespace of group if one is selected', async () => {  
      const state = {
        auth: {
          user: {
            username: 'test',
          },
        },
        group: {
          selectedGroup: {
            ...groups[1],
            ...cars,
          },
        },
      };

      customRender(
        state,
        snackContext,
        <GroupUpdater />
      );

      await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
      expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});
    });

    it('handles error event by showing snack', async () => {
      let errorEventFn: Function;

      const socketMock = {
        on: jest.fn().mockImplementation((type: string, fn: Function) => {
          if (type === 'error') {
            errorEventFn = fn;
          }
        }),
        off: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socketMock);
  
      const state = {
        auth: {
          user: {
            username: 'test',
          },
        },
        group: {
          selectedGroup: {
            ...groups[1],
            ...cars,
          }
        }
      };

      customRender(
        state,
        snackContext,
        <GroupUpdater />,
      );

      await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
      expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(6));
      expect(socketMock.on).toHaveBeenCalledWith('error', expect.any(Function));

      // Simulate error event
      errorEventFn();

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'errors.socketConnection');
    });

    it('handles connect_error event by showing snack', async () => {
      let errorEventFn: Function;

      const socketMock = {
        on: jest.fn().mockImplementation((type: string, fn: Function) => {
          if (type === 'connect_error') {
            errorEventFn = fn;
          }
        }),
        off: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socketMock);

      const state = {
        auth: {
          user: {
            username: 'test',
          },
        },
        group: {
          selectedGroup: {
            ...groups[1],
            ...cars,
          }
        }
      };

      customRender(
        state,
        snackContext,
        <GroupUpdater />,
      );

      await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
      expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(6));
      expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));

      // Simulate error event
      errorEventFn();

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'errors.socketConnection');
    });

    describe('update event', () => {
      describe('add action', () => {
        it('dispatches addCar action', async () => {
    
          let actionHandler: Function;
    
          const socketMock = {
            on: jest.fn().mockImplementation((type: string, fn: Function) => {
              if (type === 'update') {
                actionHandler = fn;
              }
            }),
            off: jest.fn(),
            disconnect: jest.fn(),
          };
    
          (io as unknown as jest.Mock).mockReturnValue(socketMock);
      
          const state = {
            auth: {
              user: {
                username: 'test',
              },
            },
            group: {
              selectedGroup: {
                ...groups[1],
                ...cars,
              },
            },
          };

          const {store} = customRender(
            state,
            snackContext,
            <GroupUpdater />,
          );
        
          await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
          expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(6));
          expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    
          const car = {
            groupId: 1,
            carId: 4,
            driverId: null,
            Driver: null,
            latitude: null,
            longitude: null,
          };

          // Simulate error event
          actionHandler({
            action: 'add',
            car,
          });

          const expectedAction = {
            type: 'group/addCar',
            payload: car,
          }
    
          await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
        });
      });
      
      describe('drive action', () => {
        it('dispatches update car action', async () => {
          let actionHandler: Function;
    
          const socketMock = {
            on: jest.fn().mockImplementation((type: string, fn: Function) => {
              if (type === 'update') {
                actionHandler = fn;
              }
            }),
            off: jest.fn(),
            disconnect: jest.fn(),
          };
    
          (io as unknown as jest.Mock).mockReturnValue(socketMock);
      
          const state = {
            auth: {
              user: {
                username: 'test',
              },
            },
            group: {
              selectedGroup: {
                ...groups[1],
                ...cars,
              },
            },
          };

          const {store} = customRender(
            state,
            snackContext,
            <GroupUpdater />,
          );
    
          await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(6));
          expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    
          const car = {
            groupId: 1,
            carId: 1,
            driverId: 4,
            Driver: {
              username: 'driver',
              id: 4,
            },
            latitude: null,
            longitude: null,
            name: 'car-1',
          };

          // Simulate error event
          actionHandler({
            action: 'drive',
            car,
          });
    
          const expectedAction = {
            type: 'group/updateCar',
            payload: car,
          };

          await waitFor(() =>
            expect(store.getActions()).toContainEqual(expectedAction));
        });
      });

      describe('park action', () => {
        it('dispatches update car action', async () => {
          let actionHandler: Function;
    
          const socketMock = {
            on: jest.fn().mockImplementation((type: string, fn: Function) => {
              if (type === 'update') {
                actionHandler = fn;
              }
            }),
            off: jest.fn(),
            disconnect: jest.fn(),
          };
    
          (io as unknown as jest.Mock).mockReturnValue(socketMock);

          const state = {
            auth: {
              user: {
                username: 'test',
              },
            },
            group: {
              selectedGroup: {
                ...groups[1],
                ...cars,
              },
            },
          };

          const {store} = customRender(
            state,
            snackContext,
            <GroupUpdater />
          );
          await waitFor(() => expect(io).toHaveBeenCalledTimes(2));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(6));
          expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    
          const car = {
            groupId: 1,
            carId: 1,
            driverId: null,
            Driver: null,
            latitude: 50,
            longitude: 8,
            name: 'car-1',
          };

          // Simulate error event
          actionHandler({
            action: 'park',
            car,
          });

          const expectedAction = {
            type: 'group/updateCar',
            payload: car,
          };
    
          await waitFor(() =>
            expect(store.getActions()).toContainEqual(expectedAction));
        });
      });
    });
  });
});
