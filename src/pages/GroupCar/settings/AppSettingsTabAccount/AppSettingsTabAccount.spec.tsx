import "../../../../__test__/mockAxios";
import '../../../../__test__/mockI18n';
import {RootState} from "../../../../lib/redux/store";
import testRender from "../../../../__test__/testRender";
import AppSettingsTabAccount from "./AppSettingsTabAccount";
import {AuthState} from "../../../../lib/redux/slices/auth";

describe('AppSettingsTabAccount', () => {
  let state: Partial<RootState>;
  let resizeObserverMock;

  beforeEach(() => {
    state = {
      auth: {
        user: {
          id: 1,
          username: 'test',
          email: 'test@mail.com',
          createdAt: new Date('December 17, 2020 03:24:00').toUTCString(),
          updatedAt: new Date('December 17, 2020 03:24:00').toUTCString(),
          isBetaUser: false,
        }
      } as AuthState,
    }

    resizeObserverMock = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.ResizeObserver = resizeObserverMock;

  });

  it('renders correctly', () => {
    let {baseElement} = testRender(
      state,
      <AppSettingsTabAccount index='/settings/account' value='/settings/account' />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});