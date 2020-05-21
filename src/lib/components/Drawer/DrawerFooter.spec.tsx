import React from 'react';
import {render} from '@testing-library/react';
import DrawerFooter from './DrawerFooter';

it('renders without crashing', () => {
  render(<DrawerFooter />);
});

it('matches snapshot', () => {
  const {container} = render(<DrawerFooter />);

  expect(container).toMatchSnapshot();
});
