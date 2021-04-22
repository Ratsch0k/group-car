import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {ModalContext} from '../../ModalRouter/ModalRouteContext';
import { MemoryRouter } from 'react-router-dom';
import testRender from '../../../__test__/testRender';
import AuthChecker from '../AuthChecker/AuthChecker';


describe('AuthChecker', () => {
  const fakeUser = {
    username: 'TEST',
    email: 'TEST',
    isBetaUser: false,
    id: 10,
  };
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
        it('and user is logged in, reset auth state');

        it('and user is not logged in');
      });

      it('if not NotLoggedInError, do nothing');
    })

});