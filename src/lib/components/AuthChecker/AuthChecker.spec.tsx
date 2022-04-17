import React from 'react';
import {act, waitFor} from '@testing-library/react';
import testRender from '../../../__test__/testRender';
import mockedAxios from '../../../__test__/mockAxios';
import AuthChecker from '../AuthChecker/AuthChecker';


describe('AuthChecker', () => {
    it('dispatches checkLoggedIn action', async () => {
      const state = {
        auth: {
          user: undefined,
        },
      };

      const {store} = testRender(
        state,
        <AuthChecker />,
      );

      const expectedAction = {
        type: 'auth/checkLoggedIn/pending',
        payload: undefined,
        meta: expect.anything(),
      };

      await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
    });

    describe('reacts to AxiosErrors', () => {

      describe('if response is NotLoggedInError', () => {
        it(
          'and user is logged in, dispatches reset auth state action',
          async () => {
          const state = {
            auth: {
              user: {
                username: 'TEST USER',
                id: 1,
              },
            },
          };

          // Get error handler
          let errorHandler;
          mockedAxios.interceptors.response.use = jest.fn().mockImplementation((_, fn) => {
            errorHandler = fn;
          });

          let store;
          act(() => {
            ({store} = testRender(
              state,
              <AuthChecker />,
            ));
          })
    
          const fakeError = {
            response: {
              data: {
                detail: {
                  errorName: 'NotLoggedInError',
                },
              }
            }
          }

            let errorThrown = false;
          await act((async () => {
            try {
              await errorHandler(fakeError);
            } catch {
              errorThrown = true;
            }
          }));
          expect(errorThrown).toBeTruthy();

          const expectedAction = {
            type: 'auth/reset',
            payload: undefined,
          };
          
          const actions = store.getActions();
          expect(actions).toContainEqual(expectedAction);
        });

        it('and user is not logged in, do nothing', async() => {
          const state = {
            auth: {
              user: undefined,
            },
          };

          // Get error handler
          let errorHandler;
          mockedAxios.interceptors.response.use = jest.fn().mockImplementation((_, fn) => {
            errorHandler = fn;
          });

          const {store} = testRender(
            state,
            <AuthChecker />,
          );
    
          const fakeError = {
            response: {
              data: {
                detail: {
                  errorName: 'NotLoggedInError',
                },
              }
            }
          }

          let errorThrown = false;
          await act(async () => {
            try {
              await errorHandler(fakeError);
            } catch {
              errorThrown = true;
            }
          });
          expect(errorThrown).toBeTruthy();

          const notExpectedAction = {
            type: 'auth/reset',
            payload: undefined,
          };
          
          const actions = store.getActions();
          expect(actions).not.toContainEqual(notExpectedAction);
        });
      });

      it('if not NotLoggedInError, do nothing', async () => {
        const state = {
          auth: {
            user: undefined,
          },
        };

        // Get error handler
        let errorHandler;
        mockedAxios.interceptors.response.use = jest.fn().mockImplementation((_, fn) => {
          errorHandler = fn;
        });

        const {store} = testRender(
          state,
          <AuthChecker />,
        );
  
        const fakeError = {
          response: {
            data: {
              detail: {
                errorName: 'OtherError',
              },
            }
          }
        }

        let errorThrown = false;
        await act(async () => {
          try {
            await errorHandler(fakeError);
          } catch {
            errorThrown = true;
          }
        });
        expect(errorThrown).toBeTruthy();

        const notExpectedAction = {
          type: 'auth/reset',
          payload: undefined,
        };
        
        const actions = store.getActions();
        expect(actions).not.toContainEqual(notExpectedAction);
      });
    })

});