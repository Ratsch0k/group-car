import React from 'react';
import {waitFor} from '@testing-library/react';
import GroupProvider, { GroupUpdater } from './GroupUpdater';
import { CarColor } from '../../api';
import {SnackbarContext} from '../../context/snackbarContext';
import io from 'socket.io-client';
import testRender from '../../../__test__/testRender';
import '../../../__test__/mockI18n';
import { CALL_HISTORY_METHOD } from 'connected-react-router';

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
            {children}
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
    expect(actions).toHaveLength(2);
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

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
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

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
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

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
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
        
          await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
          expect(io).toHaveBeenLastCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
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
    
          await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
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
          await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
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

  describe('routing', () => {
    it('if no group selected but group id specified in ' +
    'path and user is logged in, dispatch selectAndUpdateGroup action', async () => {
      const socketMock = {
        on: jest.fn(),
        off: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socketMock);

      const state = {
        router: {
          location: {
            pathname: '/group/1',
            search: '',
            query: '',
            hash: '',
          },
          action: 'POP'
        },
        group: {
          selectedGroup: null,
          ids: [0, 1],
          entities: {
            0: groups[0],
            1: groups[1],
          }
        },
        auth: {
          user: {
            username: 'TEST',
            id: 1,
          },
        },
      };

      const {store} = customRender(
        state,
        snackContext,
        <GroupUpdater />,
      );

      const expectedAction = {
        type: 'group/selectAndUpdateGroup/pending',
        payload: undefined,
        meta: {
          arg: {
            force: true,
            id: 1,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      await waitFor(() => expect(store.getActions()).toHaveLength(3));
      waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
    });

    it('if group selected but path doesn\'t ' +
    'specify group id, dispatch push with new path', async () => {
      const socketMock = {
        on: jest.fn(),
        off: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socketMock);

      const state = {
        router: {
          location: {
            pathname: '/',
            search: '',
            query: '',
            hash: '',
          },
          action: 'POP'
        },
        group: {
          selectedGroup: groups[1],
        },
        auth: {
          user: {
            username: 'TEST',
            id: 1,
          },
        },
      };

      const {store} = customRender(
        state,
        snackContext,
        <GroupUpdater />,
      );

      const expectedAction = {
        type: CALL_HISTORY_METHOD,
        payload: {
          args: ['/group/1'],
          method: 'push',
        },
      };

      await waitFor(() => expect(store.getActions()).toHaveLength(3));
      expect(store.getActions()).toContainEqual(expectedAction);
    });

    it('if group selected but group id in path is another, ' +
    'dispatch push with new group id', async () => {
        const socketMock = {
          on: jest.fn(),
          off: jest.fn(),
          disconnect: jest.fn(),
        };

        (io as unknown as jest.Mock).mockReturnValue(socketMock);

        const state = {
          router: {
            location: {
              pathname: '/group/0',
              search: '',
              query: '',
              hash: '',
            },
            action: 'POP'
          },
          group: {
            selectedGroup: groups[1],
          },
          auth: {
            user: {
              username: 'TEST',
              id: 1,
            },
          },
        };

        const {store} = customRender(
          state,
          snackContext,
          <GroupUpdater />,
        );

        const expectedAction = {
          type: CALL_HISTORY_METHOD,
          payload: {
            args: ['/group/1'],
            method: 'push',
          },
        };

        await waitFor(() => expect(store.getActions()).toHaveLength(3));
        expect(store.getActions()).toContainEqual(expectedAction);      
    });
    
    it('if group selected and path specifies group id, do nothing', async () => {
      const socketMock = {
        on: jest.fn(),
        off: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socketMock);

      const state = {
        router: {
          location: {
            pathname: '/group/1',
            search: '',
            query: '',
            hash: '',
          },
          action: 'POP'
        },
        group: {
          selectedGroup: groups[1],
        },
        auth: {
          user: {
            username: 'TEST',
            id: 1,
          },
        },
      };

      const {store} = customRender(
        state,
        snackContext,
        <GroupUpdater />,
      );

      await waitFor(() => expect(store.getActions()).toHaveLength(2));
      expect(store.getActions()).not.toContainEqual({
        type: CALL_HISTORY_METHOD,
        payload: expect.anything(),
      });
      expect(store.getActions()).not.toContainEqual({
        type: 'group/selectedAndUpdateGroup',
        payload: expect.anything(),
        meta: expect.anything(),
      });
    });
  })
});
