import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import GroupProvider, { GroupContext } from './groupContext';
import { AuthContext } from './authContext';
import { Api, ApiContext } from './apiContext';
import { CarColor } from '../api';
import { MemoryRouter } from 'react-router-dom';
import {SnackbarContext} from './snackbarContext';
import io from 'socket.io-client';

jest.mock('socket.io-client');

describe('GroupProvider', () => {
  const customRender = (
    apiContext: Api,
    authContext: AuthContext,
    snackContext: SnackbarContext,
    children: React.ReactNode
  ) => {
    return render(
      <MemoryRouter>
        <SnackbarContext.Provider value={snackContext}>
          <ApiContext.Provider value={apiContext}>
            <AuthContext.Provider value={authContext}>
                <GroupProvider>
                  {children}
                </GroupProvider>
            </AuthContext.Provider>
          </ApiContext.Provider>
        </SnackbarContext.Provider>
      </MemoryRouter>
    );
  };

  let fakeApi: jest.Mocked<Api>;
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

    fakeApi = {
      getGroups: jest.fn(),
      createGroup: jest.fn(),
      getGroup: jest.fn(),
      deleteGroup: jest.fn(),
      getCars: jest.fn(),
    } as unknown as jest.Mocked<Api>;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

it('gets list of groups on first render', async () => {
    fakeApi.getGroups.mockResolvedValue({data: {groups}});
    let groupContext: GroupContext;
    let renderCounter = 0;

    customRender(
      fakeApi as unknown as Api,
      {user: fakeUser} as unknown as AuthContext,
      snackContext,
      <GroupContext.Consumer>
        {(context) => {
          groupContext = context;
          renderCounter++;
          return (
            <div>
              {JSON.stringify(context)}
            </div>
          );
        }}
      </GroupContext.Consumer>
    );

    await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
    expect(groupContext.groups).toEqual(groups);       
    expect(groupContext.selectedGroup).toBe(null);
    expect(renderCounter).toBe(2);
  });

  describe('websocket', () => {
    it('tries to connect to namespace of group if one is selected', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api,
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    });

    it('handles error event by showing snack', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;

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
  
      customRender(
        fakeApi as unknown as Api,
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
      expect(socketMock.on).toHaveBeenCalledWith('error', expect.any(Function));

      // Simulate error event
      errorEventFn();

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'errors.socketConnection');
    });

    it('handles connect_error event by showing snack', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;

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
  
      customRender(
        fakeApi as unknown as Api,
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);

      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});

      await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
      expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));

      // Simulate error event
      errorEventFn();

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'errors.socketConnection');
    });

    describe('update event', () => {
      describe('add action', () => {
        it('adds the car to the groupCars if a group is ' +
        'selected and the car is not yet in the list', async () => {
          fakeApi.getGroups.mockResolvedValue({data: {groups}});
          fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
          fakeApi.getGroup.mockResolvedValue({data: groups[1]});
          let groupContext: GroupContext;
    
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
      
          customRender(
            fakeApi as unknown as Api,
            {user: fakeUser} as unknown as AuthContext,
            snackContext,
            <GroupContext.Consumer>
              {(context) => {
                groupContext = context;
                return (
                  <div>
                    {JSON.stringify(context)}
                  </div>
                );
              }}
            </GroupContext.Consumer>
          );
      
          await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
          expect(groupContext.groups).toEqual(groups);       
          expect(groupContext.selectedGroup).toBe(null);
    
          await groupContext.selectGroup(1);
    
          expect(groupContext.selectedGroup).toEqual(groups[1]);
    
          await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
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
    
          await waitFor(() => expect(groupContext.groupCars.length).toEqual(cars.length + 1));
          expect(groupContext.groupCars).toContain(car);
        });

        it('won\'t add car to list if it\'s not in the list', async () => {
          fakeApi.getGroups.mockResolvedValue({data: {groups}});
          fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
          fakeApi.getGroup.mockResolvedValue({data: groups[1]});
          let groupContext: GroupContext;
    
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
      
          customRender(
            fakeApi as unknown as Api,
            {user: fakeUser} as unknown as AuthContext,
            snackContext,
            <GroupContext.Consumer>
              {(context) => {
                groupContext = context;
                return (
                  <div>
                    {JSON.stringify(context)}
                  </div>
                );
              }}
            </GroupContext.Consumer>
          );
      
          await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
          expect(groupContext.groups).toEqual(groups);       
          expect(groupContext.selectedGroup).toBe(null);
    
          await groupContext.selectGroup(1);
    
          expect(groupContext.selectedGroup).toEqual(groups[1]);
    
          await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
          expect(io).toHaveBeenCalledWith('/group/1', {path: '/socket'});
    
          await waitFor(() =>  expect(socketMock.on).toHaveBeenCalledTimes(3));
          expect(socketMock.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    
          const car = {
            groupId: 1,
            carId: 1,
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
    
          expect(groupContext.groupCars.length).toEqual(cars.length);
          expect(groupContext.groupCars).not.toContain(car);
        });
      });
      
      describe('drive action', () => {
        it('update car if a group is selected and the car is in the list', async () => {
          fakeApi.getGroups.mockResolvedValue({data: {groups}});
          fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
          fakeApi.getGroup.mockResolvedValue({data: groups[1]});
          let groupContext: GroupContext;
    
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
      
          customRender(
            fakeApi as unknown as Api,
            {user: fakeUser} as unknown as AuthContext,
            snackContext,
            <GroupContext.Consumer>
              {(context) => {
                groupContext = context;
                return (
                  <div>
                    {JSON.stringify(context)}
                  </div>
                );
              }}
            </GroupContext.Consumer>
          );
      
          await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
          expect(groupContext.groups).toEqual(groups);       
          expect(groupContext.selectedGroup).toBe(null);
    
          await groupContext.selectGroup(1);
    
          expect(groupContext.selectedGroup).toEqual(groups[1]);
    
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
    
          await waitFor(() =>
            expect(groupContext.groupCars.find((groupCar) =>
              groupCar.carId === car.carId)).toEqual(car));
        });
      });

      describe('park action', () => {
        it('update car if a group is selected and the car is in the list', async () => {
          fakeApi.getGroups.mockResolvedValue({data: {groups}});
          fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
          fakeApi.getGroup.mockResolvedValue({data: groups[1]});
          let groupContext: GroupContext;
    
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
      
          customRender(
            fakeApi as unknown as Api,
            {user: fakeUser} as unknown as AuthContext,
            snackContext,
            <GroupContext.Consumer>
              {(context) => {
                groupContext = context;
                return (
                  <div>
                    {JSON.stringify(context)}
                  </div>
                );
              }}
            </GroupContext.Consumer>
          );
      
          await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
          expect(groupContext.groups).toEqual(groups);       
          expect(groupContext.selectedGroup).toBe(null);
    
          await groupContext.selectGroup(1);
    
          expect(groupContext.selectedGroup).toEqual(groups[1]);
    
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
    
          await waitFor(() =>
            expect(groupContext.groupCars.find((groupCar) =>
              groupCar.carId === car.carId)).toEqual(car));
        });
      });
    });
  });

  describe('routing', () => {
    it('selects correct group if route is /group/:id', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
  
      render(
        <MemoryRouter initialEntries={['/group/1']}>
          <SnackbarContext.Provider value={snackContext}>
            <ApiContext.Provider value={fakeApi as Api}>
              <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                <GroupProvider>
                  <GroupContext.Consumer>
                    {(context) => {
                      groupContext = context;
                      return (
                        <div>
                          {JSON.stringify(context)}
                        </div>
                      );
                    }}
                  </GroupContext.Consumer>
                </GroupProvider>
              </AuthContext.Provider>
            </ApiContext.Provider>
          </SnackbarContext.Provider>
        </MemoryRouter>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);    
      
      await waitFor(() => expect(fakeApi.getGroup).toHaveBeenCalledTimes(2));
      expect(fakeApi.getGroup).toHaveBeenCalledWith(1);
      expect(groupContext.selectedGroup).toEqual(groups[1]);
    });
  });

  describe('selectGroups', () => {
    it('sets the selected group to the correct group', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
      let renderCounter = 0;
  
      customRender(
        fakeApi as unknown as Api,
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            renderCounter++;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);
      expect(renderCounter).toBe(6);
    });
  });

  describe('update', () => {
    it('gets groups from api', async () => {
      fakeApi.getGroups
        .mockResolvedValueOnce({data: {groups}})
        .mockResolvedValueOnce({data: {groups: [groups[0]]}});
      let groupContext: GroupContext;
      let renderCounter = 0;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            renderCounter++;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.update();

      expect(fakeApi.getGroups).toHaveBeenCalledTimes(2);
      expect(groupContext.groups).toEqual([groups[0]]);
      expect(renderCounter).toBe(3);
    });

    it('sets selected group to null if the selected group ' +
    'doesn\'t exist in new list', async () => {
      fakeApi.getGroups
        .mockResolvedValueOnce({data: {groups}})
        .mockResolvedValueOnce({data: {groups: [groups[0]]}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      // Select group 1
      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);

      // Update
      await groupContext.update();

      expect(fakeApi.getGroups).toHaveBeenCalledTimes(2);
      expect(groupContext.groups).toEqual([groups[0]]);
      expect(groupContext.selectedGroup).toEqual(null);
    });

    it('updates selected group if the selected group exists in new group array', async () => {
      fakeApi.getGroups.mockResolvedValueOnce({data: {groups}});
      const changedGroups = groups;
      changedGroups[1].name = "New description";
      fakeApi.getGroups.mockResolvedValueOnce({data: {groups}});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      await groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);

      // Call update
      await groupContext.update();

      expect(groupContext.selectedGroup).toEqual(changedGroups[1]);
    });
  });

  describe('createGroup', () => {
    it('calls api, sets selected group to created one and updates list', async () => {
      fakeApi.getGroups
        .mockResolvedValue({data: {groups: [groups[0]]}});
      fakeApi.createGroup.mockResolvedValue({data: groups[1]});
      fakeApi.getGroup.mockResolvedValue({data: groups[1]});
      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual([groups[0]]);       
      expect(groupContext.selectedGroup).toBe(null);

      // Update
      const response = await groupContext.createGroup(groups[1].name, groups[1].description);

      expect(response).toEqual({data: groups[1]});
      expect(fakeApi.getGroups).toHaveBeenCalledTimes(1);
      expect(fakeApi.createGroup).toHaveBeenCalledTimes(1);
      expect(fakeApi.createGroup).toHaveBeenCalledWith(groups[1].name, groups[1].description);
      expect(fakeApi.getGroup).toHaveBeenCalledTimes(1);
      expect(fakeApi.getGroup).toHaveBeenCalledWith(groups[1].id);
      expect(groupContext.groups).toEqual(groups);
      expect(groupContext.selectedGroup).toEqual(groups[1]);
    });
  });

  describe('getGroup', () => {
    it('gets groups from api call', async () => {
      const fakeGroup = groups[0];
      fakeApi.getGroups.mockResolvedValue({data: {groups: []}});
      fakeApi.getGroup.mockResolvedValue({data: fakeGroup});

      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );

      const response = await groupContext.getGroup(fakeGroup.id);
      expect(response.data).toEqual(fakeGroup);
      expect(fakeApi.getGroup).toHaveBeenCalledTimes(1);
      expect(fakeApi.getGroup).toHaveBeenCalledWith(fakeGroup.id);
    });

    it('updates groups array with if it contains the gotten group', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});

      const changedGroup = groups[0];
      changedGroup.name = "New name";
      fakeApi.getGroup.mockResolvedValue({data: changedGroup});

      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );

      const response = await groupContext.getGroup(changedGroup.id);
      expect(response.data).toEqual(changedGroup);
      expect(fakeApi.getGroup).toHaveBeenCalledTimes(1);
      expect(fakeApi.getGroup).toHaveBeenCalledWith(changedGroup.id);
      expect(groupContext.groups[0]).toEqual(changedGroup);
    });

    it('updates selected group if it is the selected group', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});

      const changedGroup = groups[0];
      changedGroup.name = "New name";
      fakeApi.getGroup
        .mockResolvedValueOnce({data: groups[0]})
        .mockResolvedValueOnce({data: changedGroup});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);

      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );

      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));

      // Select group which will be updated
      await groupContext.selectGroup(0);
      expect(groupContext.selectedGroup).toEqual(groups[0]);

      // Get that group and check if selected group is updated

      const response = await groupContext.getGroup(changedGroup.id);
      expect(response.data).toEqual(changedGroup);
      expect(fakeApi.getGroup).toHaveBeenCalledTimes(2);
      expect(fakeApi.getGroup).toHaveBeenCalledWith(changedGroup.id);
      expect(groupContext.groups[0]).toEqual(changedGroup);
      expect(groupContext.selectedGroup).toEqual(changedGroup);
    });
  });

  describe('deleteGroup', () => {
    it('sends request, deletes group und unsets selectedGroup', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.deleteGroup.mockResolvedValue({data: undefined});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[0]})

      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );

      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));

      const groupToDelete = groups[0];
      // Select group which will be unset
      await groupContext.selectGroup(groupToDelete.id);

      // Get that group and check if selected group is updated
      await groupContext.deleteGroup(groupToDelete.id);
      expect(fakeApi.deleteGroup).toBeCalledTimes(1);
      expect(fakeApi.deleteGroup).toBeCalledWith(groupToDelete.id);
      expect(groupContext.selectedGroup).toBeNull();
      expect(groupContext.groups).toHaveLength(groups.length - 1);
      expect(groupContext.groups).not.toContain(groups[0]);
    });

    it('doesn\'t unset selected group if it\'s not the deleted one', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      fakeApi.deleteGroup.mockResolvedValue({data: undefined});
      fakeApi.getCars.mockResolvedValue({data: {cars}} as any);
      fakeApi.getGroup.mockResolvedValue({data: groups[1]})

      let groupContext: GroupContext;
  
      customRender(
        fakeApi as unknown as Api, 
        {user: fakeUser} as unknown as AuthContext,
        snackContext,
        <GroupContext.Consumer>
          {(context) => {
            groupContext = context;
            return (
              <div>
                {JSON.stringify(context)}
              </div>
            );
          }}
        </GroupContext.Consumer>
      );

      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));

      const groupToDelete = groups[0];
      // Select group which will be unset
      groupContext.selectGroup(groups[1].id);

      // Get that group and check if selected group is updated
      await groupContext.deleteGroup(groupToDelete.id);
      expect(fakeApi.deleteGroup).toBeCalledTimes(1);
      expect(fakeApi.deleteGroup).toBeCalledWith(groupToDelete.id);
      expect(groupContext.selectedGroup).toBe(groups[1]);
    });
  });
});