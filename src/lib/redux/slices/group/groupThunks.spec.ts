import mockedAxios from '../../../../__test__/mockAxios';
import mockAxios from '../../../../__test__/mockAxios';
import mockStore from '../../../../__test__/mockStore';
import {
  CarColor,
  CarWithDriver,
  Group,
  GroupWithOwner,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  Invite,
  InviteWithUserAndInviteSender,
  Member,
} from '../../../api';
import {
  selectAndUpdateGroup,
  updateSelectedGroup,
  createGroup,
  update,
  getGroup,
  inviteUser,
  leaveGroup,
  deleteGroup,
  driveCar,
  parkCar,
  createCar,
  grantAdminRights,
  revokeAdminRights,
} from './groupThunks';
import {
  NoGroupSelectedError,
  NotAdminOfGroupError,
  NotLoggedInError,
  NotOwnerOfGroupError,
} from '../../../errors';

describe('groupThunks', () => {
  let cars: CarWithDriver[];
  let members: Member[];
  let invites: InviteWithUserAndInviteSender[];
  let group: GroupWithOwner;
  let fullGroup: GroupWithOwnerAndMembersAndInvitesAndCars;
  let groups: GroupWithOwner[];

  beforeEach(() => {
    jest.clearAllMocks();

    cars = [
      {
        groupId: 1,
        carId: 1,
        name: 'CAR',
        color: CarColor.Red,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverId: null,
        Driver: null,
        latitude: 1.0,
        longitude: 2.0,
      },
    ];

    members = [
      {
        isAdmin: true,
        User: {
          id: 1,
          username: 'OWNER',
        },
      },
      {
        isAdmin: false,
        User: {
          id: 2,
          username: 'MEMBER',
        },
      },
    ];

    invites = [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: 1,
        userId: 3,
        User: {
          id: 3,
          username: 'INVITED',
        },
        invitedBy: 1,
        InviteSender: {
          id: 1,
          username: 'OWNER',
        },
      },
    ];

    group = {
      id: 1,
      name: 'GROUP',
      description: 'DESC',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 1,
      Owner: {
        id: 1,
        username: 'OWNER',
      },
    };

    fullGroup = {
      ...group,
      members,
      cars,
      invites,
    };

    groups = [
      {
        ...group,
      },
      {
        id: 2,
        name: 'OTHER',
        description: 'OTHER',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
        Owner: {
          id: 1,
          username: 'OWNER',
        },
      },
    ];
  });

  describe('selectAndUpdateGroup', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn().mockImplementation((path: string) => {
        if (path.endsWith('car')) {
          return Promise.resolve({data: {cars}});
        } else if (path.endsWith('member')) {
          return Promise.resolve({data: {members}});
        } else if (path.endsWith('invites')) {
          return Promise.resolve({data: {invites}});
        } else {
          return Promise.resolve({data: group});
        }
      });
    });

    describe('if no group selected', () => {
      describe('if group with id in groups', () => {
        it('get group data and dispatch selectGroup ' +
        'with response', async () => {
          const store = mockStore({group: {
            selectedGroup: null,
            ids: groups.map((g) => g.id),
            entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
            loading: false,
          }});

          await store.dispatch(selectAndUpdateGroup({id: group.id}));

          const pending = {
            type: 'group/selectAndUpdateGroup/pending',
            payload: undefined,
            meta: {
              arg: {id: group.id},
              requestId: expect.any(String),
              requestStatus: expect.any(String),
            },
          };
          const fulfilled = {
            ...pending,
            type: 'group/selectAndUpdateGroup/fulfilled',
          };

          const selectGroupAction = {
            type: 'group/selectGroup',
            payload: {group: fullGroup},
          };

          const actions = store.getActions();

          expect(mockAxios.get).toHaveBeenCalledTimes(4);
          expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/car`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/member`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/invites`);
          expect(actions).toContainEqual(pending);
          expect(actions).toContainEqual(fulfilled);
          expect(actions).toContainEqual(selectGroupAction);
        });
      });

      describe('if force is true', () => {
        it('get group data and dispatch ' +
        'selectGroup with response', async () => {
          const store = mockStore({group: {
            selectedGroup: null,
            ids: [],
            entities: {},
            loading: false,
          }});

          await store.dispatch(
            selectAndUpdateGroup({id: group.id, force: true}));

          const pending = {
            type: 'group/selectAndUpdateGroup/pending',
            payload: undefined,
            meta: {
              arg: {id: group.id, force: true},
              requestId: expect.any(String),
              requestStatus: expect.any(String),
            },
          };
          const fulfilled = {
            ...pending,
            type: 'group/selectAndUpdateGroup/fulfilled',
          };

          const selectGroupAction = {
            type: 'group/selectGroup',
            payload: {group: fullGroup, force: true},
          };

          const actions = store.getActions();

          expect(mockAxios.get).toHaveBeenCalledTimes(4);
          expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/car`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/member`);
          expect(mockAxios.get)
            .toHaveBeenCalledWith(`/api/group/${group.id}/invites`);
          expect(actions).toContainEqual(pending);
          expect(actions).toContainEqual(fulfilled);
          expect(actions).toContainEqual(selectGroupAction);
        });
      });
    });

    describe('if group with same id selected', () => {
      it('do not select and update', async () => {
        const store = mockStore({group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        }});

        await store.dispatch(
          selectAndUpdateGroup({id: group.id}));

        const pending = {
          type: 'group/selectAndUpdateGroup/pending',
          payload: undefined,
          meta: {
            arg: {id: group.id},
            requestId: expect.any(String),
            requestStatus: expect.any(String),
          },
        };
        const fulfilled = {
          ...pending,
          type: 'group/selectAndUpdateGroup/fulfilled',
        };

        const selectGroupAction = {
          type: 'group/selectGroup',
          payload: {group: fullGroup},
        };

        const actions = store.getActions();

        expect(mockAxios.get).toHaveBeenCalledTimes(0);
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(fulfilled);
        expect(actions).not.toContainEqual(selectGroupAction);
      });
    });

    it('if api call reject, return rejectWithValue ' +
    'with error data from response', async () => {
      const store = mockStore({group: {
        selectedGroup: null,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      const error = 'ERROR';
      mockedAxios.get = jest.fn().mockRejectedValue({data: error});

      await store.dispatch(selectAndUpdateGroup({id: group.id}));

      const pending = {
        type: 'group/selectAndUpdateGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        type: 'group/selectAndUpdateGroup/rejected',
        error: expect.anything(),
        meta: expect.anything(),
      };

      const selectGroupAction = {
        type: 'group/selectGroup',
        payload: {group: fullGroup},
      };

      const actions = store.getActions();

      expect(mockAxios.get).toHaveBeenCalledTimes(4);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/car`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/member`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/invites`);
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(selectGroupAction);
    });
  });

  describe('updateSelectedGroup', () => {
    it('get group data and dispatch setSelectedGroup ' +
    'with response data', async () => {
      const store = mockStore({group: {
        selectedGroup: fullGroup,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      const modifiedGroup: GroupWithOwner = {
        ...group,
        name: 'UPDATE',
        description: 'UPDATE',
      };
      const modifiedCars = [
        ...cars,
        {
          groupId: fullGroup.id,
          carId: 5,
          color: CarColor.Blue,
          driverId: null,
          Driver: null,
          latitude: 5.0,
          longitude: 6.0,
          name: 'NEW CAR',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const modifiedMembers = [
        ...members,
        {
          isAdmin: true,
          User: {
            id: 10,
            username: 'ADMIN',
          },
        },
      ];
      const modifiedInvites = [
        ...invites,
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          invitedBy: 1,
          InviteSender: {
            id: 1,
            username: 'OWNER',
          },
          groupId: fullGroup.id,
          userId: 9,
          User: {
            id: 9,
            username: 'INVITED',
          },
        },
      ];

      mockAxios.get = jest.fn().mockImplementation((path: string) => {
        if (path.endsWith('car')) {
          return Promise.resolve({data: {cars: modifiedCars}});
        } else if (path.endsWith('member')) {
          return Promise.resolve({data: {members: modifiedMembers}});
        } else if (path.endsWith('invites')) {
          return Promise.resolve({data: {invites: modifiedInvites}});
        } else {
          return Promise.resolve({data: modifiedGroup});
        }
      });

      await store.dispatch(updateSelectedGroup(group.id));

      const pending = {
        type: 'group/updateSelectedGroup/pending',
        payload: undefined,
        meta: {
          arg: group.id,
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        type: 'group/updateSelectedGroup/fulfilled',
      };

      const setSelectedGroupAction = {
        type: 'group/setSelectedGroup',
        payload: modifiedGroup,
      };

      const actions = store.getActions();

      expect(mockAxios.get).toHaveBeenCalledTimes(4);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/car`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/member`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/invites`);
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).not.toContainEqual(setSelectedGroupAction);
    });

    it('if response rejected, returns ' +
    'rejectWithValue with error response data', async () => {
      const store = mockStore({group: {
        selectedGroup: fullGroup,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      const error = 'ERROR';
      mockAxios.get = jest.fn().mockRejectedValue({data: error});

      await store.dispatch(updateSelectedGroup(group.id));

      const pending = {
        type: 'group/updateSelectedGroup/pending',
        payload: undefined,
        meta: {
          arg: group.id,
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        type: 'group/updateSelectedGroup/rejected',
        error: expect.anything(),
        meta: expect.anything(),
      };

      const setSelectedGroupAction = {
        type: 'group/setSelectedGroup',
        payload: fullGroup,
      };

      const actions = store.getActions();

      expect(mockAxios.get).toHaveBeenCalledTimes(4);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/car`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/member`);
      expect(mockAxios.get)
        .toHaveBeenCalledWith(`/api/group/${group.id}/invites`);
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setSelectedGroupAction);
    });
  });

  describe('createGroup', () => {
    it('call createGroup api, get group data, ' +
    'dispatch add group and setSelectedGroup', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const group: Group = {
        id: 21,
        name: 'CREATED',
        description: 'CREATED',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
      };
      const Owner = {
        id: 1,
        username: 'OWNER',
      };
      mockAxios.post = jest.fn().mockResolvedValueOnce({data: group});
      mockAxios.get = jest.fn()
        .mockResolvedValueOnce({data: {...group, Owner}});

      const arg = {name: group.name, description: group.description};
      await store.dispatch(
        createGroup(arg));

      const pending = {
        type: 'group/createGroup/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        payload: group,
        type: 'group/createGroup/fulfilled',
      };
      const addCarAction = {
        type: 'group/addGroup',
        payload: {
          ...group,
          Owner,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(addCarAction);

      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/group', arg);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
    });

    it('if createGroup request rejected, ' +
    'returns rejectWithValue with error', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const group: Group = {
        id: 21,
        name: 'CREATED',
        description: 'CREATED',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
      };
      const Owner = {
        id: 1,
        username: 'OWNER',
      };
      const error = 'ERROR';
      mockAxios.post = jest.fn().mockRejectedValueOnce({data: error});
      mockAxios.get = jest.fn()
        .mockResolvedValueOnce({data: {...group, Owner}});

      const arg = {name: group.name, description: group.description};
      await store.dispatch(
        createGroup(arg));

      const pending = {
        type: 'group/createGroup/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        payload: undefined,
        error: expect.anything(),
        meta: expect.anything(),
        type: 'group/createGroup/rejected',
      };
      const addCarAction = {
        type: 'group/addGroup',
        payload: {
          ...group,
          Owner,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(addCarAction);

      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/group', arg);
      expect(mockAxios.get).not.toHaveBeenCalledTimes(1);
      expect(mockAxios.get).not.toHaveBeenCalledWith(`/api/group/${group.id}`);
    });
  });

  describe('update', () => {
    it('get groups and updates groups', async () => {
      const store = mockStore({group: {
        selectedGroup: fullGroup,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      mockAxios.get = jest.fn().mockResolvedValueOnce({data: {groups}});

      await store.dispatch(update());

      const pending = {
        type: 'group/update/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        type: 'group/update/fulfilled',
      };
      const updateGroupsAction = {
        type: 'group/updateGroups',
        payload: groups,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(updateGroupsAction);
    });

    it('if a group selected, dispatches updateSelectedGroup', async () => {
      const store = mockStore({group: {
        selectedGroup: fullGroup,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      mockAxios.get = jest.fn().mockResolvedValueOnce({data: {groups}});

      await store.dispatch(update());

      const pending = {
        type: 'group/update/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        type: 'group/update/fulfilled',
      };
      const updateGroupsAction = {
        type: 'group/updateGroups',
        payload: groups,
      };
      const updateSelectedGroupAction = {
        type: 'group/updateSelectedGroup/pending',
        payload: undefined,
        meta: {
          arg: fullGroup.id,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(updateGroupsAction);
      expect(actions).toContainEqual(updateSelectedGroupAction);
    });

    it('if request rejected, returns ' +
    'rejectWithValue with error', async () => {
      const store = mockStore({group: {
        selectedGroup: fullGroup,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        loading: false,
      }});

      const error = 'ERROR';
      mockAxios.get = jest.fn().mockRejectedValueOnce({data: error});

      const res = await store.dispatch(update());

      const pending = {
        type: 'group/update/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        type: 'group/update/rejected',
        meta: expect.anything(),
        error: expect.anything(),
      };
      const updateGroupsAction = {
        type: 'group/updateGroups',
        payload: groups,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(updateGroupsAction);
      expect(res).toEqual(rejected);
    });
  });

  describe('getGroup', () => {
    it('get group data and dispatch updateGroup', async () => {
      const store = mockStore();

      mockAxios.get = jest.fn().mockResolvedValue({data: group});

      await store.dispatch(getGroup({id: group.id}));

      const pending = {
        type: 'group/getGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        type: 'group/getGroup/fulfilled',
        payload: group,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const updateGroupAction = {
        type: 'group/updateGroup',
        payload: group,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(updateGroupAction);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
    });

    it('if request rejected, returns rejectWithValue with error', async () => {
      const store = mockStore();

      const error = 'ERROR';
      mockAxios.get = jest.fn().mockRejectedValueOnce({data: error});

      const res = await store.dispatch(getGroup({id: group.id}));

      const pending = {
        type: 'group/getGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        type: 'group/getGroup/rejected',
        payload: undefined,
        error: expect.anything(),
        meta: expect.anything(),
      };
      const updateGroupAction = {
        type: 'group/updateGroup',
        payload: group,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(res).toEqual(rejected);
      expect(actions).not.toContainEqual(updateGroupAction);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(`/api/group/${group.id}`);
    });
  });

  describe('inviteUser', () => {
    describe('requests invite user', () => {
      it('if group selected for which invite is, ' +
      'dispatch addInvite', async () => {
        const store = mockStore({
          auth: {
            user: {
              id: 1,
              username: 'OWNER',
            },
            loading: false,
            signUpRequestSent: false,
          },
          group: {
            selectedGroup: fullGroup,
            ids: groups.map((g) => g.id),
            entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
            loading: false,
          },
        });

        const invite: Invite = {
          groupId: fullGroup.id,
          userId: 10,
          invitedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockAxios.post = jest.fn().mockResolvedValue({data: invite});

        const arg = {groupId: fullGroup.id, usernameOrId: 10};
        await store.dispatch(inviteUser(arg));

        const pending = {
          type: 'group/inviteUser/pending',
          payload: undefined,
          meta: {
            arg,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const expectedInvite = {
          ...invite,
          User: {
            username: 10,
          },
          InviteSender: {
            id: 1,
            username: 'OWNER',
          },
        };
        const fulfilled = {
          ...pending,
          type: 'group/inviteUser/fulfilled',
          payload: expectedInvite,
        };
        const addInviteAction = {
          type: 'group/addInvite',
          payload: expectedInvite,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(fulfilled);
        expect(actions).toContainEqual(addInviteAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post)
          .toHaveBeenCalledWith(
            `/api/group/${fullGroup.id}/invite`,
            {
              userId: arg.usernameOrId,
            },
          );
      });

      it('if the group is not selected, ' +
      'do not dispatch addInvite', async () => {
        const store = mockStore({
          auth: {
            user: {
              id: 1,
              username: 'OWNER',
            },
            loading: false,
            signUpRequestSent: false,
          },
          group: {
            selectedGroup: null,
            ids: groups.map((g) => g.id),
            entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
            loading: false,
          },
        });

        const invite: Invite = {
          groupId: fullGroup.id,
          userId: 10,
          invitedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockAxios.post = jest.fn().mockResolvedValue({data: invite});

        const arg = {groupId: fullGroup.id, usernameOrId: 10};
        await store.dispatch(inviteUser(arg));

        const pending = {
          type: 'group/inviteUser/pending',
          payload: undefined,
          meta: {
            arg,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const expectedInvite = {
          ...invite,
          User: {
            username: 10,
          },
          InviteSender: {
            id: 1,
            username: 'OWNER',
          },
        };
        const fulfilled = {
          ...pending,
          type: 'group/inviteUser/fulfilled',
          payload: expectedInvite,
        };
        const addInviteAction = {
          type: 'group/addInvite',
          payload: expectedInvite,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(fulfilled);
        expect(actions).not.toContainEqual(addInviteAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post)
          .toHaveBeenCalledWith(
            `/api/group/${fullGroup.id}/invite`,
            {
              userId: arg.usernameOrId,
            },
          );
      });

      it('if request rejected, returns ' +
      'rejectWithValue with error', async () => {
        const store = mockStore({
          auth: {
            user: {
              id: 1,
              username: 'OWNER',
            },
            loading: false,
            signUpRequestSent: false,
          },
          group: {
            selectedGroup: null,
            ids: groups.map((g) => g.id),
            entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
            loading: false,
          },
        });

        const invite: Invite = {
          groupId: fullGroup.id,
          userId: 10,
          invitedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const error = 'ERROR';
        mockAxios.post = jest.fn().mockRejectedValueOnce({data: error});

        const arg = {groupId: fullGroup.id, usernameOrId: 10};
        await store.dispatch(inviteUser(arg));

        const pending = {
          type: 'group/inviteUser/pending',
          payload: undefined,
          meta: {
            arg,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const expectedInvite = {
          ...invite,
          User: {
            username: 10,
          },
          InviteSender: {
            id: 1,
            username: 'OWNER',
          },
        };
        const rejected = {
          type: 'group/inviteUser/rejected',
          payload: undefined,
          meta: expect.anything(),
          error: expect.anything(),
        };
        const addInviteAction = {
          type: 'group/addInvite',
          payload: expectedInvite,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(addInviteAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post)
          .toHaveBeenCalledWith(
            `/api/group/${fullGroup.id}/invite`,
            {
              userId: arg.usernameOrId,
            },
          );
      });
    });
  });

  describe('leaveGroup', () => {
    it('requests leaveGroup and dispatches ' +
    'removeGroupWithId action', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.post = jest.fn().mockResolvedValueOnce({data: undefined});

      await store.dispatch(leaveGroup({id: group.id}));

      const pending = {
        type: 'group/leaveGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        type: 'group/leaveGroup/fulfilled',
      };
      const removeGroupWithIdAction = {
        type: 'group/removeGroupWithId',
        payload: group.id,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(removeGroupWithIdAction);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post)
        .toHaveBeenCalledWith(`/api/group/${group.id}/leave`);
    });

    it('if request rejected, returns ' +
    'rejectWithValue with error', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.post = jest.fn().mockRejectedValueOnce({data: error});

      const res = await store.dispatch(leaveGroup({id: group.id}));

      const pending = {
        type: 'group/leaveGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        type: 'group/leaveGroup/rejected',
        meta: expect.anything(),
        error: expect.anything(),
      };
      const removeGroupWithIdAction = {
        type: 'group/removeGroupWithId',
        payload: group.id,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(res).toEqual(rejected);
      expect(actions).not.toContainEqual(removeGroupWithIdAction);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post)
        .toHaveBeenCalledWith(`/api/group/${group.id}/leave`);
    });
  });

  describe('deleteGroup', () => {
    it('request deleteGroup and dispatches ' +
    'removeGroupWithId action', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.delete = jest.fn().mockResolvedValueOnce({data: undefined});

      await store.dispatch(deleteGroup({id: group.id}));

      const pending = {
        type: 'group/deleteGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        ...pending,
        type: 'group/deleteGroup/fulfilled',
      };
      const removeGroupWithIdAction = {
        type: 'group/removeGroupWithId',
        payload: group.id,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(removeGroupWithIdAction);
      expect(mockAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockAxios.delete)
        .toHaveBeenCalledWith(`/api/group/${group.id}`);
    });

    it('if request rejected, returns ' +
    'rejectWithValue with error', async () => {
      const store = mockStore({
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.delete = jest.fn().mockRejectedValueOnce({data: error});

      const res = await store.dispatch(deleteGroup({id: group.id}));

      const pending = {
        type: 'group/deleteGroup/pending',
        payload: undefined,
        meta: {
          arg: {id: group.id},
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        ...pending,
        type: 'group/deleteGroup/rejected',
        meta: expect.anything(),
        error: expect.anything(),
      };
      const removeGroupWithIdAction = {
        type: 'group/removeGroupWithId',
        payload: group.id,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(res).toEqual(rejected);
      expect(actions).not.toContainEqual(removeGroupWithIdAction);
      expect(mockAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockAxios.delete)
        .toHaveBeenCalledWith(`/api/group/${group.id}`);
    });
  });

  describe('driveCar', () => {
    it('dispatch setDriverOfCar, if ' +
    'user defined, correct group selected and car is in list', async () => {
      const user = {
        id: 1,
        username: 'OWNER',
      };
      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, carId: cars[0].carId};
      await store.dispatch(
        driveCar(arg));

      const pending = {
        type: 'group/driveCar/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const fulfilled = {
        type: 'group/driveCar/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const setDriverOfCarAction = {
        type: 'group/setDriverOfCar',
        payload: {
          groupId: fullGroup.id,
          carId: cars[0].carId,
          driver: user,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(setDriverOfCarAction);
      expect(mockAxios.put)
        .toHaveBeenCalledWith(
          `/api/group/${fullGroup.id}/car/${cars[0].carId}/drive`);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });

    it('if request rejected, returns rejectWithValue with error', async () => {
      const user = {
        id: 1,
        username: 'OWNER',
      };
      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.put = jest.fn().mockRejectedValueOnce({data: error});

      const arg = {groupId: fullGroup.id, carId: cars[0].carId};
      await store.dispatch(
        driveCar(arg));

      const pending = {
        type: 'group/driveCar/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const rejected = {
        type: 'group/driveCar/rejected',
        payload: undefined,
        meta: expect.anything(),
        error: expect.anything(),
      };
      const setDriverOfCarAction = {
        type: 'group/setDriverOfCar',
        payload: {
          groupId: fullGroup.id,
          carId: cars[0].carId,
          driver: user,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setDriverOfCarAction);
      expect(mockAxios.put)
        .toHaveBeenCalledWith(
          `/api/group/${fullGroup.id}/car/${cars[0].carId}/drive`);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('parkCar', () => {
    it('dispatch setLocationOfCar, if ' +
    'user defined, correct group selected and car is in list', async () => {
      const user = {
        id: 1,
        username: 'OWNER',
      };
      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {
        groupId: fullGroup.id,
        carId: cars[0].carId,
        latitude: 1.0,
        longitude: 2.0,
      };
      await store.dispatch(
        parkCar(arg));

      const pending = {
        type: 'group/parkCar/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const fulfilled = {
        type: 'group/parkCar/fulfilled',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const setLocationOfCarAction = {
        type: 'group/setLocationOfCar',
        payload: {
          groupId: fullGroup.id,
          carId: cars[0].carId,
          latitude: arg.latitude,
          longitude: arg.longitude,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(setLocationOfCarAction);
      expect(mockAxios.put)
        .toHaveBeenCalledWith(
          `/api/group/${fullGroup.id}/car/${cars[0].carId}/park`, {
            latitude: arg.latitude,
            longitude: arg.longitude,
          });
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });

    it('if request rejected, returns rejectWithValue ' +
    'with error', async () => {
      const user = {
        id: 1,
        username: 'OWNER',
      };
      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.put = jest.fn().mockRejectedValueOnce({data: error});

      const arg = {
        groupId: fullGroup.id,
        carId: cars[0].carId,
        latitude: 1.0,
        longitude: 2.0,
      };
      await store.dispatch(
        parkCar(arg));

      const pending = {
        type: 'group/parkCar/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const rejected = {
        type: 'group/parkCar/rejected',
        payload: undefined,
        error: expect.anything(),
        meta: expect.anything(),
      };
      const setLocationOfCarAction = {
        type: 'group/setLocationOfCar',
        payload: {
          groupId: fullGroup.id,
          carId: cars[0].carId,
          latitude: arg.latitude,
          longitude: arg.longitude,
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setLocationOfCarAction);
      expect(mockAxios.put)
        .toHaveBeenCalledWith(
          `/api/group/${fullGroup.id}/car/${cars[0].carId}/park`, {
            latitude: arg.latitude,
            longitude: arg.longitude,
          });
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCar', () => {
    it('request createCar, dispatches addCar ' +
    'if correct group selected', async () => {
      const store = mockStore({
        group: {
          selectedGroup: fullGroup,
          loading: false,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        },
      });

      const car: CarWithDriver = {
        groupId: fullGroup.id,
        carId: 6,
        name: 'NEW CAR',
        color: CarColor.Green,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverId: null,
        Driver: null,
        latitude: null,
        longitude: null,
      };
      mockAxios.post = jest.fn().mockResolvedValueOnce({data: car});

      const arg = {
        groupId: car.groupId,
        name: car.name,
        color: car.color,
      };
      await store.dispatch(createCar(arg));

      const pending = {
        type: 'group/createCar/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilled = {
        type: 'group/createCar/fulfilled',
        payload: car,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const addCarAction = {
        type: 'group/addCar',
        payload: car,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(addCarAction);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/car`, {
          name: car.name,
          color: car.color,
        },
      );
    });

    it('if request rejected, returns ' +
    'rejectWithValue with error', async () => {
      const store = mockStore({
        group: {
          selectedGroup: fullGroup,
          loading: false,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        },
      });

      const car: CarWithDriver = {
        groupId: fullGroup.id,
        carId: 6,
        name: 'NEW CAR',
        color: CarColor.Green,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverId: null,
        Driver: null,
        latitude: null,
        longitude: null,
      };
      const error = 'ERROR';
      mockAxios.post = jest.fn().mockRejectedValueOnce({data: error});

      const arg = {
        groupId: car.groupId,
        name: car.name,
        color: car.color,
      };
      await store.dispatch(createCar(arg));

      const pending = {
        type: 'group/createCar/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejected = {
        type: 'group/createCar/rejected',
        payload: undefined,
        meta: expect.anything(),
        error: expect.anything(),
      };
      const addCarAction = {
        type: 'group/addCar',
        payload: car,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(addCarAction);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/car`, {
          name: car.name,
          color: car.color,
        },
      );
    });
  });

  describe('grantAdminRights', () => {
    it('rejects with NotLoggedInError if user not defined', async () => {
      const store = mockStore({
        auth: {
          user: undefined,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(grantAdminRights(arg));

      const pending = {
        type: 'group/grantAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/grantAdminRights/rejected',
        payload: new NotLoggedInError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: true},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('rejects with NotAdminOfGroup if user ' +
    'not admin of group', async () => {
      const user = {
        id: 1,
        username: 'USER',
      };

      const newGroup = {
        ...fullGroup,
        Owner: {
          id: 10,
          username: 'OTHER',
        },
        ownerId: 10,
        members: [
          {
            isAdmin: false,
            User: user,
          },
        ],
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: newGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(grantAdminRights(arg));

      const pending = {
        type: 'group/grantAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/grantAdminRights/rejected',
        payload: new NotAdminOfGroupError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: true},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('rejects with NoGroupSelected if no group selected', async () => {
      const user = {
        id: 1,
        username: 'USER',
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(grantAdminRights(arg));

      const pending = {
        type: 'group/grantAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/grantAdminRights/rejected',
        payload: new NoGroupSelectedError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: true},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('if group selected, user defined, user admin of group, ' +
    'request grantAdmin and set admin of member to true', async () => {
      const user = fullGroup.Owner;

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(grantAdminRights(arg));

      const pending = {
        type: 'group/grantAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const fulfilled = {
        type: 'group/grantAdminRights/fulfilled',
        payload: undefined,
        meta: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: true},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/member/${arg.userId}/admin/grant`);
    });

    it('if request rejected, returns rejectWithValue with error', async () => {
      const user = fullGroup.Owner;

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.put = jest.fn().mockRejectedValueOnce({data: error});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(grantAdminRights(arg));

      const pending = {
        type: 'group/grantAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/grantAdminRights/rejected',
        payload: undefined,
        error: expect.anything(),
        meta: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: true},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/member/${arg.userId}/admin/grant`);
    });
  });

  describe('revokeAdminRights', () => {
    it('rejects with NotLoggedInError if user not defined', async () => {
      const store = mockStore({
        auth: {
          user: undefined,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: fullGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(revokeAdminRights(arg));

      const pending = {
        type: 'group/revokeAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/revokeAdminRights/rejected',
        payload: new NotLoggedInError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: false},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('rejects with NotOwnerOfGroupError if ' +
    'user not admin of group', async () => {
      const user = {
        id: 1,
        username: 'USER',
      };

      const newGroup = {
        ...fullGroup,
        Owner: {
          id: 10,
          username: 'OTHER',
        },
        ownerId: 10,
        members: [
          {
            isAdmin: false,
            User: user,
          },
        ],
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: newGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(revokeAdminRights(arg));

      const pending = {
        type: 'group/revokeAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/revokeAdminRights/rejected',
        payload: new NotOwnerOfGroupError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: false},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('rejects with NoGroupSelected if no group selected', async () => {
      const user = {
        id: 1,
        username: 'USER',
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: null,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(revokeAdminRights(arg));

      const pending = {
        type: 'group/revokeAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/revokeAdminRights/rejected',
        payload: new NoGroupSelectedError(),
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: false},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(0);
    });

    it('if group selected, user defined, user admin of group, ' +
    'request revokeAdmin and set admin of member to false', async () => {
      const user = fullGroup.Owner;

      const newGroup = {
        ...fullGroup,
        members: [
          members[0],
          {
            ...members[1],
            isAdmin: true,
          },
        ],
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: newGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(revokeAdminRights(arg));

      const pending = {
        type: 'group/revokeAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const fulfilled = {
        type: 'group/revokeAdminRights/fulfilled',
        payload: undefined,
        meta: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: false},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(fulfilled);
      expect(actions).toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/member/${arg.userId}/admin/revoke`);
    });

    it('if request rejected, returns rejectWithValue with error', async () => {
      const user = fullGroup.Owner;

      const newGroup = {
        ...fullGroup,
        members: [
          members[0],
          {
            ...members[1],
            isAdmin: true,
          },
        ],
      };

      const store = mockStore({
        auth: {
          user,
          loading: false,
          signUpRequestSent: false,
        },
        group: {
          selectedGroup: newGroup,
          ids: groups.map((g) => g.id),
          entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
          loading: false,
        },
      });

      const error = 'ERROR';
      mockAxios.put = jest.fn().mockRejectedValueOnce({data: error});

      const arg = {groupId: fullGroup.id, userId: members[1].User.id};
      await store.dispatch(revokeAdminRights(arg));

      const pending = {
        type: 'group/revokeAdminRights/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      const rejected = {
        type: 'group/revokeAdminRights/rejected',
        payload: undefined,
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setAdminOfMemberAction = {
        type: 'group/setAdminOfMember',
        payload: {...arg, isAdmin: false},
      };

      const actions = store.getActions();

      expect(actions).toContainEqual(pending);
      expect(actions).toContainEqual(rejected);
      expect(actions).not.toContainEqual(setAdminOfMemberAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(
        `/api/group/${fullGroup.id}/member/${arg.userId}/admin/revoke`);
    });
  });
});
