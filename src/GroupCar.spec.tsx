import React from 'react';
import ReactDOM from 'react-dom';
import GroupCar from './GroupCar';
import {MemoryRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <MemoryRouter>
        <GroupCar />
      </MemoryRouter>,
      div);
  ReactDOM.unmountComponentAtNode(div);
});
