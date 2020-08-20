import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from '@material-ui/core';
import {theme, Drawer} from 'lib';

it('renders and matches snapshot with open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={true} onClose={jest.fn} permanent={false}/>
      </ThemeProvider>,
  );

  expect(baseElement).toMatchSnapshot();
});

it('renders and matches snapshot with open and ' +
    'permanent without crashing', () => {
  const {container} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={true} onClose={jest.fn} permanent={true}/>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open ' +
    'and permanent without crashing', () => {
  const {container} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={false} onClose={jest.fn} permanent={true}/>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={false} onClose={jest.fn} permanent={false}/>
      </ThemeProvider>,
  );

  expect(baseElement).toMatchSnapshot();
});
