import React from 'react';
import ReactDOM from 'react-dom';
import GroupCar from './GroupCar';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import theme from 'lib/theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <GroupCar />
        </ThemeProvider>
      </MemoryRouter>,
      div);
  ReactDOM.unmountComponentAtNode(div);
});
