import { render } from "@testing-library/react";
import MenuItemToSubMenu from "./MenuItemToSubMenu";
import React from "react";

it('renders without crashing', () => {
  render(
    <MenuItemToSubMenu>
      TEST
    </MenuItemToSubMenu>
  )
});

it('matches snapshot', () => {
  const screen = render(
    <MenuItemToSubMenu>
      TEST
    </MenuItemToSubMenu>
  );

  expect(screen.baseElement).toMatchSnapshot();
});