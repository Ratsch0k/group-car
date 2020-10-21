import React, { useEffect } from 'react';
import { render, waitFor, screen } from "@testing-library/react";
import SnackbarProvider, { SnackbarContext, SnackbarType } from "./snackbarContext";

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
