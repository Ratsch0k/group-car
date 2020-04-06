import React from 'react';
import ReactDOM from 'react-dom';
import Authentication from './Authentication';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Authentication />, div);
  ReactDOM.unmountComponentAtNode(div);
});
