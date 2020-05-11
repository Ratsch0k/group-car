import React from 'react';
import {render} from '@testing-library/react';
import UserAvatar from './UserAvatar';
import '@testing-library/jest-dom/extend-expect';

it('renders without userId', () => {
  const {container} = render(<UserAvatar />);
  expect(container).toMatchSnapshot();
});

it('renders with given userId', () => {
  const userId = 12;
  const {container} = render(<UserAvatar userId={userId} />);

  expect(container).toMatchSnapshot();
  expect(container.getElementsByTagName('img')[0])
      .toHaveAttribute('src', `/api/user/${userId}/profile-pic`);
});
