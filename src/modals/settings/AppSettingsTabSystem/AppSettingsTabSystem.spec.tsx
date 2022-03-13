import "../../../__test__/mockAxios";
import {RootState} from "../../../lib/redux/store";
import testRender from "../../../__test__/testRender";
import AppSettingsTabSystem from "./AppSettingsTabSystem";
import mockedAxios from "../../../__test__/mockAxios";
import config from '../../../config/index';

describe('AppSettingsTabAccount', () => {
  let state: Partial<RootState>;

  beforeEach(() => {
    state = {};
    config.frontend = '1.0';
  });

  it('renders correctly', () => {
    mockedAxios.get = jest.fn().mockResolvedValueOnce({data: {backend: '1.0'}});

    let {baseElement} = testRender(
      state,
      <AppSettingsTabSystem index='/settings/account' value='/settings/account' />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});