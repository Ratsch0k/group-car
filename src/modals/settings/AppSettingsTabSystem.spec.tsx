import "../../__test__/mockAxios";
import {RootState} from "../../lib/redux/store";
import testRender from "../../__test__/testRender";
import AppSettingsTabSystem from "./AppSettingsTabSystem";
import mockedAxios from "../../__test__/mockAxios";

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        languages: ['de', 'en'],
        language: 'de',
      }
    };
  },
}));

describe('AppSettingsTabAccount', () => {
  let state: Partial<RootState>;

  beforeEach(() => {
    state = {};
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