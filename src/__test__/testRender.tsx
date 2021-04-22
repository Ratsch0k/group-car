import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {ConnectedRouter, RouterState} from 'connected-react-router';
import {Provider} from 'react-redux';
import history from '../lib/redux/history';
import {ThemeProvider} from '@material-ui/styles';
import testTheme from './testTheme';
import configureMockStore, {
  MockStoreCreator,
  MockStoreEnhanced,
} from 'redux-mock-store';
import thunk from 'redux-thunk';


export interface TestRenderResult<T> {
  mockStore: MockStoreCreator<T>;
  store: MockStoreEnhanced<unknown>;
}

const router = {
  action: 'POP',
  location: {
    pathname: '/',
    search: '',
    hash: '',
    query: {},
  },
} as RouterState;

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
    router,
    ...state,
  };
  const store = mockStore(initialState);

  const renderResult = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={testTheme}>
          {children}
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
