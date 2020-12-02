import React from 'react';
import {render, waitFor} from '@testing-library/react';
import GroupProvider, { GroupContext } from './groupContext';
import { AuthContext } from './authContext';
import { Api, ApiContext } from './apiContext';
import { CarColor } from '../api';
import { MemoryRouter } from 'react-router-dom';

describe('GroupProvider', () => {
  const customRender = (apiContext: Api, authContext: AuthContext, children: React.ReactNode) => {
    return render(
      <MemoryRouter>
        <ApiContext.Provider value={apiContext}>
          <AuthContext.Provider value={authContext}>
            <GroupProvider>
              {children}
            </GroupProvider>
          </AuthContext.Provider>
        </ApiContext.Provider>
      </MemoryRouter>
    );
  };

  let fakeApi: jest.Mocked<Api>;

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
    fakeApi = {
      getGroups: jest.fn(),
      createGroup: jest.fn(),
      getGroup: jest.fn(),
      deleteGroup: jest.fn(),
      getCars: jest.fn(),
    } as unknown as jest.Mocked<Api>;
  });

it('gets list of groups on first render', async () => {
    fakeApi.getGroups.mockResolvedValue({data: {groups}});
    let groupContext: GroupContext;
    let renderCounter = 0;

    customRender(
      fakeApi as unknown as Api,
      {user: fakeUser} as unknown as AuthContext,
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