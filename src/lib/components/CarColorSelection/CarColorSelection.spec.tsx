import '../../../__test__/mockAxios';
import '../../../__test__/mockI18n';
import { render, screen } from "@testing-library/react";
import { CarColor } from "../..";
import CarColorSelection from "./CarColorSelection";
import React from 'react';
import userEvent from "@testing-library/user-event";

it('renders correctly', () => {
  const setColor = jest.fn();

  const {baseElement} = render(
    <CarColorSelection
      availableColors={Object.values(CarColor)}
      setColor={setColor}
    />
  );

  expect(setColor).not.toHaveBeenCalled();
  expect(baseElement).toMatchSnapshot();
});

it('clicking it opens selection of available colors', () => {
  const setColor = jest.fn();

  const {baseElement} = render(
    <CarColorSelection
      availableColors={Object.values(CarColor)}
      setColor={setColor}
    />
  );

  userEvent.click(screen.getByText('misc.color.Red'));
  expect(baseElement).toMatchSnapshot();
});

it('clicking a color in the selection calls the setColor ' +
'callback and closes selection', () => {
  const setColor = jest.fn();

  const {baseElement} = render(
    <CarColorSelection
      availableColors={Object.values(CarColor)}
      setColor={setColor}
    />
  );

  userEvent.click(screen.getByText('misc.color.Red'));
  
  userEvent.click(screen.getByText('misc.color.Green'));

  expect(setColor).toHaveBeenCalledWith(CarColor.Green);
  expect(setColor).toHaveBeenCalledTimes(1);
  expect(baseElement).toMatchSnapshot();
});