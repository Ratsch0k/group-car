import React from 'react';
import {render} from '@testing-library/react';
import DrawerFooter from './DrawerFooter';
import { ThemeProvider } from '@material-ui/core';
import theme from '../../../../__test__/testTheme';

it('renders without crashing', () => {
  render(
    <ThemeProvider theme={theme}>
      <DrawerFooter />
    </ThemeProvider>);
});

it('matches snapshot', () => {
  const {container} = render(
    <ThemeProvider theme={theme}>
      <DrawerFooter />
    </ThemeProvider>
  );

  expect(container).toMatchSnapshot();
});
