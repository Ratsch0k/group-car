import React from 'react';
import testRender from '../../../../__test__/testRender';
import LoginForm from './LoginForm';

it('renders without crashing', () => {
  testRender({}, <LoginForm />);
});
