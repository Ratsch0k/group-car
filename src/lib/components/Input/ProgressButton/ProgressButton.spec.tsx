import React from 'react';
import ProgressButton from './ProgressButton';
import {screen, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('renders without crashing', () => {
  render(<ProgressButton />);
});

it('renders with button disabled and circular progress if loading', () => {
  const {container} = render(<ProgressButton loading={true} />);
  expect(screen.getByRole('button')).toHaveAttribute('disabled');
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

it('renders with button not disabled ' +
    'and with no pr ogress if not loading', () => {
  const {container} = render(<ProgressButton loading={false} />);
  expect(screen.getByRole('button')).not.toHaveAttribute('disabled');
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(container).toMatchSnapshot();
});
