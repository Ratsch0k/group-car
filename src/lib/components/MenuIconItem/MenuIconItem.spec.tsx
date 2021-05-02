import testRender from '../../../__test__/testRender';
import '../../../__test__/mockAxios';
import MenuIconItem from "./MenuIconItem";
import React from "react";
import AddIcon from '@material-ui/icons/Add'

it('renders without crashing', () => {
  testRender(
    {},
      <MenuIconItem>
      TEST
      </MenuIconItem>
  );
});

it('matches MenuItem if no property provided', () => {
  const {container} = testRender(
    {},
      <MenuIconItem>
        TEST
      </MenuIconItem>
  );
  
  expect(container).toMatchSnapshot();
});

it('displays icon on the left if icon is provided', () => {
  const {container} = testRender(
    {},
      <MenuIconItem icon={<AddIcon />}>
        TEST
      </MenuIconItem>
  );
  
  expect(container).toMatchSnapshot();
});

it('shows arrow to the right if prop opensSubMenu is true', () => {
  const {container} = testRender(
    {},
      <MenuIconItem opensSubMenu>
        TEST
      </MenuIconItem>
  );
  
  expect(container).toMatchSnapshot();
});

it('shows arrow to the right if prop opensSubMenu is true and icon on the left if icon is provided', () => {
  const {container} = testRender(
    {},
      <MenuIconItem opensSubMenu icon={<AddIcon />}>
        TEST
      </MenuIconItem>
  );
  
  expect(container).toMatchSnapshot();
});