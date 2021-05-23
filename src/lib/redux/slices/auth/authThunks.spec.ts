import mockStore from '../../../../__test__/mockStore';
import mockAxios from '../../../../__test__/mockAxios';
import {User} from '../../../../typings/auth';
import {
  checkLoggedIn,
  login,
  logout,
  openAuthDialog,
  signUp,
} from './authThunks';
import {unwrapResult} from '@reduxjs/toolkit';
import {CALL_HISTORY_METHOD} from 'connected-react-router';

describe('authThunks', () => {
  let user: User;

  beforeEach(() => {
    jest.clearAllMocks();

    user = {
      id: 1,
      username: 'user',
      email: 'user@mail.com',
      isBetaUser: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  });

  describe('login', () => {
    it('send login request, sets user to returned' +
    ' value and sets signUpRequestSent to false', async () => {
      const store = mockStore({
        auth: {
          user: undefined,
          signUpRequestSent: true,
          loading: false,
        },
      });
      mockAxios.put = jest.fn().mockResolvedValueOnce({data: user});

      const arg = {username: 'username', password: '123456'};
      const res = unwrapResult(await store.dispatch(login(arg)));

      expect(res).toEqual(user);

      const pendingAction = {
        type: 'auth/login/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: 'pending',
          requestId: expect.any(String),
        },
      };
      const fulfilledAction = {
        type: 'auth/login/fulfilled',
        payload: user,
        meta: {
          arg,
          requestStatus: 'fulfilled',
          requestId: expect.any(String),
        },
      };

      const setUserAction = {
        type: 'auth/setUser',
        payload: user,
      };

      const setSignUpRequestSentAction = {
        type: 'auth/setSignUpRequestSent',
        payload: false,
      };


      const actions = store.getActions();
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(fulfilledAction);
      expect(actions).toContainEqual(setUserAction);
      expect(actions).toContainEqual(setSignUpRequestSentAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(`/auth/login`, arg);
    });

    it('rejects with responded data when request rejected', async () => {
      const store = mockStore({
        auth: {
          user: undefined,
          signUpRequestSent: true,
          loading: false,
        },
      });
      const error = {
        message: 'ERROR',
      };
      mockAxios.put = jest.fn()
        .mockRejectedValueOnce({response: {data: error}});

      const arg = {username: 'username', password: '123456'};
      const res = await store.dispatch(login(arg));

      const pendingAction = {
        type: 'auth/login/pending',
        payload: undefined,
        meta: {
          arg,
          requestStatus: 'pending',
          requestId: expect.any(String),
        },
      };
      const rejectedAction = {
        type: 'auth/login/rejected',
        payload: error,
        meta: expect.anything(),
        error: expect.anything(),
      };

      const setUserAction = {
        type: 'auth/setUser',
        payload: user,
      };

      const setSignUpRequestSentAction = {
        type: 'auth/setSignUpRequestSent',
        payload: false,
      };


      const actions = store.getActions();
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(rejectedAction);
      expect(actions).not.toContainEqual(setUserAction);
      expect(actions).not.toContainEqual(setSignUpRequestSentAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith(`/auth/login`, arg);
      expect(res).toEqual(rejectedAction);
    });
  });

  describe('logout', () => {
    it('sends logout request, if successful' +
    ' dispatches reset for all slices and push path', async () => {
      const store = mockStore();
      mockAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      unwrapResult(await store.dispatch(logout()));

      const actions = store.getActions();

      const fulfilledAction = {
        type: 'auth/logout/fulfilled',
        payload: undefined,
        meta: {
          arg: undefined,
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };

      const pendingAction = {
        type: 'auth/logout/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };

      expect(actions).toContainEqual(fulfilledAction);
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual({type: 'auth/reset', payload: undefined});
      expect(actions).toContainEqual({type: 'group/reset', payload: undefined});
      expect(actions).toContainEqual({
        type: 'invites/reset',
        payload: undefined,
      });
      expect(actions).toContainEqual({
        type: CALL_HISTORY_METHOD,
        payload: {
          args: ['/'],
          method: 'replace',
        },
      });
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith('/auth/logout');
    });

    it('if request is rejected, returns ' +
    'rejectWithValue with data of response', async () => {
      const store = mockStore();
      mockAxios.put = jest.fn()
        .mockRejectedValueOnce({response: {data: 'error'}});

      const res = await store.dispatch(logout());

      const rejectedAction = {
        type: 'auth/logout/rejected',
        payload: 'error',
        error: expect.anything(),
        meta: expect.anything(),
      };

      const pendingAction = {
        type: 'auth/logout/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestId: expect.any(String),
          requestStatus: expect.any(String),
        },
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(rejectedAction);
      expect(res).toEqual(rejectedAction);
      expect(actions).not
        .toContainEqual({type: 'auth/reset', payload: undefined});
      expect(actions).not
        .toContainEqual({type: 'group/reset', payload: undefined});
      expect(actions).not
        .toContainEqual({
          type: 'invites/reset',
          payload: undefined,
        });
      expect(actions).not.toContainEqual({
        type: 'auth/reset',
        payload: {
          args: ['/'],
          method: 'replace',
        },
      });
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('signUp', () => {
    describe('send sign up request, if successful', () => {
      it('if response is user, set user ' +
      'to response and signUpRequestSent to false', async () => {
        const store = mockStore();
        mockAxios.post = jest.fn().mockResolvedValueOnce({data: user});

        const arg = {
          username: user.username,
          email: user.email,
          password: '123456',
          offset: 0,
        };

        unwrapResult(await store.dispatch(signUp(arg)));

        const actions = store.getActions();

        expect(actions).toContainEqual({
          type: 'auth/signUp/pending',
          payload: undefined,
          meta: {
            arg,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        });
        expect(actions).toContainEqual({
          type: 'auth/signUp/fulfilled',
          payload: user,
          meta: {
            arg,
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        });
        expect(actions).toContainEqual({
          type: 'auth/setUser',
          payload: user,
        });
        expect(actions).toContainEqual({
          type: 'auth/setSignUpRequestSent',
          payload: false,
        });
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith('/auth/sign-up', arg);
      });

      it('if response is not a user, don\'t ' +
      'change user and set signUpRequestSent to true', async () => {
        const store = mockStore();
        mockAxios.post = jest.fn()
          .mockResolvedValueOnce({data: {message: 'TEST'}});

        const args = {
          username: user.username,
          email: user.email,
          password: '123456',
          offset: 0,
        };

        unwrapResult(await store.dispatch(signUp(args)));

        const actions = store.getActions();

        expect(actions).not.toContainEqual({
          type: 'auth/setUser',
          payload: user,
        });
        expect(actions).toContainEqual({
          type: 'auth/setSignUpRequestSent',
          payload: true,
        });
      });
    });

    it('send sign up request, if rejected ' +
    'return rejectWithValue with data of response', async () => {
      const store = mockStore();
      mockAxios.post = jest.fn()
        .mockRejectedValueOnce({response: {data: 'TEST'}});

      const arg = {
        username: user.username,
        email: user.email,
        password: '123456',
        offset: 0,
      };

      const res = await store.dispatch(signUp(arg));

      const actions = store.getActions();

      const pendingAction = {
        type: 'auth/signUp/pending',
        payload: undefined,
        meta: {
          requestId: expect.any(String),
          requestStatus: expect.any(String),
          arg,
        },
      };
      const rejectedAction = {
        type: 'auth/signUp/rejected',
        payload: 'TEST',
        meta: expect.anything(),
        error: expect.anything(),
      };
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(rejectedAction);
      expect(actions).not.toContainEqual({
        type: 'auth/setUser',
        payload: user,
      });
      expect(actions).not.toContainEqual({
        type: 'auth/setSignUpRequestSent',
        payload: true,
      });
      expect(res).toEqual(rejectedAction);
    });
  });

  describe('checkLoggedIn', () => {
    it('send request, if successful set user to response data', async () => {
      const store = mockStore();

      mockAxios.put = jest.fn().mockResolvedValueOnce({data: user});

      await store.dispatch(checkLoggedIn());

      const pendingAction = {
        type: 'auth/checkLoggedIn/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const fulfilledAction = {
        type: 'auth/checkLoggedIn/fulfilled',
        payload: user,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const setUserAction = {
        type: 'auth/setUser',
        payload: user,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(fulfilledAction);
      expect(actions).toContainEqual(setUserAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith('/auth/token');
    });

    it('send request, if rejected return ' +
    'rejectWithValue with response data', async () => {
      const store = mockStore();

      mockAxios.put = jest.fn()
        .mockRejectedValueOnce({response: {data: 'ERROR'}});

      await store.dispatch(checkLoggedIn());

      const pendingAction = {
        type: 'auth/checkLoggedIn/pending',
        payload: undefined,
        meta: {
          arg: undefined,
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const rejectedAction = {
        type: 'auth/checkLoggedIn/rejected',
        payload: 'ERROR',
        meta: expect.anything(),
        error: expect.anything(),
      };
      const setUserAction = {
        type: 'auth/setUser',
        payload: user,
      };

      const actions = store.getActions();
      expect(actions).toContainEqual(pendingAction);
      expect(actions).toContainEqual(rejectedAction);
      expect(actions).not.toContainEqual(setUserAction);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith('/auth/token');
    });
  });

  describe('openAuthDialog', () => {
    it('creates correct action', () => {
      const action = openAuthDialog();

      expect(action).toEqual({
        type: CALL_HISTORY_METHOD,
        payload: {
          args: [{
            search: 'modal=/auth',
            state: {modal: '/auth'},
          }],
          method: 'push',
        },
      });
    });
  });
});
