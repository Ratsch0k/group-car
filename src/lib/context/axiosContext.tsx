import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {RestError, useSnackBar} from 'lib';
import React, {useCallback, useEffect, useState} from 'react';

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
  const {show} = useSnackBar();
  const [csrf, setCsrf] = useState<string | null>(null);
  const handleAuthResponse = useCallback((res: AxiosResponse) => {
    const csrf = res.headers['xsrf-token'];

    if (!csrf) {
      throw new Error('Couldn\'t get csrf token');
    }

    setCsrf(csrf);

    const axiosInstance = axios.create({
      headers: {
        'xsrf-token': csrf,
      },
    });

    axiosInstance.interceptors.response.use(
      (res) => res,
      (e: AxiosError<RestError>) => {
        if (e.response &&
              !e.response.config.url?.includes('/auth/token')
        ) {
          show({
            type: 'error',
            content: e.response?.data.message,
            withClose: true,
          });
        }

        if (e.response &&
            e.response.data.detail &&
            e.response.data.detail.errorName === 'NotLoggedInError'
        ) {
          setCsrf(null);
        }

        return Promise.reject(e);
      });

    return axiosInstance;
  }, [show]);

  const axiosPromiseCallback = useCallback(() => {
    return axios.head('/auth').then(handleAuthResponse);
  }, [handleAuthResponse]);

  const [axiosPromise, setAxiosPromise] = useState<Promise<AxiosInstance>>(
    axiosPromiseCallback,
  );

  useEffect(() => {
    if (!csrf) {
      setAxiosPromise(axiosPromiseCallback);
    }
  }, [csrf, axiosPromiseCallback]);

  return (
    <AxiosContext.Provider value={{
      axios: axiosPromise,
    }}>
      {props.children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
