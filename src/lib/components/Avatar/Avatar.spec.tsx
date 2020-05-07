import React from 'react';
import {render} from '@testing-library/react';
import Avatar from './Avatar';
import '@testing-library/jest-dom/extend-expect';

it('renders without userId', () => {
  const {container} = render(<Avatar />);
  expect(container).toMatchSnapshot();
});

it('renders with given userId', () => {
  const userId = 12;
  const {container} = render(<Avatar userId={userId} />);

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('img')[0])
      .toHaveAttribute('src', `/api/user/${userId}/profile-pic`);
});
