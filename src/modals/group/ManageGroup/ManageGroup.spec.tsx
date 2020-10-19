import { render, waitFor } from "@testing-library/react";
import ManageGroup from "./ManageGroup";
import React from "react";
import { theme, GroupContext, AuthContext, IUser, ApiContext, GroupWithOwnerAndMembersAndInvites, Api} from '../../../lib';
import { MemoryRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";

let fakeGroup: GroupWithOwnerAndMembersAndInvites;

beforeEach(() => {
  fakeGroup = {
    id: 2,
    Owner: {
      id: 2,
      username: "TEST",
    },
    ownerId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'fake group name',
    description: 'fake group description',
    members: [
      {
        User: {
          id: 2,
          username: 'TEST',
        },
        isAdmin: true,
      }
    ],
    invites: [],
  };
}); 

it('renders without crashing', () => {
  render(
    <MemoryRouter>
      <ManageGroup groupId={2} />
    </MemoryRouter>
  );
});

it('renders circular progress while loading group data',() => {
  const fakeApi = {
    getGroup: jest.fn().mockRejectedValue(undefined),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <GroupContext.Provider value={fakeApi as unknown as GroupContext}>
          <ManageGroup groupId={1}/>
        </GroupContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  expect(screen.baseElement).toMatchSnapshot();
});

it('renders error message if group doesn\'t exist', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockRejectedValue(undefined),
  }
  const fakeApi = {
    getInvites: jest.fn().mockRejectedValue(undefined),
    getMembers: jest.fn().mockRejectedValue(undefined),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
            <ManageGroup groupId={1}/>
          </GroupContext.Provider>
        </ApiContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getInvites).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(1);
  expect(fakeApi.getInvites).toHaveBeenLastCalledWith(1);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(1);

  expect(screen.queryByText('modals.group.manage.loadingFailed')).not.toBeNull();

  expect(screen.baseElement).toMatchSnapshot();  
});

it('renders group info if group exists', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }
  const fakeApi = {
    getInvites: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
    getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AuthContext.Provider value={{user: fakeGroup.Owner as IUser} as AuthContext}>
          <ApiContext.Provider value={fakeApi as unknown as Api}>
            <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                <ManageGroup groupId={2}/>
            </GroupContext.Provider>
          </ApiContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getInvites).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
  expect(fakeApi.getInvites).toHaveBeenLastCalledWith(fakeGroup.id);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);

  // Check if name and description exist
  await waitFor(() => expect(screen.queryByText(fakeGroup.name)).not.toBeNull());
  await waitFor(() => expect(screen.queryByText(fakeGroup.description)).not.toBeNull());

  expect(screen.baseElement).toMatchSnapshot();
});

it('renders list of members correctly', async () => {
  // Add more members to fake group data
  fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
  fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  };
  const fakeApi = {
    getInvites: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
    getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AuthContext.Provider value={{user: fakeGroup.Owner as IUser} as AuthContext}>
          <ApiContext.Provider value={fakeApi as unknown as Api}>
            <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                <ManageGroup groupId={2}/>
            </GroupContext.Provider>
          </ApiContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );


  await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getInvites).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
  expect(fakeApi.getInvites).toHaveBeenLastCalledWith(fakeGroup.id);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);

  expect(screen.baseElement).toMatchSnapshot();
});

it('renders list of invites correctly', async () => {
    // Add more members to fake group data
    fakeGroup.invites.push({
      User: {
        id: 12,
        username: 'ADMIN_1'
      },
      userId: 12,
      invitedBy: 21,
      InviteSender: {
        username: 'owner',
        id: 21
      },
      groupId: 31,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    fakeGroup.invites.push({
      User: {
        id: 13,
        username: 'ADMIN_2'
      },
      userId: 13,
      invitedBy: 21,
      InviteSender: {
        username: 'owner',
        id: 21
      },
      groupId: 31,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
    };
    const fakeApi = {
      getInvites: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
    }
  
    const screen = render (
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AuthContext.Provider value={{user: fakeGroup.Owner as IUser} as AuthContext}>
            <ApiContext.Provider value={fakeApi as unknown as Api}>
              <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                  <ManageGroup groupId={2}/>
              </GroupContext.Provider>
            </ApiContext.Provider>
          </AuthContext.Provider>
        </MemoryRouter>
      </ThemeProvider>
    );
  
  
    await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fakeApi.getInvites).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
    expect(fakeApi.getInvites).toHaveBeenLastCalledWith(fakeGroup.id);
    expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);
    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(2);
    fakeGroup.invites.forEach((invite) => {
      expect(screen.queryAllByText(invite.User.username)).not.toBeUndefined;
    });
  
    expect(screen.baseElement).toMatchSnapshot();
});

it('get groupId from route params if not provided as property', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }
  const fakeApi = {
    getInvites: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
    getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/group/manage/${fakeGroup.id}`]}>
      <ApiContext.Provider value={fakeApi as unknown as Api}>
          <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
            <Route path='/group/manage/:groupId'>
              <ManageGroup />
            </Route>
          </GroupContext.Provider>
        </ApiContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getInvites).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
  expect(fakeApi.getInvites).toHaveBeenLastCalledWith(fakeGroup.id);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);


  expect(screen.baseElement).toMatchSnapshot();
});
