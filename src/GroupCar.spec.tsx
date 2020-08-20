import React from 'react';
import ReactDOM from 'react-dom';
import GroupCar from './GroupCar';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import {theme} from 'lib';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const geolocation = {
    watchPosition: jest.fn().mockResolvedValue({
      coords: {
        latitude: 10,
        longitude: 20,
      },
    }),
  };

  (global as any).navigator.geolocation = geolocation;

  ReactDOM.render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <GroupCar />
        </ThemeProvider>
      </MemoryRouter>,
      div);
  ReactDOM.unmountComponentAtNode(div);
});
