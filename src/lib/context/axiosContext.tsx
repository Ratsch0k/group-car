import axios, {AxiosInstance} from 'axios';
import React from 'react';

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

/**
 * Element which provides the axios context.
 * @param props Only children.
 */
export const AxiosProvider: React.FC = (props) => {
  const csrfSource = axios.CancelToken.source();

  const axiosPromise = axios.head('/auth', {
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

    return axiosInstance;
  });

  return (
    <AxiosContext.Provider value={{
      axios: axiosPromise,
    }}>
      {props.children}
    </AxiosContext.Provider>
  );
};
