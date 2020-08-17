import React from 'react';
import ReactDOM from 'react-dom';
import SignUpForm from './SignUpForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SignUpForm signUp={undefined as any}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
