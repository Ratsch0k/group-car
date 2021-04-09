import { InvitesContext, InviteWithGroupAndInviteSender, ModalContext } from "../../lib";
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { ThemeProvider } from "@material-ui/core";
import React from "react";
import Invites from './Invites';
import theme from '../../__test__/testTheme';

describe('Invites modal', () => {
  const customRender = (
    ui: JSX.Element,
    inviteContext: InvitesContext,
    modalContext: ModalContext,
  ) => {
    return render(
      <ThemeProvider theme={theme}>
        <ModalContext.Provider value={modalContext}>
          <InvitesContext.Provider value={inviteContext}>
            {ui}
          </InvitesContext.Provider>
        </ModalContext.Provider>
      </ThemeProvider>
    );
  };
  let inviteContext: InvitesContext;
  let modalContext: ModalContext;
  let invites: InviteWithGroupAndInviteSender[];

  beforeEach(() => {
    invites = [
      {
        groupId: 1,
        userId: 1,
        Group: {
          name: 'group-1'
        },
        InviteSender: {
          username: 'invite-sender-1'
        },
      },
      {
        groupId: 2,
        userId: 1,
        Group: {
          name: 'group-2',

        },
        InviteSender: {
          username: 'invite-sender-2'
        },
      },
    ] as unknown as InviteWithGroupAndInviteSender[];

    inviteContext = {
      invites,
      refresh: jest.fn(),
      deleteInvite: jest.fn(),
      acceptInvite: jest.fn(),
    };

    modalContext = {
      close: jest.fn(),
      goTo: jest.fn(),
      route: '/invites',
      modalLocation: undefined as any,
    };
  });

  it('renders list of invites correctly', () => {
    const {baseElement} = customRender(
      <Invites />,
      inviteContext,
      modalContext,
    );

    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(invites.length);
    expect(baseElement).toMatchSnapshot();
  });

  it('accept button accepts the invite', async () => {
    (inviteContext.acceptInvite as jest.Mock).mockResolvedValue(undefined);

    const {baseElement} = customRender(
      <Invites />,
      inviteContext,
      modalContext,
    );

    expect(screen.queryAllByText('misc.invitedBy')).toHaveLength(invites.length);

    fireEvent.click(baseElement.querySelector(`#invite-${invites[0].groupId}-accept-btn`));

    await waitFor(() => expect(inviteContext.acceptInvite).toHaveBeenCalledTimes(1));
    expect(inviteContext.acceptInvite).toHaveBeenCalledWith(invites[0].groupId);
  });
});
