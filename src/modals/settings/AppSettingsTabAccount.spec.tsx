import "../../__test__/mockAxios";
import {RootState} from "../../lib/redux/store";
import testRender from "../../__test__/testRender";
import AppSettingsTabAccount from "./AppSettingsTabAccount";

describe('AppSettingsTabAccount', () => {
  let state: Partial<RootState>;

  beforeEach(() => {
    state = {
      auth: {
        user: {
          id: 1,
          username: 'test',
          email: 'test@mail.com',
          createdAt: new Date(10),
          updatedAt: new Date(10),
        }
      }
    }
  });

  it('renders correctly', () => {
    let {baseElement} = testRender(
      state,
      <AppSettingsTabAccount index='/settings/account' value='/settings/account' />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});