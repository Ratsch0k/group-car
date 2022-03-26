import mockedAxios from '../../../__test__/mockAxios';
import '../../../__test__/mockI18n';
import { fireEvent, waitFor, screen } from "@testing-library/react";
import ManageGroup from "./ManageGroup";
import React from "react";
import {
  SnackbarContext,
  CarColor,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  User,
  Member,
  InviteWithUserAndInviteSender,
  CarWithDriver,
} from '../../../lib';
import { MemoryRouter, Route, Switch } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import testRender from "../../../__test__/testRender";
import {RootState} from '../../../lib/redux/store';
import history from "../../../lib/redux/history";
import { CALL_HISTORY_METHOD } from "connected-react-router";

let fakeGroup: GroupWithOwnerAndMembersAndInvitesAndCars;
let fakeUser: User;
let state: Partial<RootState>;
let members: Member[];
let invites: InviteWithUserAndInviteSender[];
let cars: CarWithDriver[];

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
    cars: [],
  };
  fakeUser = {
    username: 'TEST',
    id: 2,
    isBetaUser: true,
    email: 'test@mail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  };
  state = {
    group: {
      selectedGroup: fakeGroup,
      ids: [fakeGroup.id],
      entities: {
        [fakeGroup.id]: fakeGroup,
      },
      loading: false,
    },
    auth: {
      user: fakeUser,
      loading: false,
      signUpRequestSent: false,
    },
  };

  members = [
    {
      isAdmin: true,
      User: {
        username: 'ADMIN',
        id: 3,
      },
    },
    {
      isAdmin: false,
      User: {
        username: 'MEMBER',
        id: 4,
      },
    },
  ];
  invites = [
    {
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
    },
    {
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
    }
  ];
  cars = [
    {
      name: 'car-1',
      groupId: fakeGroup.id,
      color: CarColor.Red,
      driverId: null,
      carId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: 40.0,
      longitude: 61.0,
      Driver: null,
    },
    {
      name: 'car-2',
      groupId: fakeGroup.id,
      color: CarColor.Black,
      driverId: null,
      carId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: 30.0,
      longitude: 20.0,
      Driver: null,
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
      carId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: null,
      longitude: null,
    }
  ];
});

afterEach(() => {
  jest.clearAllMocks();
  history.location = {
    pathname: '/',
    state: undefined,
    hash: '',
    search: '',
  };
});

it('renders without crashing', () => {
  testRender(
    state,
    <MemoryRouter>
      <ManageGroup groupId={2} />
    </MemoryRouter>
  );
});

it('renders circular progress while loading group data',() => {
  state.group.loading = true;
  state.group.selectedGroup = null;

  const screen = testRender(
    state,
    <ManageGroup groupId={1}/>
  );

  expect(screen.baseElement).toMatchSnapshot();
});

it('renders error message if group doesn\'t exist', async () => {
  state.group.selectedGroup = null;

  const screen = testRender (
    state,
    <ManageGroup groupId={1}/>
  );

  await waitFor(() => expect(screen.queryByText('modals.group.manage.loadingFailed')).not.toBeNull());

  expect(screen.baseElement).toMatchSnapshot();  
});

it('renders group info if group exists', async () => {
  const screen = testRender (
    state,
    <ManageGroup groupId={2}/>,
  );

  expect(screen.baseElement).toMatchSnapshot();
});


describe('update group', () => {
  beforeEach(() => {
    // Mock axios calls
    mockedAxios.get = jest.fn().mockImplementation((path: string) => {
      const response = {
        data: undefined,
      };

      if (path.endsWith('invites')) {
        response.data = {invites}
      } else if (path.endsWith('members')) {
        response.data = {members};
      } else if (path.endsWith('cars')) {
        response.data = {cars};
      } else {
        response.data = fakeGroup;
      }
      return Promise.resolve(response);
    });
  });

  describe('get groupId from props', () => {
  it('dispatch updateSelectedGroup if same as selected', async () => {
      const {store} = testRender (
        state,
        <ManageGroup groupId={2}/>,
      );


      const expectedPendingAction = {
        type: 'group/updateSelectedGroup/pending',
        payload: undefined,
        meta: {
          arg: 2,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/updateSelectedGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: 2,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      const actions = store.getActions();
      expect(actions).toContainEqual(expectedPendingAction);
      expect(actions).toHaveLength(4);
    });

    it('dispatch selectAndUpdateGroup with groupId ' +
    'and force if not same as selected', async () => {
      const {store} = testRender (
        state,
        <ManageGroup groupId={1}/>,
      );


      const expectedPendingAction = {
        type: 'group/selectAndUpdateGroup/pending',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/selectAndUpdateGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      const actions = store.getActions();
      expect(actions).toContainEqual(expectedPendingAction);
      expect(store.getActions()).toHaveLength(4);
    });

    it('groupId from props takes precedence', async () => {
      state.router = {
        location: {
          pathname: '?modal=/group/manage/3',
          query: {},
          hash: '',
          state: undefined,
          search: '',
        },
        action: 'POP',
      };

      const {store} = testRender (
        state,
        <ManageGroup groupId={1}/>,
      );


      const expectedPendingAction = {
        type: 'group/selectAndUpdateGroup/pending',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/selectAndUpdateGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      const actions = store.getActions();
      expect(actions).toContainEqual(expectedPendingAction);
      expect(actions).toHaveLength(4);
    });
  });

  describe('get groupId from path params', () => {
    it('dispatch updateSelectedGroup if same as selected', async () => {
      history.location.pathname = '/group/manage/2';

      const {store} = testRender(
        state,
        <Switch>
          <Route path='/group/manage/:groupId'>
            <ManageGroup />
          </Route>
        </Switch>,
      );


      const expectedPendingAction = {
        type: 'group/updateSelectedGroup/pending',
        payload: undefined,
        meta: {
          arg: 2,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/updateSelectedGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: 2,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      const actions = store.getActions();
      expect(actions).toContainEqual(expectedPendingAction)
      expect(store.getActions()).toHaveLength(4);
    });

    it('dispatch selectAndUpdateGroup with groupId ' +
    'and force if not same as selected', async () => {
      history.location.pathname = '/group/manage/1';

      const {store} = testRender (
        state,
        <Switch>
          <Route path='/group/manage/:groupId'>
            <ManageGroup />
          </Route>
        </Switch>,
      );


      const expectedPendingAction = {
        type: 'group/selectAndUpdateGroup/pending',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/selectAndUpdateGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: {
            id: 1,
            force: true,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      const actions = store.getActions();
      expect(actions).toContainEqual(expectedPendingAction);
      expect(store.getActions()).toHaveLength(4);
    });
  });
});

describe('MemberTab', () => {
  it('renders list of members correctly', async () => {
    (state.group.selectedGroup.members as any[]).push(...members);

    const screen = testRender (
      state,
      <ManageGroup groupId={2}/>
    );
  
    expect(screen.baseElement).toMatchSnapshot();
  });
  
  it('renders list of invites correctly', async () => {
    // Add more members to fake group data
    state.group.selectedGroup.invites.push(...invites);
    
    const screen = testRender (
      state,
      <ManageGroup groupId={2}/>
    );
    

    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(2);
    fakeGroup.invites.forEach((invite) => {
      expect(screen.queryAllByText(invite.User.username)).not.toBeUndefined;
    });
    
    expect(screen.baseElement).toMatchSnapshot();
  });

  describe('options button', () => {
    describe('will', () => {
      it('never appear if current user is not an admin', async () => {
        const owner = {username: 'OWNER', id: 10};
        const member = {username: 'MEMBER', id: 11};
        state.group.selectedGroup.Owner = owner;
        state.group.selectedGroup.ownerId = owner.id;
        state.group.selectedGroup.members[0].isAdmin = false;
        state.group.selectedGroup.members.push({isAdmin: true, User: owner});
        state.group.selectedGroup.members.push({isAdmin: false, User: member});

        const screen = testRender (
          state,
          <ManageGroup groupId={2}/>
        );
      
        expect(screen.baseElement).toMatchSnapshot();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`)).toBeFalsy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeFalsy();
      });

      it('not appear if current user and member is admin', async () => {
        const owner = {username: 'OWNER', id: 10};
        const member = {username: 'MEMBER', id: 11};
        state.group.selectedGroup.Owner = owner;
        state.group.selectedGroup.ownerId = owner.id;
        state.group.selectedGroup.members.push({isAdmin: true, User: owner});
        state.group.selectedGroup.members.push({isAdmin: true, User: member});

        const screen = testRender (
          state,
          <ManageGroup groupId={2}/>
        );
      
        expect(screen.baseElement).toMatchSnapshot();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`)).toBeFalsy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-12-options-button`)).toBeFalsy();
      });

      it('appear if current user is admin and member is not an admin', async () => {
        const owner = {username: 'OWNER', id: 10};
        const member = {username: 'MEMBER', id: 11};
        state.group.selectedGroup.Owner = owner;
        state.group.selectedGroup.ownerId = owner.id;
        state.group.selectedGroup.members.push({isAdmin: true, User: owner});
        state.group.selectedGroup.members.push({isAdmin: false, User: member});

        const screen = testRender (
          state,
          <ManageGroup groupId={2}/>
        );
      
        expect(screen.baseElement).toMatchSnapshot();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`)).toBeTruthy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${owner.id}-options-button`)).toBeFalsy();
      });

      it('appear if current user is the owner and member is admin or not an admin', async () => {
        const admin = {username: 'ADMIN', id: 10};
        const member = {username: 'MEMBER', id: 11};
        state.group.selectedGroup.members.push({isAdmin: true, User: admin});
        state.group.selectedGroup.members.push({isAdmin: false, User: member});

        const screen = testRender (
          state,
          <ManageGroup groupId={2}/>
        );
      
        expect(screen.baseElement).toMatchSnapshot();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${admin.id}-options-button`)).toBeTruthy();
        expect(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`)).toBeTruthy();
      });
    });
    it('click on grant admin dispatches grantAdminRights action', async () => {
      const member = {username: 'MEMBER', id: 10};
      state.group.selectedGroup.members.push({isAdmin: false, User: member});
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    
      expect(screen.baseElement).toMatchSnapshot();
      fireEvent.click(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`));
      expect(screen.baseElement).toMatchSnapshot();
      fireEvent.click(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin'));

      const expectedAction = {
        type: 'group/grantAdminRights/pending',
        meta: {
          arg: {
            groupId: fakeGroup.id,
            userId: member.id,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
        payload: undefined,
      };
      
      await waitFor(() => expect(screen.store.getActions()).toContainEqual(expectedAction));
    });

    it('if member is not an admin grant admin option is shown', async () => {
      const member = {username: 'MEMBER', id: 10};
      state.group.selectedGroup.members.push({isAdmin: false, User: member});
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    
      fireEvent.click(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`))

      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin')).toBeTruthy();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin')).toBeFalsy();
    });

    it('if member is admin the revoke admin option is shown', async () => {
      const member = {username: 'MEMBER', id: 10};
      state.group.selectedGroup.members.push({isAdmin: true, User: member});
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    

      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.grantAdmin')).toBeFalsy();
      expect(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin')).toBeTruthy();
    });

    it('click on revoke admin will dispatch revokeAdminRights actions', async () => {
      const member = {username: 'MEMBER', id: 10};
      state.group.selectedGroup.members.push({isAdmin: true, User: member});
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    
      expect(screen.baseElement).toMatchSnapshot();
      fireEvent.click(screen.baseElement.querySelector(`#member-${fakeGroup.id}-${member.id}-options-button`));
      expect(screen.baseElement).toMatchSnapshot();
      fireEvent.click(screen.queryByText('modals.group.manage.tabs.members.options.revokeAdmin'));

      const expectedAction = {
        type: 'group/revokeAdminRights/pending',
        meta: {
          arg: {
            groupId: fakeGroup.id,
            userId: member.id,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
        payload: undefined,
      };
      
      await waitFor(() => expect(screen.store.getActions()).toContainEqual(expectedAction));
    });
  });
});

describe('CarTab', () => {
  it('cars tab is rendered correctly', async () => {
    state.group.selectedGroup.cars.push(...cars);

    const snackbarContext = {
      show: jest.fn(),
    };
  
    const {baseElement, store} = testRender (
      state,
      <SnackbarContext.Provider value={snackbarContext}>
        <ManageGroup groupId={2}/>
      </SnackbarContext.Provider>
    );
    expect(baseElement.querySelector('#create-car-fab')).toBeFalsy();

    expect(baseElement.querySelector('#group-tab-cars')).toBeTruthy();
    console.dir(baseElement.querySelector('#group-tab-cars'));
    fireEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());

    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          search: `modal=/group/manage/${fakeGroup.id}/cars`,
          state: {modal: `/group/manage/${fakeGroup.id}/cars`},
        }],
        method: 'push',
      }
    };
    expect(store.getActions()).toContainEqual(expectedAction);

    expect(baseElement).toMatchSnapshot();
  });

  it('clicking add fab opens create car dialog', async () => {
    const snackbarContext = {
      show: jest.fn(),
    };
  
    const {baseElement} = testRender (
      state,
      <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
        <ManageGroup groupId={2}/>
      </SnackbarContext.Provider>
    );

    fireEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    fireEvent.click(baseElement.querySelector('#create-car-fab'));

    expect(baseElement).toMatchSnapshot();
  });

  it('entering a name and clicking create dispatches createCar action', async () => {
    const snackbarContext = {
      show: jest.fn(),
    };

    
    const fakeCar = {
      name: 'NEW CAR',
      groupId: fakeGroup.id,
      color: CarColor.Red,
    }
    const fakeCarResponse: CarWithDriver = {
      ...fakeCar,
      carId: 41,
      latitude: null,
      longitude: null,
      driverId: null,
      Driver: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockedAxios.post = jest.fn().mockResolvedValueOnce({data: fakeCarResponse});
  
    const {baseElement, store, queryByText} = testRender(
      state,
      <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
          <ManageGroup groupId={2}/>
      </SnackbarContext.Provider>
    );


    userEvent.click(baseElement.querySelector('#group-tab-cars'));

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    userEvent.click(baseElement.querySelector('#create-car-fab'));

    userEvent.type(baseElement.querySelector('#create-car-name'), fakeCar.name);

    userEvent.click(screen.getByText('misc.create'));

    const expectedPendingAction = {
      type: 'group/createCar/pending',
      payload: undefined,
      meta: {
        requestId: expect.any(String),
        requestStatus: expect.any(String),
        arg: fakeCar,
      },
    };
    const expectedFulfilledAction = {
      type: 'group/createCar/fulfilled',
      payload: fakeCarResponse,
      meta: {
        requestId: expect.any(String),
        requestStatus: expect.any(String),
        arg: fakeCar,
      },
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
    expect(store.getActions()).toContainEqual(expectedPendingAction);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/group/2/car`, {name: fakeCar.name, color: fakeCar.color});

    await waitFor(() => expect(queryByText('misc.create')).toBeFalsy());
    expect(baseElement).toMatchSnapshot();
  });

  it('color selection only shows not used color', async () => {
      state.group.selectedGroup.cars.push(...cars);
      const snackbarContext = {
        show: jest.fn(),
      };
    
      const {baseElement} = testRender (
        state,
        <SnackbarContext.Provider value={snackbarContext}>
          <ManageGroup groupId={2}/>
        </SnackbarContext.Provider>,
      );

      userEvent.click(baseElement.querySelector('#group-tab-cars'));

      await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
      userEvent.click(baseElement.querySelector('#create-car-fab'));

      userEvent.click(baseElement.querySelector('#create-car-color'));

      cars.forEach((car) => {
        expect(screen.queryByText(`misc.${car.color.toString}`)).toBeNull();
      });

      expect(baseElement).toMatchSnapshot();
  });

  it('is automatically selected if modal route ' +
  'is /group/manage/:groupId/cars', async () => {
    state.router = {
      location: {
        search: `modal=/group/manage/${fakeGroup.id}/cars`,
        pathname: '/',
        query:  {},
        state: '',
        hash: '',
      },
      action: 'PUSH',
    };
    const snackbarContext = {
      show: jest.fn(),
    };
  
    const {baseElement} = testRender (
      state,
      <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
        <ManageGroup groupId={2}/>
      </SnackbarContext.Provider>
    );

    await waitFor(() => expect(baseElement.querySelector('#create-car-fab')).toBeTruthy());
    expect(baseElement).toMatchSnapshot();
  });
});


describe('Footer', () => {
  describe('Leave button', () => {
    it('leave group button is visible if user is not owner of group', async () => {
      const owner = {id: 12, username: 'ADMIN'};
      state.group.selectedGroup.members.push({User: owner, isAdmin: true});
      state.group.selectedGroup.Owner = owner;
      state.group.selectedGroup.ownerId = owner.id;

      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    
      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.leaveGroup.button')).toBeDefined();
      expect(screen.queryByText('modals.group.manage.deleteGroup.button')).toBeNull();
    });
    
    it('clicking leave group opens dialog', async () => {
      const owner = {id: 12, username: 'ADMIN'};
      state.group.selectedGroup.members.push({User: owner, isAdmin: true});
      state.group.selectedGroup.Owner = owner;
      state.group.selectedGroup.ownerId = owner.id;

    
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );

      fireEvent.click(screen.queryByText('modals.group.manage.leaveGroup.button'));
      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.leaveGroup.dialog.title')).toBeDefined();
    });
    
    it('click yes on leave group dialog dispatches leaveGroup action', async () => {
      const owner = {id: 12, username: 'ADMIN'};
      state.group.selectedGroup.members.push({User: owner, isAdmin: true});
      state.group.selectedGroup.Owner = owner;
      state.group.selectedGroup.ownerId = owner.id;
    
      const snackbarContext = {
        show: jest.fn(),
      };

      mockedAxios.post = jest.fn().mockResolvedValueOnce({data: undefined});

      const screen = testRender (
        state,
        <SnackbarContext.Provider value={snackbarContext}>
          <ManageGroup groupId={2}/>
        </SnackbarContext.Provider>
      );
    
      fireEvent.click(screen.queryByText('modals.group.manage.leaveGroup.button'));
      fireEvent.click(screen.queryByText('misc.yes'));

      const expectedPendingAction = {
        type: 'group/leaveGroup/pending',
        payload: undefined,
        meta: {
          arg: {
            id: fakeGroup.id,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/leaveGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: {
            id: fakeGroup.id,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const store = screen.store;
      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      expect(store.getActions()).toContainEqual(expectedPendingAction);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(`/api/group/${fakeGroup.id}/leave`);
      await waitFor(() => expect(snackbarContext.show).toHaveBeenCalledTimes(1));
      expect(snackbarContext.show).toHaveBeenCalledWith('success', 'modals.group.manage.leaveGroup.success');
    });
  });

  describe('Delete button', () => {
    it('delete group button is visible if user is owner of group', async () => {
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
    
      expect(screen.baseElement).toMatchSnapshot();
      expect(screen.queryByText('modals.group.manage.leaveGroup.button')).toBeNull();
      expect(screen.queryByText('modals.group.manage.deleteGroup.button')).toBeDefined();
    });  

    it('clicking on delete group button opens delete dialog', async () => {
      const screen = testRender (
        state,
        <ManageGroup groupId={2}/>
      );
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));
      expect(screen.baseElement).toMatchSnapshot();
    });

    it('clicking on yes on delete group dialog deletes group', async () => {
      const snackbarContext = {
        show: jest.fn(),
      };

      mockedAxios.delete = jest.fn().mockResolvedValueOnce({data: undefined});
    
      const {store} = testRender (
        state,
        <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
          <ManageGroup groupId={2}/>
        </SnackbarContext.Provider>
      );
    
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));

      fireEvent.click(screen.queryByText('misc.yes'));

      const expectedPendingAction = {
        type: 'group/deleteGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: fakeGroup.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/deleteGroup/fulfilled',
        payload: undefined,
        meta: {
          arg: {id: fakeGroup.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      expect(store.getActions()).toContainEqual(expectedPendingAction)
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/group/${fakeGroup.id}`);
      expect(snackbarContext.show).toBeCalledWith({
        content: 'modals.group.manage.deleteGroup.success',
        type: 'success',
      });
      expect(snackbarContext.show).toBeCalledTimes(1);
    });

    it('clicking no on delete group dialog closes delete group dialog', async () => {
      const snackbarContext = {
        show: jest.fn(),
      };

      mockedAxios.delete = jest.fn().mockResolvedValueOnce({data: undefined});
    
      const {store, baseElement} = testRender (
        state,
        <SnackbarContext.Provider value={snackbarContext as unknown as SnackbarContext}>
          <ManageGroup groupId={2}/>
        </SnackbarContext.Provider>
      );
    
      fireEvent.click(screen.queryByText('modals.group.manage.deleteGroup.button'));

      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.queryByText('misc.no'));

      expect(baseElement).toMatchSnapshot();

      const notExpectedPendingAction = {
        type: 'group/deleteGroup/pending',
        payload: expect.anything(),
        meta: expect.anything(),
      };
      const notExpectedFulfilledAction = {
        type: 'group/deleteGroup/pending',
        payload: expect.anything(),
        meta: expect.anything(),
      };

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions).not.toContainEqual(notExpectedPendingAction);
      expect(actions).not.toContainEqual(notExpectedFulfilledAction);
    });
  });
});