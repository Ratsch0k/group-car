import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import ManageGroup from "./ManageGroup";
import React from "react";
import { theme, GroupContext, AuthContext, IUser, ApiContext, GroupWithOwnerAndMembersAndInvites, Api, ModalContext, SnackbarContext} from '../../../lib';
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
    getInvitesOfGroup: jest.fn().mockRejectedValue(undefined),
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
  await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(1);
  expect(fakeApi.getInvitesOfGroup).toHaveBeenLastCalledWith(1);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(1);

  expect(screen.queryByText('modals.group.manage.loadingFailed')).not.toBeNull();

  expect(screen.baseElement).toMatchSnapshot();  
});

it('renders group info if group exists', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }
  const fakeApi = {
    getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
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
  await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
  expect(fakeApi.getInvitesOfGroup).toHaveBeenLastCalledWith(fakeGroup.id);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);

  // Check if name and description exist
  await waitFor(() => expect(screen.queryByText(fakeGroup.name)).not.toBeNull());
  await waitFor(() => expect(screen.queryByText(fakeGroup.description)).not.toBeNull());

  expect(screen.baseElement).toMatchSnapshot();
});

describe('MemberTab', () => {
  it('renders list of members correctly', async () => {
    // Add more members to fake group data
    fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
    fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
    };
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
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
    await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
    expect(fakeApi.getInvitesOfGroup).toHaveBeenLastCalledWith(fakeGroup.id);
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
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
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
    await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
    expect(fakeApi.getInvitesOfGroup).toHaveBeenLastCalledWith(fakeGroup.id);
    expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);
    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(2);
    fakeGroup.invites.forEach((invite) => {
      expect(screen.queryAllByText(invite.User.username)).not.toBeUndefined;
    });
    
    expect(screen.baseElement).toMatchSnapshot();
  });
});


it('get groupId from route params if not provided as property', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }
  const fakeApi = {
    getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
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
  await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
  expect(fakeGroupContext.getGroup).toHaveBeenCalledWith(fakeGroup.id);
  expect(fakeApi.getInvitesOfGroup).toHaveBeenLastCalledWith(fakeGroup.id);
  expect(fakeApi.getMembers).toHaveBeenLastCalledWith(fakeGroup.id);


  expect(screen.baseElement).toMatchSnapshot();
});

describe('Footer', () => {
  describe('Leave button', () => {
    it('leave group button is visible if user is not owner of group', async () => {
      // Add more members to fake group data
      fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: 13,
      };
    
      const screen = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
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
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.leaveGroup.button')).toBeDefined();
      expect(screen.queryByText('modals.group.manage.deleteGroup.button')).toBeNull();
    });
    
    it('clicking leave group opens dialog', async () => {
      // Add more members to fake group data
      fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: 13,
      };
    
      const screen = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
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
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      fireEvent.click(screen.queryByText('modals.group.manage.leaveGroup.button'));
      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.leaveGroup.dialog.title')).toBeDefined();
    });
    
    it('click yes on leave group dialog calls leave group call', async () => {
      // Add more members to fake group data
      fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: 13,
      };
      const modalContext = {
        close: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const screen = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
              <ModalContext.Provider value={modalContext as unknown as ModalContext}>
                <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                  <ApiContext.Provider value={fakeApi as unknown as Api}>
                    <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                        <ManageGroup groupId={2}/>
                    </GroupContext.Provider>
                  </ApiContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      fireEvent.click(screen.queryByText('modals.group.manage.leaveGroup.button'));
      fireEvent.click(screen.queryByText('misc.yes'));
      await waitFor(() => expect(modalContext.close).toHaveBeenCalledTimes(1));
      expect(fakeGroupContext.leaveGroup).toHaveBeenCalledTimes(1);
      expect(fakeGroupContext.leaveGroup).toHaveBeenCalledWith(fakeGroup.id);
      expect(snackbarContext.show).toHaveBeenCalledTimes(1);
      expect(snackbarContext.show).toHaveBeenCalledWith('success', 'modals.group.manage.leaveGroup.success');
    });
  });

  describe('Delete button', () => {
    it('delete group button is visible if user is owner of group', async () => {
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const {baseElement} = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
              <ModalContext.Provider value={modalContext as unknown as ModalContext}>
                <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                  <ApiContext.Provider value={fakeApi as unknown as Api}>
                    <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                        <ManageGroup groupId={2}/>
                    </GroupContext.Provider>
                  </ApiContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      expect(baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.deleteGroup.button')).toBeDefined();
      expect(screen.queryByText('modals.group.manage.leaveGroup.button')).toBeNull();
    });  

    it('clicking on delete group button opens delete dialog', async () => {
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const {baseElement} = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
              <ModalContext.Provider value={modalContext as unknown as ModalContext}>
                <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                  <ApiContext.Provider value={fakeApi as unknown as Api}>
                    <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                        <ManageGroup groupId={2}/>
                    </GroupContext.Provider>
                  </ApiContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));

      expect(baseElement).toMatchSnapshot();
    });

    it('clicking on yes on delete group dialog deletes group', async () => {
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
        deleteGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const {baseElement} = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
              <ModalContext.Provider value={modalContext as unknown as ModalContext}>
                <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                  <ApiContext.Provider value={fakeApi as unknown as Api}>
                    <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                        <ManageGroup groupId={2}/>
                    </GroupContext.Provider>
                  </ApiContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));

      fireEvent.click(screen.queryByText('misc.yes'));

      await waitFor(() => expect(fakeGroupContext.deleteGroup).toBeCalledTimes(1));
      expect(fakeGroupContext.deleteGroup).toBeCalledWith(fakeGroup.id);
      expect(snackbarContext.show).toBeCalledWith({
        content: 'modals.group.manage.deleteGroup.success',
        type: 'success',
      });
      expect(snackbarContext.show).toBeCalledTimes(1);
      expect(modalContext.close).toBeCalledTimes(1);
    });

    it('clicking no on delete group dialog closes delete group dialog', async () => {
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
        deleteGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const {baseElement} = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
              <ModalContext.Provider value={modalContext as unknown as ModalContext}>
                <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                  <ApiContext.Provider value={fakeApi as unknown as Api}>
                    <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                        <ManageGroup groupId={2}/>
                    </GroupContext.Provider>
                  </ApiContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(fakeGroupContext.getGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getInvitesOfGroup).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(fakeApi.getMembers).toHaveBeenCalledTimes(1));
    
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));

      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.queryByText('misc.no'));

      expect(baseElement).toMatchSnapshot();
    });
  });
})