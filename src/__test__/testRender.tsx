import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import history from '../lib/redux/history';
import {StylesProvider, ThemeProvider} from '@material-ui/styles';
import testTheme from './testTheme';
import {
  MockStoreEnhanced,
} from 'redux-mock-store';
import {RootState} from '../lib/redux/store';
import mockStore from './mockStore';


export interface TestRenderResult {
  store: MockStoreEnhanced<unknown>;
}

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

export interface TestRenderOptions {
  width?: string;
}


/**
 * Render function for testing purposes.
 * Provides the necessary base components and
 * contexts.
 * @param children The children to render
 * @returns The result of the render function.
 */
function testRender(
  state: Partial<RootState>,
  children: React.ReactNode,
  options?: TestRenderOptions,
): RenderResult & TestRenderResult {
  const store = mockStore(state);

  const renderResult = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={testTheme(options && options.width)}>
          <StylesProvider generateClassName={generateClassName}>
            {children}
          </StylesProvider>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>,
  );

  return {
    ...renderResult,
    store,
  };
}

export default testRender;
