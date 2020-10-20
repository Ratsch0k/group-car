import React from 'react';
import { render, waitFor } from "@testing-library/react";
import { Api, ApiContext } from "./apiContext";
import { AuthContext } from "./authContext";
import { GroupContext } from "./groupContext";
import InvitesProvider, { InvitesContext } from './invitesContext';

describe('InvitesProvider', () =>  {
  const invites = [
    {
      groupId: 1,
      userId: 1,
    },
    {
      groupId: 2,
      userId: 1,
    },
    {
      groupId: 3,
      userId: 1,
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  const customRender = (
    ui: JSX.Element,
    authValue: AuthContext,
    apiValue: Api,
    groupValue: GroupContext,
  ) => {
    return render(
      <ApiContext.Provider value={apiValue}>
        <AuthContext.Provider value={authValue}>
          <GroupContext.Provider value={groupValue}>
            {ui}
          </GroupContext.Provider>
        </AuthContext.Provider>
      </ApiContext.Provider>
    );
  }

  it('if user is logged in sets interval to retrieve invites', async () => {
    let fakeAuth = {
      isLoggedIn: true,
    };

    const fakeApi = {
      getInvitesOfUser: jest.fn()
        .mockResolvedValue({data: {invites}}),
      acceptInvite: jest.fn().mockResolvedValue(undefined),
    };

    const fakeGroup = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    let invitesContext;

    customRender(
      <InvitesProvider>
        <InvitesContext.Consumer>
          {
            (context) => {
              invitesContext = context;
              return (
                <div>
                  {JSON.stringify(context.invites)}
                </div>
              );
            }
          }
        </InvitesContext.Consumer>
      </InvitesProvider>,
      fakeAuth as unknown as AuthContext,
      fakeApi as unknown as Api,
      fakeGroup as unknown as GroupContext
    );

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);

    await waitFor(() => expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(1));
    expect(invitesContext.invites).toEqual(invites);

    // Check that invites are retrieved again after 10 seconds
    jest.advanceTimersByTime(10000);
    expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(2);
  });

  it('deleteInvite removes specified invite from invites', async () => {
    const fakeAuth = {
      isLoggedIn: true,
    };

    const fakeApi = {
      getInvitesOfUser: jest.fn()
        .mockResolvedValue({data: {invites}}),
      acceptInvite: jest.fn().mockResolvedValue(undefined),
    };

    const fakeGroup = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    let invitesContext;

    customRender(
      <InvitesProvider>
        <InvitesContext.Consumer>
          {
            (context) => {
              invitesContext = context;
              return (
                <div>
                  {JSON.stringify(context.invites)}
                </div>
              );
            }
          }
        </InvitesContext.Consumer>
      </InvitesProvider>,
      fakeAuth as unknown as AuthContext,
      fakeApi as unknown as Api,
      fakeGroup as unknown as GroupContext
    );

    await waitFor(() => expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(1));
    expect(invitesContext.invites).toEqual(invites);

    await invitesContext.deleteInvite(invites[0].groupId);

    expect(invitesContext.invites).toHaveLength(2);
    expect(invitesContext.invites).not.toContain(invites[0]);
  });

  it('acceptInvite accepts the invite with the specified group id', async () => {
    const fakeAuth = {
      isLoggedIn: true,
    };

    const fakeApi = {
      getInvitesOfUser: jest.fn()
        .mockResolvedValue({data: {invites}}),
      acceptInvite: jest.fn().mockResolvedValue(undefined),
    };

    const fakeGroup = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    let invitesContext;

    customRender(
      <InvitesProvider>
        <InvitesContext.Consumer>
          {
            (context) => {
              invitesContext = context;
              return (
                <div>
                  {JSON.stringify(context.invites)}
                </div>
              );
            }
          }
        </InvitesContext.Consumer>
      </InvitesProvider>,
      fakeAuth as unknown as AuthContext,
      fakeApi as unknown as Api,
      fakeGroup as unknown as GroupContext
    );

    await waitFor(() => expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(1));
    expect(invitesContext.invites).toEqual(invites);

    await invitesContext.acceptInvite(invites[0].groupId);

    expect(invitesContext.invites).toHaveLength(2);
    expect(invitesContext.invites).not.toContain(invites[0]);
    expect(fakeApi.acceptInvite).toHaveBeenCalledTimes(1);
    expect(fakeApi.acceptInvite).toHaveBeenCalledWith(invites[0].groupId);
    expect(fakeGroup.update).toHaveBeenCalledTimes(1);
  });

  it('refresh reloads list of invites', async () => {
    const fakeAuth = {
      isLoggedIn: true,
    };

    const bigInviteList = [
      ...invites,
      {
        groupId: 4,
        userId: 1,
      },
    ];

    const fakeApi = {
      getInvitesOfUser: jest.fn()
        .mockResolvedValueOnce({data: {invites}})
        .mockResolvedValueOnce({data: {invites: bigInviteList}}),
      acceptInvite: jest.fn().mockResolvedValue(undefined),
    };

    const fakeGroup = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    let invitesContext;

    customRender(
      <InvitesProvider>
        <InvitesContext.Consumer>
          {
            (context) => {
              invitesContext = context;
              return (
                <div>
                  {JSON.stringify(context.invites)}
                </div>
              );
            }
          }
        </InvitesContext.Consumer>
      </InvitesProvider>,
      fakeAuth as unknown as AuthContext,
      fakeApi as unknown as Api,
      fakeGroup as unknown as GroupContext
    );

    await waitFor(() => expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(1));
    expect(invitesContext.invites).toEqual(invites);

    await invitesContext.refresh();

    expect(invitesContext.invites).toEqual(bigInviteList);
    expect(fakeApi.getInvitesOfUser).toHaveBeenCalledTimes(2);
  });
});
