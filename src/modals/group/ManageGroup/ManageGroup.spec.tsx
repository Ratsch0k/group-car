import { render, waitFor } from "@testing-library/react";
import ManageGroup from "./ManageGroup";
import React from "react";
import { Api, theme, GroupContext, AuthContext, GroupWithOwnerAndMembers, IUser} from '../../../lib';
import { MemoryRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";

const fakeGroup: GroupWithOwnerAndMembers = {
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
  ]
};

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
})

it('renders error message if group doesn\'t exist', async () => {
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

  await waitFor(() => expect(fakeApi.getGroup).toHaveBeenCalledTimes(1));
  expect(fakeApi.getGroup).toHaveBeenLastCalledWith(1);
  expect(screen.queryByText('modals.group.manage.loadingFailed')).not.toBeNull();

  expect(screen.baseElement).toMatchSnapshot();  
})

it('renders group name and description if group exists', async () => {

  const fakeApi = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AuthContext.Provider value={{user: fakeGroup.Owner as IUser} as AuthContext}>
          <GroupContext.Provider value={fakeApi as unknown as GroupContext}>
              <ManageGroup groupId={2}/>
          </GroupContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  await waitFor(() => expect(fakeApi.getGroup).toHaveBeenCalledTimes(1));
  expect(fakeApi.getGroup).toHaveBeenLastCalledWith(fakeGroup.id);

  expect(screen.baseElement).toMatchSnapshot();

  
  // Check if name and description exist
  expect(screen.queryByText(fakeGroup.name)).not.toBeNull();
  expect(screen.queryByText(fakeGroup.description)).not.toBeNull();
})

it('get groupId from route params if not provided as property', async () => {
  const fakeApi = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }

  const screen = render (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/group/manage/${fakeGroup.id}`]}>
        <GroupContext.Provider value={fakeApi as unknown as GroupContext}>
          <Route path='/group/manage/:groupId'>
            <ManageGroup />
          </Route>
        </GroupContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );

  await waitFor(() => expect(fakeApi.getGroup).toHaveBeenCalledTimes(1));
  expect(fakeApi.getGroup).toHaveBeenLastCalledWith(fakeGroup.id);

  expect(screen.baseElement).toMatchSnapshot();
})
