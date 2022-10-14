/* eslint-disable @typescript-eslint/no-explicit-any */
import './mockAxios';
import './mockI18n';
import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import history from '../lib/redux/history';
import {StylesProvider} from '@material-ui/styles';
import {MuiThemeProvider} from '@material-ui/core';
import testTheme from './testTheme';
import {
  MockStoreEnhanced,
} from 'redux-mock-store';
import {RootState} from '../lib/redux/store';
import mockStore from './mockStore';
import mediaQuery from 'css-mediaquery';

export interface GlobalMocks {
  ResizeObserver: jest.Mock<{observe: jest.Mock, disconnect: jest.Mock}>;
}


export interface TestRenderResult {
  store: MockStoreEnhanced<unknown>;
  globalMocks: GlobalMocks;
}

/**
 * Testing generateClassName function to
 * avoid weird fails due to random class names
 * @param rule Rule
 * @param stylesheet Stylesheet
 * @returns The class name
 */
const generateClassName = (rule: any, stylesheet: any) => {
  return `${stylesheet.options.classNamePrefix}-${rule.key}`;
};

export interface TestRenderOptions {
  width?: string;
}

/**
 * Creates a match media to fix useMediaQuery in tests.
 * @param width Width of window
 * @returns Match media mock
 */
function createMatchMedia(width: any) {
  return (query: any) => ({
    matches: mediaQuery.match(query, {width}),
    addListener: () => undefined,
    removeEventListener: () => undefined,
  });
}


/**
 * Mock all global function which are used.
 */
const mockGlobals = (width: number): GlobalMocks => {
  // Mock ResizeObserver
  const resizeObserverMock = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  window.ResizeObserver = resizeObserverMock;
  window.innerWidth = width;
  window.matchMedia = createMatchMedia(window.innerWidth) as any;

  return {ResizeObserver: resizeObserverMock};
};

/**
 * Render function for testing purposes.
 * Provides the necessary base components and
 * contexts.
 * @param state Redux state
 * @param children The children to render
 * @param options Additional options
 * @returns The result of the render function.
 */
function testRender(
  state: Partial<RootState>,
  children: React.ReactNode,
  options?: TestRenderOptions,
): RenderResult & TestRenderResult {
  const store = mockStore(state);
  const theme = testTheme(options && options.width);
  const width = theme.breakpoints.values[
    options && options.width ? options.width : 'lg'];
  const globalMocks = mockGlobals(width);

  const renderResult = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <StylesProvider generateClassName={generateClassName}>
            {children}
          </StylesProvider>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>,
  );

  return {
    ...renderResult,
    globalMocks,
    store,
  };
}

export default testRender;
