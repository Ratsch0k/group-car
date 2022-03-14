import React from 'react';
import '../../../../__test__/mockI18n';
import {render, screen, fireEvent} from '@testing-library/react';
import PasswordTextField from './PasswordTextField';
import '@testing-library/jest-dom/extend-expect';

it('renders without crashing', () => {
  render(<PasswordTextField name='test'/>);
});

it('renders with type password usually', () => {
  const {container} = render(<PasswordTextField name='test'/>);

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('input')[0])
      .toHaveAttribute('type', 'password');
});

it('type of input changes after button press', () => {
  const {container} = render(<PasswordTextField name='test'/>);

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('input')[0])
      .toHaveAttribute('type', 'password');

  fireEvent.click(screen.getByRole('button'));

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('input')[0])
      .toHaveAttribute('type', 'text');

  fireEvent.click(screen.getByRole('button'));

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('input')[0])
      .toHaveAttribute('type', 'password');
});
