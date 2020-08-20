import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import DrawerHeader from './DrawerHeader';

it('renders without crashing', () => {
  render(<DrawerHeader />);
});

it('renders without a close button without crashing', () => {
  render(<DrawerHeader noCloseButton />);
});

it('with close button matches snapshot', () => {
  const {container} = render(<DrawerHeader />);

  expect(container).toMatchSnapshot();
});

it('without close button matches snapshot', () => {
  const {container} = render(<DrawerHeader noCloseButton/>);

  expect(container).toMatchSnapshot();
});

it('calls close when close button is clicked', () => {
  const close = jest.fn();

  render(<DrawerHeader close={close}/>);

  fireEvent.click(screen.queryByTestId('close')!);

  expect(close).toHaveBeenCalled();
});
