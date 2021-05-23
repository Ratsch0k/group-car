import mockStore from '../../../../__test__/mockStore';
import mockAxios from '../../../../__test__/mockAxios';
import {GroupWithOwner, InviteWithGroupAndInviteSender} from '../../../api';
import {User} from '../../../../typings';
import {acceptInvite, getInvites, rejectInvite} from './invitesThunks';
import {NoInviteForGroupError, NotLoggedInError} from '../../../errors';

describe('invitesThunks', () => {
  let invites: InviteWithGroupAndInviteSender[];
  let user: User;
  let group: GroupWithOwner;


  beforeEach(() => {
    user = {
      id: 1,
      username: 'USER',
      email: 'USER@mail.com',
      isBetaUser: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    group = {
      id: 1,
      ownerId: 2,
      Owner: {
        id: 2,
        username: 'USER 1',
      },
      name: 'GROUP 1',
      description: 'GROUP 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    invites = [
      {
        groupId: 1,
        userId: user.id,
        InviteSender: {
          id: 2,
          username: 'USER 1',
        },
        invitedBy: 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        Group: {
          id: 1,
          name: 'GROUP 1',
          description: 'DESC 1',
          ownerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          Owner: {
            id: 2,
            username: 'USER 1',
          },
        },
      },
      {
        groupId: 2,
        userId: user.id,
        InviteSender: {
          id: 3,
          username: 'USER 2',
        },
        invitedBy: 3,
        updatedAt: new Date(),
        createdAt: new Date(),
        Group: {
          id: 2,
          name: 'GROUP 2',
          description: 'DESC 2',
          ownerId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          Owner: {
            id: 3,
            username: 'USER 2',
          },
        },
      },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInvites', () => {
    describe('if user defined', () => {
      it('get invites of user and dispatches addInvites action', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
        });

        mockAxios.get = jest.fn().mockResolvedValue({data: {invites}});

        await store.dispatch(getInvites());

        const pending = {
          type: 'invites/getInvites/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const fulfilled = {
          type: 'invites/getInvites/fulfilled',
          payload: invites,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const addInvitesAction = {
          type: 'invites/addInvites',
          payload: invites,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(fulfilled);
        expect(actions).toContainEqual(addInvitesAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('/api/user/invite');
      });

      it('if request rejects, rejectsWithValue ' +
      'with error response', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
        });

        const error = 'ERROR';
        mockAxios.get = jest.fn()
          .mockRejectedValueOnce({response: {data: error}});

        await store.dispatch(getInvites());

        const pending = {
          type: 'invites/getInvites/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/getInvites/rejected',
          meta: expect.anything(),
          payload: error,
          error: expect.anything(),
        };
        const addInvitesAction = {
          type: 'invites/addInvites',
          payload: invites,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(addInvitesAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('/api/user/invite');
      });
    });

    describe('if user not defined', () => {
      it('rejects with NotLoggedInError', async () => {
        const store = mockStore({
          auth: {
            user: undefined,
            loading: false,
            signUpRequestSent: false,
          },
        });

        mockAxios.get = jest.fn()
          .mockResolvedValue({data: {invites}});

        await store.dispatch(getInvites());

        const pending = {
          type: 'invites/getInvites/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/getInvites/rejected',
          payload: new NotLoggedInError(),
          meta: expect.anything(),
          error: expect.anything(),
        };
        const addInvitesAction = {
          type: 'invites/addInvites',
          payload: invites,
        };

        const actions = store.getActions();
        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(addInvitesAction);
        expect(mockAxios.get).not.toHaveBeenCalledTimes(1);
        expect(mockAxios.get).not.toHaveBeenCalledWith('/api/user/invite');
      });
    });
  });

  describe('acceptInvite', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn().mockResolvedValue({data: group});
    });

    describe('if user not defined', () => {
      it('reject with NotLoggedInError', async () => {
        const store = mockStore({
          auth: {
            user: undefined,
            loading: false,
            signUpRequestSent: false,
          },
        });

        mockAxios.post = jest.fn().mockResolvedValueOnce({data: undefined});

        await store.dispatch(acceptInvite(invites[0].groupId));

        const pending = {
          type: 'invites/acceptInvite/pending',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/acceptInvite/rejected',
          payload: new NotLoggedInError(),
          meta: expect.anything(),
          error: expect.anything(),
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: invites[0].groupId,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(removeInviteAction);
        expect(actions).not.toContainEqual(updateAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
      });
    });

    describe('if user defined', () => {
      it('and no invite for group exists', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
        });

        mockAxios.post = jest.fn().mockResolvedValueOnce({data: undefined});

        await store.dispatch(acceptInvite(5));

        const pending = {
          type: 'invites/acceptInvite/pending',
          payload: undefined,
          meta: {
            arg: 5,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/acceptInvite/rejected',
          payload: new NoInviteForGroupError(5),
          meta: expect.anything(),
          error: expect.anything(),
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: 5,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(removeInviteAction);
        expect(actions).not.toContainEqual(updateAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
      });

      it('and invites for group exists, accepts ' +
      'invite and dispatches removeInvite and update actions', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
          invites: {
            loading: false,
            ids: invites.map((i) => i.groupId),
            entities: invites.reduce((p, c) => ({...p, [c.groupId]: c}), {}),
          },
        });

        mockAxios.post = jest.fn().mockResolvedValueOnce({data: undefined});

        await store.dispatch(acceptInvite(invites[0].groupId));

        const pending = {
          type: 'invites/acceptInvite/pending',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const fulfilled = {
          type: 'invites/acceptInvite/fulfilled',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: invites[0].groupId,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(fulfilled);
        expect(actions).toContainEqual(removeInviteAction);
        expect(actions).toContainEqual(updateAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post)
          .toHaveBeenCalledWith(`/api/user/invite/${invites[0].groupId}/join`);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
      });

      it('if request rejects, rejectsWithValue ' +
      'with error response', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
          invites: {
            loading: false,
            ids: invites.map((i) => i.groupId),
            entities: invites.reduce((p, c) => ({...p, [c.groupId]: c}), {}),
          },
        });

        const error = 'ERROR';
        mockAxios.post = jest.fn()
          .mockRejectedValueOnce({response: {data: error}});

        const res = await store.dispatch(acceptInvite(invites[0].groupId));

        const pending = {
          type: 'invites/acceptInvite/pending',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/acceptInvite/rejected',
          payload: error,
          meta: expect.anything(),
          error: expect.anything(),
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: invites[0].groupId,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(res).toEqual(rejected);
        expect(actions).not.toContainEqual(removeInviteAction);
        expect(actions).not.toContainEqual(updateAction);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post)
          .toHaveBeenCalledWith(`/api/user/invite/${invites[0].groupId}/join`);
        expect(mockAxios.get).not.toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('rejectInvite', () => {
    describe('if user defined', () => {
      it('and not invited to group, rejects ' +
      'with NoInviteForGroupError', async () => {
        const store = mockStore({
          auth: {
            user,
            loading: false,
            signUpRequestSent: false,
          },
          invites: {
            loading: false,
            ids: [],
            entities: {},
          },
        });


        await store.dispatch(rejectInvite(invites[0].groupId));

        const pending = {
          type: 'invites/rejectInvite/pending',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/rejectInvite/rejected',
          payload: new NoInviteForGroupError(invites[0].groupId),
          meta: expect.anything(),
          error: expect.anything(),
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: invites[0].groupId,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(removeInviteAction);
        expect(actions).not.toContainEqual(updateAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
      });

      describe('and invited to group', () => {
        it('dispatch removeInvite and update actions', async () => {
          const store = mockStore({
            auth: {
              user,
              loading: false,
              signUpRequestSent: false,
            },
            invites: {
              loading: false,
              ids: invites.map((i) => i.groupId),
              entities: invites.reduce((p, c) => ({...p, [c.groupId]: c}), {}),
            },
          });

          await store.dispatch(rejectInvite(invites[0].groupId));

          const pending = {
            type: 'invites/rejectInvite/pending',
            payload: undefined,
            meta: {
              arg: invites[0].groupId,
              requestStatus: expect.any(String),
              requestId: expect.any(String),
            },
          };
          const fulfilled = {
            type: 'invites/rejectInvite/fulfilled',
            payload: undefined,
            meta: {
              arg: invites[0].groupId,
              requestStatus: expect.any(String),
              requestId: expect.any(String),
            },
          };
          const removeInviteAction = {
            type: 'invites/removeInvite',
            payload: invites[0].groupId,
          };
          const updateAction = {
            type: 'group/update/pending',
            payload: undefined,
            meta: {
              arg: undefined,
              requestStatus: expect.any(String),
              requestId: expect.any(String),
            },
          };

          const actions = store.getActions();

          expect(actions).toContainEqual(pending);
          expect(actions).toContainEqual(fulfilled);
          expect(actions).toContainEqual(removeInviteAction);
          expect(actions).toContainEqual(updateAction);
          expect(mockAxios.get).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('if user not defined', () => {
      it('rejects with NotLoggedInError', async () => {
        const store = mockStore({
          auth: {
            user: undefined,
            loading: false,
            signUpRequestSent: false,
          },
        });


        await store.dispatch(rejectInvite(invites[0].groupId));

        const pending = {
          type: 'invites/rejectInvite/pending',
          payload: undefined,
          meta: {
            arg: invites[0].groupId,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const rejected = {
          type: 'invites/rejectInvite/rejected',
          payload: new NotLoggedInError(),
          meta: expect.anything(),
          error: expect.anything(),
        };
        const removeInviteAction = {
          type: 'invites/removeInvite',
          payload: invites[0].groupId,
        };
        const updateAction = {
          type: 'group/update/pending',
          payload: undefined,
          meta: {
            arg: undefined,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        const actions = store.getActions();

        expect(actions).toContainEqual(pending);
        expect(actions).toContainEqual(rejected);
        expect(actions).not.toContainEqual(removeInviteAction);
        expect(actions).not.toContainEqual(updateAction);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
      });
    });
  });
});
