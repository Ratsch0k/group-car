import { render } from "@testing-library/react"
import CreateGroupForm from "./CreateGroupForm";
import React from "react";

it('renders without crashing', () => {
  render(
    <CreateGroupForm />
  );
})

it('matches snapshot', () => {
  const {baseElement} = render(
    <CreateGroupForm />
  );

  expect(baseElement).toMatchSnapshot();
})