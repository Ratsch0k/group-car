import React from 'react';
import DrawerFooter from './DrawerFooter';
import testRender from '../../../../__test__/testRender';

it('renders without crashing', () => {
  testRender(
    {},
    <DrawerFooter />
    );
});

it('matches snapshot', () => {
  const {container} = testRender(
    {},
    <DrawerFooter />
  );

  expect(container).toMatchSnapshot();
});
