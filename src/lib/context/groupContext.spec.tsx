import React from 'react';
import {render, waitFor} from '@testing-library/react';
import GroupProvider, { GroupContext } from './groupContext';
import { AuthContext } from './authContext';
import { Api, ApiContext } from './apiContext';

describe('GroupProvider', () => {
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
    } as unknown as jest.Mocked<Api>;
  });

it('gets list of groups on first render', async () => {
    fakeApi.getGroups.mockResolvedValue({data: {groups}});
    let groupContext: GroupContext;
    let renderCounter = 0;

    render(
      <ApiContext.Provider value={fakeApi as unknown as Api}>
        <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
          <GroupProvider>
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
          </GroupProvider>
        </AuthContext.Provider>
      </ApiContext.Provider>
    );

    await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
    expect(groupContext.groups).toEqual(groups);       
    expect(groupContext.selectedGroup).toBe(null);
    expect(renderCounter).toBe(2);
  });

  describe('selectGroups', () => {
    it('sets the selected group to the correct group', async () => {
      fakeApi.getGroups.mockResolvedValue({data: {groups}});
      let groupContext: GroupContext;
      let renderCounter = 0;
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
            <GroupProvider>
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
            </GroupProvider>
          </AuthContext.Provider>
        </ApiContext.Provider>
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      groupContext.selectGroup(1);

      expect(groupContext.selectedGroup).toEqual(groups[1]);
      expect(renderCounter).toBe(3);
    });
  });

  describe('update', () => {
    it('gets groups from api', async () => {
      fakeApi.getGroups
        .mockResolvedValueOnce({data: {groups}})
        .mockResolvedValueOnce({data: {groups: [groups[0]]}});
      let groupContext: GroupContext;
      let renderCounter = 0;
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
            <GroupProvider>
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
            </GroupProvider>
          </AuthContext.Provider>
        </ApiContext.Provider>
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
      let groupContext: GroupContext;
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      // Select group 1
      groupContext.selectGroup(1);

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
      let groupContext: GroupContext;
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
      );
  
      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));
      expect(groupContext.groups).toEqual(groups);       
      expect(groupContext.selectedGroup).toBe(null);

      groupContext.selectGroup(1);

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
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
      fakeApi.getGroup.mockResolvedValue({data: changedGroup});

      let groupContext: GroupContext;
  
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthContext.Provider value={{user: fakeUser} as unknown as AuthContext}>
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
      );

      await waitFor(() => expect(fakeApi.getGroups).toHaveBeenCalledTimes(1));

      // Select group which will be updated
      groupContext.selectGroup(0);
      expect(groupContext.selectedGroup).toEqual(groups[0]);

      // Get that group and check if selected group is updated

      const response = await groupContext.getGroup(changedGroup.id);
      expect(response.data).toEqual(changedGroup);
      expect(fakeApi.getGroup).toHaveBeenCalledTimes(1);
      expect(fakeApi.getGroup).toHaveBeenCalledWith(changedGroup.id);
      expect(groupContext.groups[0]).toEqual(changedGroup);
      expect(groupContext.selectedGroup).toEqual(changedGroup);
    });
  });
});