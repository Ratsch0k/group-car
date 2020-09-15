import React from 'react';
import { render } from "@testing-library/react";
import TabPanel from "./TabPanel";

it('renders children if visible is true', () => {
  const screen = render(
    <TabPanel visible id='test tabpanel' aria-labelledby='test tab'>
      <span>THIS IS JUST A TEST</span>
    </TabPanel>
  );

  expect(screen.baseElement).toMatchSnapshot();
});

it('doesn\'t render children if visible is false', () => {
  const screen = render(
    <TabPanel visible={false} id='test tabpanel' aria-labelledby='test tab'>
      <span>TEST</span>
    </TabPanel>
  );

  expect(screen.baseElement).toMatchSnapshot();
  expect(screen.queryByText('TEST')).toBeFalsy();
});