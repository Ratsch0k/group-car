import '../../__test__/mockAxios';
import '../../__test__/mockI18n';
import React from 'react';
import testRender from '../../__test__/testRender';
import { waitFor, screen, fireEvent } from "@testing-library/react";
import SnackbarProvider, { SnackbarContext, SnackbarType } from "./snackbarContext";
import { Button } from '@material-ui/core';
import {act} from "react-dom/test-utils";

describe('show snackbar with type', () => {
  ['success', 'warning', 'error', 'info'].forEach((type) => {
    [true, false].forEach((withClose) => {
      describe(`${type} and withClose set to `, () => {
        it(`${withClose} is rendered correctly`, async () => {
          let renderCount = 0;
          let showSnack: SnackbarContext['show'];

          const {baseElement} = testRender(
            undefined,
            <SnackbarProvider>
              <SnackbarContext.Consumer>
                {({show}) => {
                  if (renderCount == 0) {
                    showSnack = show;
                  }
                  renderCount++;
                  

                  return (
                    <div>{type}</div>
                  );
                }}
              </SnackbarContext.Consumer>
            </SnackbarProvider>
          );

          act(() => {
            showSnack({
              type: type as SnackbarType,
              withClose,
              content: 'SNACKBAR',
            });
          });

          await waitFor(() => expect(screen.queryByText('SNACKBAR')).toBeDefined());
          
          expect(baseElement).toMatchSnapshot();
        });
      });
    });
  });
});


it('click on close closes the snackbar', async () => {
  let renderCount = 0;
  let showSnack: SnackbarContext['show'];

  const {baseElement} = testRender(
    undefined,
    <SnackbarProvider>
      <SnackbarContext.Consumer>
        {({show}) => {
          if (renderCount == 0) {
            showSnack = show;
          }
          renderCount++;
          

          return (
            <div>TEST</div>
          );
        }}
      </SnackbarContext.Consumer>
    </SnackbarProvider>
  );

  act(() => {
    showSnack({
      type: 'info',
      withClose: true,
      content: 'SNACKBAR',
    });
  });

  await waitFor(() => expect(screen.queryByText('SNACKBAR')).toBeDefined());
  expect(baseElement.querySelector('button')).toBeDefined();
  expect(baseElement).toMatchSnapshot();
  fireEvent.click(baseElement.querySelector('button')!);

  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  expect(baseElement).toMatchSnapshot();
});

it('renders action correctly', async () => {
  let renderCount = 0;
  let showSnack: SnackbarContext['show'];

  const {baseElement} = testRender(
    undefined,
    <SnackbarProvider>
      <SnackbarContext.Consumer>
        {({show}) => {
          if (renderCount == 0) {
            showSnack = show;
          }
          renderCount++;
          

          return (
            <div>TEST</div>
          );
        }}
      </SnackbarContext.Consumer>
    </SnackbarProvider>
  );

  act(() => {
    showSnack({
      type: 'info',
      withClose: true,
      content: 'SNACKBAR',
      action: (
        <Button>
          BUTTON
        </Button>
      ),
    });
  });

  await waitFor(() => expect(screen.queryByText('BUTTON')).toBeDefined());
  expect(baseElement).toMatchSnapshot();
});
