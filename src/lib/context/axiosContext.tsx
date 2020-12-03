import axios, {AxiosError, AxiosInstance} from 'axios';
import {RestError, useSnackBar} from 'lib';
import React, {useRef} from 'react';

/**
 * Context for the axios context.
 */
export interface AxiosContext {
  /**
   * The axios instance.
   */
  axios: Promise<AxiosInstance>;
}

/**
 * Default axios context.
 */
export const AxiosContext = React.createContext<AxiosContext>({
  axios: Promise.resolve(axios.create()),
});
AxiosContext.displayName = 'AxiosContext';

/**
 * Element which provides the axios context.
 * @param props Only children.
 */
export const AxiosProvider: React.FC = (props) => {
  const csrfSource = axios.CancelToken.source();
  const {show} = useSnackBar();
  const axiosPromise = useRef<Promise<AxiosInstance>>(axios.head('/auth', {
    cancelToken: csrfSource.token,
  }).then((res) => {
    const csrf = res.headers['xsrf-token'];

    if (!csrf) {
      throw new Error('Couldn\'t get csrf token');
    }

    const axiosInstance = axios.create({
      headers: {
        'xsrf-token': csrf,
      },
    });

    axiosInstance.interceptors.response.use(
        (res) => res,
        (e: AxiosError<RestError>) => {
          if (e.response && !e.response.config.url?.includes('/auth/token')) {
            show({
              type: 'error',
              content: e.response?.data.message,
              withClose: true,
            });
          }

          return Promise.reject(e);
        });

    return axiosInstance;
  }));

  return (
    <AxiosContext.Provider value={{
      axios: axiosPromise.current,
    }}>
      {props.children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
