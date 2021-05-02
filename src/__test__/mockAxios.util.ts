jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.head.mockImplementationOnce((path: string) => {
  if (path === '/auth') {
    return Promise.resolve({
      headers: {
        'xsrf-token': 'TEST TOKEN',
      },
    });
  }
});

export default mockedAxios;
