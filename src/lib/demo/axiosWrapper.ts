/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {Axios, AxiosError, AxiosResponse} from 'axios';
import DemoServer from './demoServer';

/**
 * Wraps axios and redirects requests to local server.
 */
class AxiosWrapper {
  /**
   * List of http methods to wrap
   */
  private readonly METHODS_TO_WRAP = [
    'head',
    'options',
    'get',
    'put',
    'post',
    'delete',
  ];

  private requestDelay = 200;

  private server: DemoServer;

  /**
   * List of response interceptors
   */
  private responseInterceptor: Array<{
    onSuccess: (res: AxiosResponse) => any,
    onFailure: (e: AxiosError) => any
  }> = [];

  /**
   * Creates instance.
   * @param server Server to redirect requests to
   * @param delay Forced delay for each request
   */
  constructor(server: DemoServer, delay?: number) {
    if (delay !== undefined) {
      this.requestDelay = delay;
    }

    this.server = server;
    this.wrapAxios(axios);
  }


  /**
   * Creates a request handler for a given axios request method
   * @param method Method that is wrapped
   * @returns Request handler for the given method
   */
  createAxiosRequestHandler(method: string): any {
    return async (...params: any) => {
      const [path, data] = params;

      const synthesizedRequest = new Promise((resolve, reject) => {
        try {
          let response = this.server.handleRequest(method, path, data);

          setTimeout(() => {
            // Sequentially call all onSuccess interceptors and modify response
            for (
              const onSuccess of this.responseInterceptor.map((val) =>
                val.onSuccess)
            ) {
              response = onSuccess(response);
            }

            // Resolve with final response
            resolve(response);
          }, this.requestDelay);
        } catch (e: any) {
          setTimeout(async () => {
            // Sequentially call all onFailure interceptor and modify error
            // If any interceptor doesn't return a rejected promise, assume
            // that request didn't fail any more and resolve.
            for (
              const onFailure of this.responseInterceptor.map((val) =>
                val.onFailure)
            ) {
              try {
                const res = await onFailure(e);
                resolve(res);
              } catch (newError) {
                reject(newError);
              }
            }
          }, this.requestDelay);
        }
      });

      return synthesizedRequest;
    };
  }

  /**
   * Wraps defined list of http methods of the given axios object.
   * @param axios Axios object to wrap
   */
  wrapAxios(axios: Axios): void {
    for (const method of this.METHODS_TO_WRAP) {
      const key = method as keyof Axios;
      axios[key] = this.createAxiosRequestHandler(method) as any;
    }

    // Override interceptors
    axios.interceptors.response.use = (onSuccess: any, onFailure: any) =>
      this.responseInterceptor.push(({onSuccess, onFailure}));
  }
}

export default AxiosWrapper;
