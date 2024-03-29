import axios, {AxiosResponse} from 'axios';

const csrfPromise = (() => {
  return axios.head('/auth').then((res: AxiosResponse) => {
    const csrf = res.headers['xsrf-token'];

    axios.defaults.headers.common = {
      'xsrf-token': csrf,
    };
  });
})();

const methodsToProxy = ['post', 'put', 'get', 'head', 'delete', 'options'];

methodsToProxy.forEach((method) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const origMethod = (axios as any)[method];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any)[method] = (...args: any[]) => {
    if (
      args.length > 1 &&
      typeof args[1] === 'object' &&
      args[1].allowUnauthenticated
    ) {
      return origMethod(...args);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return csrfPromise.then(() => origMethod(...args));
    }
  };
});

export default axios;
