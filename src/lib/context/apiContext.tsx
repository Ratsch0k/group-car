import React, {useCallback} from 'react';
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
ApiContext.displayName = 'ApiContext';

/**
 * Provider for the `ApiContext`.
 */
export const ApiProvider: React.FC = (props) => {
  const {axios} = useAxios();
  let api = apiCalls;

  const wrapCall = useCallback(<T extends unknown>(call: T): T => {
    return ((...params: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        axios!.then((axios) =>
          (call as (...params: unknown[]) => T)(...params, axios)) as T) as T;
    // eslint-disable-next-line
  }, [axios]);

  const _api: {[index: string]: unknown} = {};
  for (const [name, call] of Object.entries(apiCalls)) {
    _api[name] = wrapCall(call);
  }

  api = _api as unknown as Api;

  return (
    <ApiContext.Provider value={api}>
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
