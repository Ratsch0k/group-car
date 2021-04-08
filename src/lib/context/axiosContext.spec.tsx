import React from 'react';
import axios from 'axios';
import {render} from '@testing-library/react';
import AxiosProvider, { AxiosContext } from './axiosContext';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const token = 'TOKEN';

beforeEach(() => {
  mockedAxios.CancelToken.source = jest.fn().mockReturnValue({
    source: jest.fn().mockReturnValue({
      token: 'TEST',
    }) as any,
  });
});

it('gets xsrf token and creates an instance which uses that token', async () => {
  mockedAxios.head.mockResolvedValue({headers: {'xsrf-token': token}});
  mockedAxios.create.mockReturnValue(mockedAxios);
  let axiosPromiseTest;

  render(
  <AxiosProvider>
      <AxiosContext.Consumer>
        {({axios}) => {
          axiosPromiseTest = axios;
          return (
            <div>TEST</div>
          )
        }}
      </AxiosContext.Consumer>
    </AxiosProvider>
  );

  await axiosPromiseTest;

  expect(mockedAxios.head).toHaveBeenCalledTimes(2);
  expect(mockedAxios.head).toHaveBeenCalledWith('/auth');

  expect(mockedAxios.create).toHaveBeenCalledTimes(2);
  expect(mockedAxios.create).toHaveBeenCalledWith({headers: {'xsrf-token': token}});
});
