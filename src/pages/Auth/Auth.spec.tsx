import _testRender from "../../__test__/testRender";
import React from 'react';
import {AuthState} from "../../lib/redux/slices/auth";
import Auth from "./Auth";
import {Route} from "react-router-dom";
import history from "../../lib/redux/history";
import {config} from 'react-transition-group';

/**
 * !IMPORTANT
 * Unfortunately it was not possible for me to add more tests which
 * test navigating between the overview, login and sign-up routes.
 * For whatever reason the page would not react to any history changes and
 * would only every display the overview.
 */

describe('Auth', () => {
  let auth: AuthState;
  let preloadMock: jest.Mock;

  beforeAll(() => {
    config.disabled = true;
  });

  const testRender = () => {
    history.push('/auth');
    return _testRender(
      {
        auth,
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
      },
      <Route path='/auth'>
        <Auth preloadMain={preloadMock} />
      </Route>
    );
  }

  beforeEach(() => {
    auth = {
      loading: false,
      signUpRequestSent: false,
      user: undefined,
    };

    preloadMock = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is rendered correctly', () => {
    const {baseElement} = testRender();

    expect(baseElement).toMatchSnapshot();
  });
});