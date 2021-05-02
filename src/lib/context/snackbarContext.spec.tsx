import '../../../__test__/mockAxios';
import React from 'react';
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import SnackbarProvider, { SnackbarContext, SnackbarType } from "./snackbarContext";
import { Button } from '@material-ui/core';

describe('show snackbar with type', () => {
  ['success', 'warning', 'error', 'info'].forEach((type) => {
    [true, false].forEach((withClose) => {
      describe(`${type} and withClose set to `, () => {
        it(`${withClose} is rendered correctly`, async () => {
          let renderCount = 0;

          const {baseElement} = render(
            <SnackbarProvider>
              <SnackbarContext.Consumer>
                {({show}) => {
                  if (renderCount == 0) {
                    show({
                      type: type as SnackbarType,
                      withClose,
                      content: 'SNACKBAR',
                    });
                  }
                  renderCount++;
                  

                  return (
                    <div>{type}</div>
                  );
                }}
              </SnackbarContext.Consumer>
            </SnackbarProvider>
          );

          await waitFor(() => expect(screen.queryByText('SNACKBAR')).toBeDefined());
          
          expect(baseElement).toMatchSnapshot();
        });
      });
    });
  });
});


it('click on close closes the snackbar', async () => {
  let renderCount = 0;

  const {baseElement} = render(
    <SnackbarProvider>
      <SnackbarContext.Consumer>
        {({show}) => {
          if (renderCount == 0) {
            show({
              type: 'info',
              withClose: true,
              content: 'SNACKBAR',
            });
          }
          renderCount++;
          

          return (
            <div>TEST</div>
          );
        }}
      </SnackbarContext.Consumer>
    </SnackbarProvider>
  );

  await waitFor(() => expect(screen.queryByText('SNACKBAR')).toBeDefined());
  expect(baseElement.querySelector('button')).toBeDefined();
  expect(baseElement).toMatchSnapshot();
  fireEvent.click(baseElement.querySelector('button'));

  await waitFor(() => expect(screen.queryByText('SNACKBAR')).toBeNull());
  expect(baseElement).toMatchSnapshot();
});

it('renders action correctly', async () => {
  let renderCount = 0;

  const {baseElement} = render(
    <SnackbarProvider>
      <SnackbarContext.Consumer>
        {({show}) => {
          if (renderCount == 0) {
            show({
              type: 'info',
              withClose: true,
              content: 'SNACKBAR',
              action: (
                <Button>
                  BUTTON
                </Button>
              ),
            });
          }
          renderCount++;
          

          return (
            <div>TEST</div>
          );
        }}
      </SnackbarContext.Consumer>
    </SnackbarProvider>
  );

  await waitFor(() => expect(screen.queryByText('BUTTON')).toBeDefined());
  expect(baseElement).toMatchSnapshot();
});
