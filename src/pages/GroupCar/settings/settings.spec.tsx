import '../../../__test__/mockAxios';
import testRender from "../../../__test__/testRender";
import {RootState} from "../../../lib/redux/store";
import {User} from "../../typings";
import AppSettings from "./settings";
import history from "../../../lib/redux/history";
import { Route } from "react-router-dom";
import {fireEvent} from "@testing-library/react";
import {CALL_HISTORY_METHOD} from "connected-react-router";

describe('Settings modal', () => {
  let state: Partial<RootState>;
  let user: User;
  let resizeObserverMock;

  beforeEach(() => {
    user = {
      username: 'test',
      id: 1,
      email: 'test@mail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      isBetaUser: false,
    };

    resizeObserverMock = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.ResizeObserver = resizeObserverMock;

    history.location.pathname = '/settings';
    history.push('/settings');

    state = {
      auth: {
        user,
        signUpRequestSent: false,
        loading: false,
      },
      router: {
        location: {
          pathname: '/settings',
          state: undefined,
          search: '',
          query: {},
          hash: '',
        },
        action: 'PUSH',
      },
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly on large screens', () => {
    const {baseElement} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'lg'}
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly for medium screens', () => {
    const {baseElement} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'md'}
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly for small screens', () => {
    const {baseElement} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'xs'}
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('clicking on AppSettingsTabAccount opens AppSettingsTabAccount page', () => {
    const {store, queryByText} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'xs'}
    );

    expect(queryByText('settings.account.title')).not.toBeNull();
    fireEvent.click(queryByText('settings.account.title')!);

    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          state: {modal: '/settings/account'},
          search: 'modal=/settings/account',
        }],
        method: 'push',
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('clicking on AppSettingsTabSystem opens AppSettingsTabSystem page', () => {
    const {store, queryByText} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'xs'}
    );

    expect(queryByText('settings.system.title')).not.toBeNull();
    fireEvent.click(queryByText('settings.system.title')!);

    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          state: {modal: '/settings/system'},
          search: 'modal=/settings/system',
        }],
        method: 'push',
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('clicking back navigates back by replacing history', () => {
    history.push('/settings/account');
    state.router!.location.pathname = '/settings/account';

    const {baseElement, store} = testRender(
      state,
      <Route path='/settings'>
        <AppSettings />
      </Route>,
      {width: 'xs'}
    );

    expect(baseElement.querySelector('#settings-back-button')).not.toBeNull();
    fireEvent.click(baseElement.querySelector('#settings-back-button')!);

    const expectedAction = {
      type: CALL_HISTORY_METHOD,
      payload: {
        args: [{
          state: {modal: '/settings'},
          search: 'modal=/settings',
        }],
        method: 'replace',
      },
    };

    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it(
    'clicking back after navigating to page navigates back by going back in history',
    () => {
      const {baseElement, store, queryByText} = testRender(
        state,
        <Route path='/settings'>
          <AppSettings />
        </Route>,
        {width: 'xs'}
      );

      expect(queryByText('settings.system.title')).not.toBeNull();
      fireEvent.click(queryByText('settings.system.title')!);
      history.push('/settings/account'); // Manually change history
      expect(baseElement.querySelector('#settings-back-button')).not.toBeNull();
      fireEvent.click(baseElement.querySelector('#settings-back-button')!);

      const expectedAction = {
        type: CALL_HISTORY_METHOD,
        payload: {
          args: [],
          method: 'goBack',
        },
      };

      expect(store.getActions()).toContainEqual(expectedAction);
  });
});