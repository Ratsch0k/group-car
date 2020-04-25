import React from 'react';
import ReactDOM from 'react-dom';
import GroupCar from './GroupCar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GroupCar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
