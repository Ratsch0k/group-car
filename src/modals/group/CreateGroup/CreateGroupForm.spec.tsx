import CreateGroupForm from "./CreateGroupForm";
import React from "react";
import testRender from "../../../__test__/testRender";

it('renders without crashing', () => {
  testRender(
    {},
    <CreateGroupForm />
  );
})

it('matches snapshot', () => {
  const {baseElement} = testRender(
    {},
    <CreateGroupForm />,
  );

  expect(baseElement).toMatchSnapshot();
});