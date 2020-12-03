import { fireEvent, render, waitFor, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ManageGroup from "./ManageGroup";
import React from "react";
import { theme, GroupContext, AuthContext, IUser, ApiContext, GroupWithOwnerAndMembersAndInvites, Api, ModalContext, SnackbarContext, CarColor} from '../../../lib';
import { MemoryRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import userEvent from '@testing-library/user-event';
import io from 'socket.io-client';

let fakeGroup: GroupWithOwnerAndMembersAndInvites;
jest.mock('socket.io-client');

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

afterEach(() => {
  jest.clearAllMocks();
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
    getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
    getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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

it('get groupId from route params if not provided as property', async () => {
  const fakeGroupContext = {
    getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
  }
  const fakeApi = {
    getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
    getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
    getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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

  describe('options button', () => {
    describe('will', () => {
      it('never appear if current user is not an admin', async () => {
          const member = {id: 13, username: 'MEMBER'};

          // Add more members to fake group data
          fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
          fakeGroup.members.push({User: member, isAdmin: false});
          const fakeGroupContext = {
            getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
          };
          const fakeApi = {
            getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
            getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
            getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
          }
        
          const screen = render (
            <ThemeProvider theme={theme}>
              <MemoryRouter>
                <AuthContext.Provider value={{user: member as IUser} as AuthContext}>
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
          expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`)).toBeFalsy();
          expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeFalsy();
      });

      it('not appear if current user and member is admin', async () => {
        const admin = {id: 13, username: 'OTHER ADMIN'};

        // Add more members to fake group data
        fakeGroup.members.push({User: {id: 12, username: 'ADMIN'}, isAdmin: true});
        fakeGroup.members.push({User: admin, isAdmin: true});
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
        }
      
        const screen = render (
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <AuthContext.Provider value={{user: admin as IUser} as AuthContext}>
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
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${admin.id}-options-button`)).toBeFalsy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeFalsy();
      });

      it('appear if current user is admin and member is not an admin', async () => {
        const admin = {id: 13, username: 'OTHER ADMIN'};

        // Add more members to fake group data
        fakeGroup.members.push({User: {id: 12, username: 'MEMBER'}, isAdmin: false});
        fakeGroup.members.push({User: admin, isAdmin: true});
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
        }
      
        const screen = render (
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <AuthContext.Provider value={{user: admin as IUser} as AuthContext}>
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
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${admin.id}-options-button`)).toBeFalsy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeDefined();
      });

      it('appear if current user is the owner and member is admin or not an admin', async () => {
        // Add more members to fake group data
        fakeGroup.members.push({User: {id: 12, username: 'MEMBER'}, isAdmin: false});
        fakeGroup.members.push({User: {id: 13, username: 'ADMIN'}, isAdmin: true});
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-3-options-button`)).toBeDefined();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeDefined();
      });
    });
    it('click on grant admin sends grant admin request and adds admin badge to member', async () => {
      // Add more members to fake group data
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
        grantAdmin: jest.fn().mockResolvedValue(undefined),
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      fireEvent.click(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${fakeGroup.members[1].User.id}-options-button`));
      expect(screen.baseElement).toMatchSnapshot();
      fireEvent.click(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin'));
      
      await waitFor(() => expect(fakeApi.grantAdmin).toBeCalledTimes(1));
      expect(fakeApi.grantAdmin).toBeCalledWith(fakeGroup.id, fakeGroup.members[1].User.id);
      expect(screen.baseElement).toMatchSnapshot();
    });

    it('if member is not an admin grant admin option is shown', async () => {
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: false});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
        grantAdmin: jest.fn().mockResolvedValue(undefined),
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      expect(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin')).toBeTruthy();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin')).toBeFalsy();
    });

    it('if member is admin the revoke admin option is shown', async () => {
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: true});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
        grantAdmin: jest.fn().mockResolvedValue(undefined),
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      expect(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin')).toBeTruthy();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin')).toBeFalsy();
    });

    it('click on revoke admin will send revoke admin request and remove admin badge', async () => {
      fakeGroup.members.push({User: {id: 13, username: 'MEMBER'}, isAdmin: true});
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        update: jest.fn().mockResolvedValue(undefined),
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
        grantAdmin: jest.fn().mockResolvedValue(undefined),
        revokeAdmin: jest.fn().mockResolvedValue(undefined),
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
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
      fireEvent.click(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin'));
      await waitFor(() => expect(fakeApi.revokeAdmin).toBeCalledTimes(1));
      expect(fakeApi.revokeAdmin).toBeCalledWith(fakeGroup.id, fakeGroup.members[1].User.id);
      expect(screen.baseElement).toMatchSnapshot();
    });
  });
});

describe('CarTab', () => {
  it('cars tab is rendered correctly', async () => {
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      leaveGroup: jest.fn().mockResolvedValue(undefined),
    };
    const carList = [
      {
        name: 'car-1',
        groupId: fakeGroup.id,
        color: CarColor.Red,
        driverId: null,
        carId: 1,
      },
      {
        name: 'car-2',
        groupId: fakeGroup.id,
        color: CarColor.Black,
        driverId: null,
        carId: 2,
      },
      {
        name: 'car-2',
        groupId: fakeGroup.id,
        color: CarColor.Green,
        driverId: 2,
        Driver: {
          id: 2,
          username: 'driver-1'
        },
        carId: 2,
      }
    ];
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      getCars: jest.fn().mockResolvedValue({data: {cars: carList}}),
    };
    const fakeUser = {
      id: fakeGroup.ownerId,
    };
    const modalContext = {
      close: jest.fn(),
      route: '',
      goTo: jest.fn(),
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
    await waitFor(() => expect(fakeApi.getCars).toHaveBeenCalledTimes(1));
    expect(fakeApi.getCars).toHaveBeenCalledWith(fakeGroup.id);

    expect(baseElement.querySelector('#create-car-fab')).toBeFalsy();

    fireEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(modalContext.goTo).toHaveBeenCalledWith(`/group/manage/${fakeGroup.id}/cars`);

    expect(baseElement).toMatchSnapshot();
  });

  it('clicking add fab opens create car dialog', async () => {
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      leaveGroup: jest.fn().mockResolvedValue(undefined),
    };
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
    }
    const fakeUser = {
      id: fakeGroup.ownerId,
    };
    const modalContext = {
      close: jest.fn(),
      route: '',
      goTo: jest.fn(),
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

    fireEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(modalContext.goTo).toHaveBeenCalledWith(`/group/manage/${fakeGroup.id}/cars`);
    fireEvent.click(baseElement.querySelector('#create-car-fab'));

    expect(baseElement).toMatchSnapshot();
  });

  it('entering a name and clicking create sends request to create a car', async () => {
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      leaveGroup: jest.fn().mockResolvedValue(undefined),
    };
    const fakeCar = {
      name: 'test car',
      groupId: fakeGroup.id,
      carId: 1,
      color: CarColor.Red,
      driverId: null,
    };
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      createCar: jest.fn().mockResolvedValue({data: fakeCar}),
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
    }
    const fakeUser = {
      id: fakeGroup.ownerId,
    };
    const modalContext = {
      close: jest.fn(),
      route: '',
      goTo: jest.fn(),
    };
    const snackbarContext = {
      show: jest.fn(),
    };
  
    const {baseElement} = render(
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

    userEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(modalContext.goTo).toHaveBeenCalledWith(`/group/manage/${fakeGroup.id}/cars`);
    userEvent.click(baseElement.querySelector('#create-car-fab'));

    userEvent.type(baseElement.querySelector('#create-car-name'), fakeCar.name);

    userEvent.click(screen.getByText('misc.create'));

    await waitFor(() => expect(fakeApi.createCar).toHaveBeenCalledTimes(1));
    expect(fakeApi.createCar).toHaveBeenCalledWith(fakeCar.groupId, fakeCar.name, fakeCar.color);


    await waitFor(() => expect(baseElement.querySelector(`#car-tab-${fakeCar.carId}`)).toBeTruthy());

    expect(baseElement).toMatchSnapshot();
  });

  it('when new car is created used color is removed from ' +
  'car color selection', async () => {
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      leaveGroup: jest.fn().mockResolvedValue(undefined),
    };
    const fakeCar = {
      name: 'test car',
      groupId: fakeGroup.id,
      carId: 1,
      color: CarColor.Red,
      driverId: null,
    };
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      createCar: jest.fn().mockResolvedValue({data: fakeCar}),
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
    }
    const fakeUser = {
      id: fakeGroup.ownerId,
    };
    const modalContext = {
      close: jest.fn(),
      route: '',
      goTo: jest.fn(),
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

    userEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(modalContext.goTo).toHaveBeenCalledWith(`/group/manage/${fakeGroup.id}/cars`);
    userEvent.click(baseElement.querySelector('#create-car-fab'));

    userEvent.type(baseElement.querySelector('#create-car-name'), fakeCar.name);

    userEvent.click(screen.getByText('misc.create'));

    await waitFor(() => expect(fakeApi.createCar).toHaveBeenCalledTimes(1));
    expect(fakeApi.createCar).toHaveBeenCalledWith(fakeCar.groupId, fakeCar.name, fakeCar.color);

    userEvent.click(baseElement.querySelector('#create-car-fab'));
    userEvent.click(baseElement.querySelector('#create-car-color'));
    expect(screen.queryByText('misc.Red')).toBeNull();

    expect(baseElement).toMatchSnapshot();
  });

  it('is automatically selected if modal route ' +
  'is /group/manage/:groupId/cars', async () => {
    const fakeGroupContext = {
      getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
      leaveGroup: jest.fn().mockResolvedValue(undefined),
    };
    const fakeCar = {
      name: 'test car',
      groupId: fakeGroup.id,
      carId: 1,
      color: CarColor.Red,
      driverId: null,
    };
    const fakeApi = {
      getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
      getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
      createCar: jest.fn().mockResolvedValue({data: fakeCar}),
      getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
    }
    const fakeUser = {
      id: fakeGroup.ownerId,
    };
    const modalContext = {
      close: jest.fn(),
      route: `/group/manage/${fakeGroup.id}/cars`,
      goTo: jest.fn(),
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

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(baseElement).toMatchSnapshot();
  });

  describe('websocket', () => {
    it('connects to namespace to group and listens to update event', async () => {
      const fakeGroupContext = {
        getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
        leaveGroup: jest.fn().mockResolvedValue(undefined),
      };
      const fakeCar = {
        name: 'test car',
        groupId: fakeGroup.id,
        carId: 1,
        color: CarColor.Red,
        driverId: null,
      };
      const fakeApi = {
        getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
        getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
        createCar: jest.fn().mockResolvedValue({data: fakeCar}),
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
        route: `/group/manage/${fakeGroup.id}/cars`,
        goTo: jest.fn(),
      };
      const snackbarContext = {
        show: jest.fn(),
      };

      const socket = {
        off: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn(),
      };

      (io as unknown as jest.Mock).mockReturnValue(socket);
    
      render (
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
  
      await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
      expect(io).toHaveBeenCalledWith('/group/2', {path: '/socket'});

      await waitFor(() => expect(socket.on).toHaveBeenCalledWith('update', expect.any(Function)));
    });

    describe('add action', () => {
      it('adds car to group if not already in list', async () => {
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
          leaveGroup: jest.fn().mockResolvedValue(undefined),
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
        }
        const fakeUser = {
          id: fakeGroup.ownerId,
        };
        const modalContext = {
          close: jest.fn(),
          route: `/group/manage/${fakeGroup.id}/cars`,
          goTo: jest.fn(),
        };
        const snackbarContext = {
          show: jest.fn(),
        };

        let updateListener;
  
        const socket = {
          off: jest.fn(),
          on: jest.fn().mockImplementation((type: string, fn: Function) => {
            if (type === 'update') {
              updateListener = fn;
            }
          }),
          disconnect: jest.fn(),
        };
  
        (io as unknown as jest.Mock).mockReturnValue(socket);
      
        render (
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
    
        await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
        expect(io).toHaveBeenCalledWith('/group/2', {path: '/socket'});
  
        await waitFor(() => expect(socket.on).toHaveBeenCalledWith('update', expect.any(Function)));

        const car = {
          name: 'Test Car 1',
          groupId: 2,
          carId: 1,
          driverId: null,
          latitude: null,
          longitude: null,
          Driver: null,
        };

        const data = {
          action: 'add',
          car,
        };

        updateListener(data);

        await waitFor(() => expect(screen.queryByText('Test Car 1')).toBeTruthy());
      });
    });

    describe('drive action', () => {
      it('updates car to drive state if car is in group', async () => {
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
          leaveGroup: jest.fn().mockResolvedValue(undefined),
        };
        const car = {
          name: 'TEST CAR 1',
          groupId: 2,
          carId: 1,
          driverId: null,
          Driver: null,
          latitude: 50,
          longitude: 8,
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: [car]}}),
        }
        const fakeUser = {
          id: fakeGroup.ownerId,
        };
        const modalContext = {
          close: jest.fn(),
          route: `/group/manage/${fakeGroup.id}/cars`,
          goTo: jest.fn(),
        };
        const snackbarContext = {
          show: jest.fn(),
        };

        let updateListener;
  
        const socket = {
          off: jest.fn(),
          on: jest.fn().mockImplementation((type: string, fn: Function) => {
            if (type === 'update') {
              updateListener = fn;
            }
          }),
          disconnect: jest.fn(),
        };
  
        (io as unknown as jest.Mock).mockReturnValue(socket);
      
        render (
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
    
        await waitFor(() => expect(screen.queryByText(car.name)).toBeTruthy());
        expect(screen.queryByText('misc.available')).toBeTruthy();

        await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
        expect(io).toHaveBeenCalledWith('/group/2', {path: '/socket'});
  
        await waitFor(() => expect(socket.on).toHaveBeenCalledWith('update', expect.any(Function)));

        const updatedCar = {
          name: 'TEST CAR 1 UPDATED',
          groupId: 2,
          carId: 1,
          driverId: 5,
          latitude: null,
          longitude: null,
          Driver: {
            id: 5,
            username: 'DRIVER',
          },
        };

        const data = {
          action: 'drive',
          car: updatedCar,
        };

        updateListener(data);

        await waitFor(() => expect(screen.queryByText(updatedCar.name)).toBeTruthy());
        expect(screen.queryByText('modals.group.manage.tabs.cars.drivenBy')).toBeTruthy();
      });
    });

    describe('park action', () => {
      it('updates car to park state if car is in group', async () => {
        const fakeGroupContext = {
          getGroup: jest.fn().mockResolvedValue({data: fakeGroup}),
          leaveGroup: jest.fn().mockResolvedValue(undefined),
        };
        const car = {
          name: 'TEST CAR 1',
          groupId: 2,
          carId: 1,
          driverId: 5,
          Driver: {
            id: 5,
            username: 'DRIVER',
          },
          latitude: null,
          longitude: null,
        };
        const fakeApi = {
          getInvitesOfGroup: jest.fn().mockResolvedValue({data: {invites: fakeGroup.invites}}),
          getMembers: jest.fn().mockResolvedValue({data: {members: fakeGroup.members}}),
          getCars: jest.fn().mockResolvedValue({data: {cars: [car]}}),
        }
        const fakeUser = {
          id: fakeGroup.ownerId,
        };
        const modalContext = {
          close: jest.fn(),
          route: `/group/manage/${fakeGroup.id}/cars`,
          goTo: jest.fn(),
        };
        const snackbarContext = {
          show: jest.fn(),
        };

        let updateListener;
  
        const socket = {
          off: jest.fn(),
          on: jest.fn().mockImplementation((type: string, fn: Function) => {
            if (type === 'update') {
              updateListener = fn;
            }
          }),
          disconnect: jest.fn(),
        };
  
        (io as unknown as jest.Mock).mockReturnValue(socket);
      
        render (
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
    
        await waitFor(() => expect(screen.queryByText(car.name)).toBeTruthy());
        expect(screen.queryByText('modals.group.manage.tabs.cars.drivenBy')).toBeTruthy();

        await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
        expect(io).toHaveBeenCalledWith('/group/2', {path: '/socket'});
  
        await waitFor(() => expect(socket.on).toHaveBeenCalledWith('update', expect.any(Function)));

        const updatedCar = {
          name: 'TEST CAR 1 UPDATED',
          groupId: 2,
          carId: 1,
          driverId: null,
          latitude: 83,
          longitude: 5,
          Driver: null
        };

        const data = {
          action: 'park',
          car: updatedCar,
        };

        updateListener(data);

        await waitFor(() => expect(screen.queryByText(updatedCar.name)).toBeTruthy());
        expect(screen.queryByText('misc.available')).toBeTruthy();
      })
    });
  });
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: 13,
      };
      const fakeModal = {
        route: '',
      };
    
      const screen = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ModalContext.Provider value={fakeModal as ModalContext}>
              <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                <ApiContext.Provider value={fakeApi as unknown as Api}>
                  <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                      <ManageGroup groupId={2}/>
                  </GroupContext.Provider>
                </ApiContext.Provider>
              </AuthContext.Provider>
            </ModalContext.Provider>
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: 13,
      };
      const fakeModal = {
        route: '',
      };
    
      const screen = render (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ModalContext.Provider value={fakeModal as ModalContext}>
              <AuthContext.Provider value={{user: fakeUser} as AuthContext}>
                <ApiContext.Provider value={fakeApi as unknown as Api}>
                  <GroupContext.Provider value={fakeGroupContext as unknown as GroupContext}>
                      <ManageGroup groupId={2}/>
                  </GroupContext.Provider>
                </ApiContext.Provider>
              </AuthContext.Provider>
            </ModalContext.Provider>
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: 13,
      };
      const modalContext = {
        close: jest.fn(),
        route: '',
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
        route: '',
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
        route: '',
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
        route: '',
      };
      const snackbarContext = {
        show: jest.fn(),
      };
    
      render (
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
        getCars: jest.fn().mockResolvedValue({data: {cars: []}}),
      }
      const fakeUser = {
        id: fakeGroup.ownerId,
      };
      const modalContext = {
        close: jest.fn(),
        route: '',
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
});