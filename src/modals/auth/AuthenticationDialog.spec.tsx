import '../../__test__/mockAxios';
import testRender from '../../__test__/testRender';
import React from 'react';
import {fireEvent} from '@testing-library/react';
import AuthenticationDialog from './AuthenticationDialog';
import {Route} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { RootState } from '../../lib/redux/store';
import { CALL_HISTORY_METHOD } from 'connected-react-router';
import history from '../../lib/redux/history';
import {User} from "../../typings";

describe('AuthenticationDialog', () => {
  let state: Partial<RootState>;

  beforeEach(() => {
    state = {};
  });

  it('renders without crashing', () => {
    testRender(
      state,
      <AuthenticationDialog open={true} close={() => {}}/>
    );
  });
  
  it('matches snapshot', async () => {
    const {baseElement} = testRender(
      state,
      <AuthenticationDialog open={true} close={() => {}}/>,
    );
  
    expect(baseElement).toMatchSnapshot();
  });
  
  it('sign up button navigates to correct url', () => {
    history.location.pathname = '/auth';
    state = {
      ...state,
      router: {
        location: {
          pathname: '/auth',
          state: undefined,
          search: '',
          query: {},
          hash: '',
        },
        action: 'PUSH'
      },
    };

    const {baseElement, store} = testRender(
      state,
      <Route path='/auth'>
        <AuthenticationDialog open={true} close={() => {}}/>
      </Route>,
    );
  
    expect(baseElement).toMatchSnapshot();
  
    expect(baseElement.querySelector('#auth-to-signup')).not.toBeNull();
    expect(baseElement.querySelector('#auth-to-login')).not.toBeNull();
  
    fireEvent.click(baseElement.querySelector('#auth-to-signup')!);
  
    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          state: {modal: '/auth/sign-up'},
          search: 'modal=/auth/sign-up',
        }],
        method: 'push',
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
  });
  
  it('login button navigates to correct url', () => {
    history.location.pathname = '/auth';
    state = {
      ...state,
      router: {
        location: {
          pathname: '/auth',
          state: undefined,
          search: '',
          query: {},
          hash: '',
        },
        action: 'PUSH'
      },
    };

    const {baseElement, store} = testRender(
      state,
      <Route path='/auth'>
        <AuthenticationDialog open={true} close={() => {}}/>
      </Route>,
    );
  
    expect(baseElement).toMatchSnapshot();
  
    expect(baseElement.querySelector('#auth-to-signup')).not.toBeNull();
    expect(baseElement.querySelector('#auth-to-login')).not.toBeNull();
  
    fireEvent.click(baseElement.querySelector('#auth-to-login')!);
  
    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          state: {modal: '/auth/login'},
          search: 'modal=/auth/login',
        }],
        method: 'push',
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
  });
  
  it('back button button navigates back from form', () => {
    history.push('/auth');
    history.push('/auth/login');
    state = {
      ...state,
      router: {
        location: {
          pathname: '/auth/login',
          state: undefined,
          search: '',
          query: {},
          hash: '',
        },
        action: 'PUSH'
      },
    };

    const close = jest.fn();

    const {baseElement, store} = testRender(
      state,
      <Route path='/auth'>
        <AuthenticationDialog open={true} close={close}/>
      </Route>
    );
  
    expect(baseElement).toMatchSnapshot();
  
    expect(baseElement.querySelector('#auth-to-signup')).toBeNull();
    expect(baseElement.querySelector('#auth-to-login')).toBeNull();
    expect(baseElement.querySelector('#login-submit')).not.toBeNull();
    expect(baseElement.querySelector('#signup-submit')).toBeNull();
  
    fireEvent.click(baseElement.querySelector('#auth-go-back')!);
  
    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [],
        method: 'goBack'
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
    expect(close).not.toHaveBeenCalled();
  });
  
  it('if user logged in call close', () => {
    history.push('/auth');
    history.push('/auth/login');
    state = {
      ...state,
      auth: {
        user: {
          username: 'USER',
          id: 1,
        } as User,
        signUpRequestSent: false,
        loading: false,
      },
      router: {
        location: {
          pathname: '/auth/login',
          state: undefined,
          search: '',
          query: {},
          hash: '',
        },
        action: 'PUSH'
      },
    };

    const close = jest.fn();

    testRender(
      state,
      <Route path='/auth'>
        <AuthenticationDialog open={true} close={close}/>
      </Route>
    );
  
    expect(close).toBeCalledTimes(1);
  });
  
});