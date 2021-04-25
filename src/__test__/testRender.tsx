import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import history from '../lib/redux/history';
import {StylesProvider, ThemeProvider} from '@material-ui/styles';
import testTheme from './testTheme';
import configureMockStore, {
  MockStoreCreator,
  MockStoreEnhanced,
} from 'redux-mock-store';
import thunk from 'redux-thunk';
import {RootState} from '../lib/redux/store';
import {
  initialState as authState,
} from '../lib/redux/slices/auth/authSlice';
import {
  initialState as groupState,
} from '../lib/redux/slices/group/groupSlice';
import {
  initialState as invitesState,
} from '../lib/redux/slices/invites/invitesSlice';


export interface TestRenderResult<T> {
  mockStore: MockStoreCreator<T>;
  store: MockStoreEnhanced<unknown>;
}

const defaultState: RootState = {
  router: {
    action: 'POP',
    location: {
      pathname: '/',
      search: '',
      hash: '',
      query: {},
      state: undefined,
    },
  },
  auth: authState,
  group: groupState,
  invites: invitesState,
};

/**
 * Testing generateClassName function to
 * avoid weird fails due to random class names
 * @param rule Rule
 * @param stylesheet Stylesheet
 * @returns The class name
 */
const generateClassName = (rule, stylesheet) => {
  return `${stylesheet.options.classNamePrefix}-${rule.key}`;
};


/**
 * Render function for testing purposes.
 * Provides the necessary base components and
 * contexts.
 * @param children The children to render
 * @returns The result of the render function.
 */
function testRender<T>(state: T, children: React.ReactNode):
RenderResult & TestRenderResult<T> {
  const middleware = [thunk];
  const mockStore = configureMockStore<T>(middleware);
  const initialState = {
    ...defaultState,
    ...state,
  };
  const store = mockStore(initialState);

  const renderResult = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={testTheme}>
          <StylesProvider generateClassName={generateClassName}>
            {children}
          </StylesProvider>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>,
  );

  return {
    ...renderResult,
    mockStore,
    store,
  };
}

export default testRender;
