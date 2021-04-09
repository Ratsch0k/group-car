import { render } from '@testing-library/react';
import MenuIconItem from "./MenuIconItem";
import React from "react";
import { ThemeProvider, MenuItem } from '@material-ui/core';
import theme from '../../../__test__/testTheme';
import AddIcon from '@material-ui/icons/Add'

it('renders without crashing', () => {
  render(
    <ThemeProvider theme={theme}>
      <MenuIconItem>
      TEST
      </MenuIconItem>
    </ThemeProvider>
  );
});

it('matches MenuItem if no property provided', () => {
  const {container} = render(
    <ThemeProvider theme={theme}>
      <MenuIconItem>
        TEST
      </MenuIconItem>
    </ThemeProvider>
  );
  
  expect(container).toMatchSnapshot();
});

it('displays icon on the left if icon is provided', () => {
  const {container} = render(
    <ThemeProvider theme={theme}>
      <MenuIconItem icon={<AddIcon />}>
        TEST
      </MenuIconItem>
    </ThemeProvider>
  );
  
  expect(container).toMatchSnapshot();
});

it('shows arrow to the right if prop opensSubMenu is true', () => {
  const {container} = render(
    <ThemeProvider theme={theme}>
      <MenuIconItem opensSubMenu>
        TEST
      </MenuIconItem>
    </ThemeProvider>
  );
  
  expect(container).toMatchSnapshot();
});

it('shows arrow to the right if prop opensSubMenu is true and icon on the left if icon is provided', () => {
  const {container} = render(
    <ThemeProvider theme={theme}>
      <MenuIconItem opensSubMenu icon={<AddIcon />}>
        TEST
      </MenuIconItem>
    </ThemeProvider>
  );
  
  expect(container).toMatchSnapshot();
});