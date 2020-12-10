import React, {useCallback, useEffect, useMemo, useState} from 'react';
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

  const wrapCall = useCallback(<T extends unknown>(call: T): T => {
    return ((...params: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        axios!.then((axios) =>
          (call as (...params: unknown[]) => T)(...params, axios)) as T) as T;
    // eslint-disable-next-line
  }, [axios]);

  const wrapApi = useMemo(() => {
    const _api: {[index: string]: unknown} = {};
    for (const [name, call] of Object.entries(apiCalls)) {
      _api[name] = wrapCall(call);
    }

    return _api as unknown as Api;
  }, [wrapCall]);

  const [api, setApi] = useState<Api>(wrapApi);

  useEffect(() => {
    setApi(wrapApi);
  }, [wrapApi]);

  return (
    <ApiContext.Provider value={api}>
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
