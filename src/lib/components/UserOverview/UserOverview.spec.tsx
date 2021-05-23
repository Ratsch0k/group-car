import React from 'react';
import mockedAxios from '../../../__test__/mockAxios';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import UserOverview from './UserOverview';
import testRender from '../../../__test__/testRender';


it('renders and matches snapshot when user is not logged in', () => {
  const state = {
    auth: {
      user: null,
      loading: false,
    },
  };

  const {container, store} = testRender(
    state,
    <UserOverview />
  );

  expect(container).toMatchSnapshot();
  expect(store.getActions()).toHaveLength(1);
});

it('renders and matches snapshot when user is logged in', () => {
  const fakeUser = {
    id: 12,
    username: 'TEST',
    email: 'TEST@mail.com',
    isBetaUser: false,
  };

  const state = {
    auth: {
      user: fakeUser,
      loading: false,
    },
  };

  const {container, store} = testRender(
    state,
    <UserOverview />,
  );

  expect(container).toMatchSnapshot();
  expect(store.getActions()).toHaveLength(1);
});

it('logout calls props.onClose and dispatches logout action', async () => {
  const fakeUser = {
    id: 12,
    username: 'TEST',
    email: 'TEST@MAIL.COM',
    isBetaUser: false,
  };

  const onClose = jest.fn();

  const state = {
    auth: {
      user: fakeUser,
      loading: false,
    },
  };

  mockedAxios.put = jest.fn().mockResolvedValue({data: undefined});

  const {store} = testRender(
    state,
    <UserOverview onClose={onClose}/>
  );

  fireEvent.click(screen.getByTestId('logout-button'));

  const pendingAction = {
    type: 'auth/logout/pending',
    payload: undefined,
    meta: {
      arg: undefined,
      requestStatus: expect.any(String),
      requestId: expect.any(String),
    },
  };
  const fulfilledAction = {
    type: 'auth/logout/fulfilled',
    payload: undefined,
    meta: {
      arg: undefined,
      requestStatus: expect.any(String),
      requestId: expect.any(String),
    },
  };


  await waitFor(() => expect(store.getActions()).toContainEqual(fulfilledAction));
  expect(store.getActions()).toContainEqual(pendingAction);
  expect(mockedAxios.put).toBeCalledTimes(1);
  expect(mockedAxios.put).toBeCalledWith('/auth/logout');
  expect(onClose).toHaveBeenCalled();
});
