import React, {useState, useEffect, useCallback} from 'react';
import {useAxios} from 'lib';
import * as apiCalls from '../api';

/**
 * Api calls.
 */
export type Api = typeof apiCalls;

/**
 * Default api context.
 */
export const ApiContext = React.createContext<Api>(apiCalls);

/**
 * Provider for the `ApiContext`.
 */
export const ApiProvider: React.FC = (props) => {
  const {axios} = useAxios();
  const [api, setApi] = useState<Api>(apiCalls);

  const wrapCall = useCallback(<T extends unknown>(call: T): T => {
    return ((...params: unknown[]) =>
        axios.then((axios) =>
          (call as (...params: unknown[]) => T)(...params, axios)) as T) as T;
    // eslint-disable-next-line
  }, [axios]);

  useEffect(() => {
    const _api: {[index: string]: unknown} = {};
    for (const [name, call] of Object.entries(apiCalls)) {
      _api[name] = wrapCall(call);
    }

    setApi(_api as unknown as Api);
  }, [wrapCall]);

  return (
    <ApiContext.Provider value={api}>
      {props.children}
    </ApiContext.Provider>
  );
};
