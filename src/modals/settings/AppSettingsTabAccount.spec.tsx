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
          createdAt: new Date('December 17, 2020 03:24:00'),
          updatedAt: new Date('December 17, 2020 03:24:00'),
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