import mockedAxios from '../../__test__/mockAxios';
import { InviteWithGroupAndInviteSender } from "../../lib";
import {fireEvent, screen, waitFor} from '@testing-library/react';
import React from "react";
import Invites from './Invites';
import testRender from "../../__test__/testRender";
import { RootState } from "../../lib/redux/store";

describe('Invites modal', () => {
  let state: Partial<RootState>;
  let invites: InviteWithGroupAndInviteSender[];

  beforeEach(() => {
    invites = [
      {
        groupId: 1,
        userId: 1,
        Group: {
          id: 1,
          name: 'group-1',
          description: 'TEST',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: 10,
          Owner: {
            username: 'OWNER',
            id: 10,
          },
        },
        invitedBy: 10,
        InviteSender: {
          username: 'invite-sender-1',
          id: 10,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupId: 2,
        userId: 1,
        Group: {
          id: 2,
          name: 'group-2',
          description: 'TEST',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: 10,
          Owner: {
            username: 'OWNER',
            id: 10,
          },
        },
        invitedBy: 10,
        InviteSender: {
          username: 'invite-sender-2',
          id: 10,

        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    state = {
      invites: {
        ids: invites.map((i) => i.groupId),
        entities: invites.reduce((l, n) => ({...l, [n.groupId]: n}), {}),
        loading: false,
      },
      auth: {
        user: {
          username: 'user',
          id: 1,
        },
        signUpRequestSent: false,
        loading: false,
      },
      group: {
        ids: [],
        entities: [],
        selectedGroup: null,
        loading: false,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of invites correctly', () => {
    const {baseElement} = testRender(
      state,
      <Invites />,
    );

    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(invites.length);
    expect(baseElement).toMatchSnapshot();
  });

  it('accept button dispatches acceptInvite action', async () => {
    mockedAxios.post = jest.fn().mockResolvedValue({data: undefined});
    mockedAxios.get = jest.fn().mockResolvedValue({data: {groups: []}});

    const {baseElement, store} = testRender(
      state,
      <Invites />,
    );

    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(invites.length);

    fireEvent.click(baseElement.querySelector(`#invite-${invites[0].groupId}-accept-btn`));

    const expectedPendingAction = {
      type: 'invites/acceptInvite/pending',
      payload: undefined,
      meta: {
        arg: invites[0].groupId,
        requestStatus: expect.any(String),
        requestId: expect.any(String),
      },
    };
    const expectedFulfilledAction = {
      type: 'invites/acceptInvite/fulfilled',
      payload: undefined,
      meta: {
        arg: invites[0].groupId,
        requestStatus: expect.any(String),
        requestId: expect.any(String),
      },
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
    expect(store.getActions()).toContainEqual(expectedPendingAction);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/user/invite/${invites[0].groupId}/join`);
  });
});
