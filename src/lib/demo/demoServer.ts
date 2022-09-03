/* eslint-disable-next-line */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion, @typescript-eslint/explicit-module-boundary-types */
import {AxiosResponse} from 'axios';
import DemoServerModel, {
  HandlerResponse,
  HandlerResponseObject,
} from './demoServerModel';

interface StatusMap {
  [index: number]: string;
}

/**
 * Local demo server.
 * Handles requests.
 */
class DemoServer {
  private model = new DemoServerModel();

  /**
   * Default header.
   * For now not used
   */
  private readonly DEFAULT_HEADERS = {};

  private readonly STATUS: StatusMap = {
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
  }

  /**
   * Handle a given request by calling the specific
   * method handler.
   * @param method Request method
   * @param path Url path
   * @param data Body of request
   * @returns Response
   */
  handleRequest(method: string, path: string, data: any): any {
    let responseData;
    switch (method) {
      case 'get': responseData = this.get(path); break;
      case 'head': responseData = this.head(path); break;
      case 'options': responseData = this.options(); break;
      case 'put': responseData = this.put(path, data); break;
      case 'post': responseData = this.post(path, data); break;
      case 'delete': responseData = this.delete(path); break;
      default: throw new Error('Method not supported');
    }

    return this.convertHandlerResponseToAxiosResponse(responseData);
  }

  /**
   * Converts the given response object of a handler into a
   * object simulating an axios error.
   * @param handlerResponse Handler response to convert
   */
  convertHandlerResponseToAxiosError(
    handlerResponse: HandlerResponseObject,
  ): any {
    const restError = {
      status: this.STATUS[handlerResponse.status],
      statusCode: handlerResponse.status,
      message: handlerResponse.data!.message!,
      detail: {
        errorName: handlerResponse.data!.errorName,
      },
      timestamp: new Date().toISOString(),
    };

    const axiosResponse = {
      data: restError,
      status: handlerResponse.status,
      statusText: this.STATUS[handlerResponse.status],
      headers: {
        ...this.DEFAULT_HEADERS,
        ...handlerResponse.headers,
      },
      config: {},
      request: undefined,
    };

    const axiosError = {
      config: {},
      code: handlerResponse.status,
      request: undefined,
      response: axiosResponse,
      isAxiosError: true,
      toJSON: () => undefined,
    };

    throw axiosError;
  }

  /**
   * Converts the given response object of a handler into a
   * object simulating an axios response or error.
   * @param handlerResponse Handler response to convert
   */
  convertHandlerResponseToAxiosResponse(
    handlerResponse: HandlerResponse,
  ): any {
    // Convert handlerResponse to HandlerResponseObject if its only a string
    if (typeof handlerResponse === 'string') {
      handlerResponse = {
        status: 200,
        data: handlerResponse,
      };
    }

    // Merge with default headers
    handlerResponse.headers = {
      ...this.DEFAULT_HEADERS,
      ...handlerResponse.headers,
    };

    // If status code is above 400, indicating an error.
    // Create an AxiosError instead and throw it
    if (handlerResponse.status >= 400) {
      // This will always throw
      this.convertHandlerResponseToAxiosError(handlerResponse);
    }

    // Creates object mimicking an AxiosResponse
    const response = {
      data: handlerResponse.data,
      status: handlerResponse.status,
      statusText: handlerResponse.status.toString(),
      headers: handlerResponse.headers,
      config: {},
    } as AxiosResponse;

    console.log('SUCCESS WITH:');
    console.log(response);

    return response;
  }

  /**
   * Handles get request
   * @param path Path
   * @returns Response for request
   */
  get(path: string): HandlerResponse {
    switch (path) {
      case '/versions.json': return {data: {backend: 'demo'}, status: 200};
      case '/api/user/invite': return this.model.getInvites();
      case '/api/group': return this.model.getGroups();
    }

    if (path.startsWith('/api/group/')) {
      const params = path.split('/');
      const groupId = parseInt(params[3], 10);
      path = path.replace(`/api/group/${groupId}`, '');

      switch (path) {
        case '': {
          return this.model.getGroup(groupId);
        }
        case '/invites': {
          return this.model.getInvitesOfGroup(groupId);
        }
        case '/car': {
          return this.model.getCarsOfGroup(groupId);
        }
        case '/member': {
          return this.model.getMemberOfGroup(groupId);
        }
      }
    }

    if (path.startsWith('/api/user/search')) {
      const query = path.replace('/api/user/search?filter=', '');

      return this.model.findUsername(query);
    }

    return {
      data: {
        message: 'Request not supported',
        errorName: 'notSupported',
      },
      status: 500,
    };
  }

  /**
   * Handles head requests
   * @param path Path
   * @returns Request response
   */
  head(path: string): HandlerResponse {
    switch (path) {
      case '/auth': return {
        headers: {
          'xsrf-token': 'NOT_A_REAL_XSRF_TOKEN',
        },
        status: 200,
      };
      default: throw new Error('Request not supported');
    }
  }

  /**
   * Handles option requests.
   * @param path Path
   * @returns Request response
   */
  options(): HandlerResponse {
    return {
      data: {
        message: 'Request not supported',
        errorName: 'notSupported',
      },
      status: 500,
    };
  }

  /**
   * Handles put requests.
   * @param path Path
   * @param data Body of request
   * @returns Request response
   */
  put(path: string, data: any): HandlerResponse {
    switch (path) {
      case '/auth/token': return this.model.checkLoggedIn();
      case '/auth/login': return this.model.login(data);
    }

    if (path.startsWith('/api/group/')) {
      const groupId = parseInt(path.split('/')[3], 10);
      const groupPath = path.replace(`/api/group/${groupId}`, '');

      if (groupPath.startsWith('/car/')) {
        const carId = parseInt(groupPath.split('/')[2], 10);
        const carPath = groupPath.replace(`/car/${carId}`, '');

        switch (carPath) {
          case '/drive': return this.model.driveCar(groupId, carId);
          case '/park': return this.model.parkCar(groupId, carId, data);
        }
      } else if (groupPath.startsWith('/member/')) {
        '/api/group/1/member/4/admin/grant';
        const memberId = parseInt(groupPath.split('/')[2], 10);
        const memberPath = groupPath.replace(`/member/${memberId}`, '');

        switch (memberPath) {
          case '/admin/grant': return this.model
            .grantUserAdmin(groupId, memberId);
          case '/admin/revoke': return this.model
            .revokeUserAdmin(groupId, memberId);
        }
      }
    }
    return {
      data: {
        message: 'Request not supported',
        errorName: 'notSupported',
      },
      status: 500,
    };
  }

  /**
   * Handles post requests.
   * @param path Path
   * @param data Body of request
   * @returns Response to request
   */
  post(path: string, data: any): HandlerResponse {
    switch (path) {
      case '/api/group': return this.model.createGroup(data);
    }

    if (path.startsWith('/api/user/invite/')) {
      const inviteId = parseInt(path.split('/')[4], 10);
      const innerPath = path.replace(`/api/user/invite/${inviteId}`, '');

      switch (innerPath) {
        case '/join': return this.model.acceptInvite(inviteId);
      }
    }

    if (path.startsWith('/api/group/')) {
      const groupId = parseInt(path.split('/')[3], 10);
      const groupPath = path.replace(`/api/group/${groupId}`, '');

      switch (groupPath) {
        case '/leave': return this.model.leaveGroup(groupId);
        case '/invite': return this.model.inviteUser(groupId, data);
        case '/car': return this.model.createCar(groupId, data);
      }
    }

    return {
      data: {
        message: 'Request not supported',
        errorName: 'notSupported',
      },
      status: 500,
    };
  }

  /**
   * Handles delete requests
   * @param path Path
   * @returns Response to request
   */
  delete(path: string): HandlerResponse {
    if (path.startsWith('/api/group')) {
      const groupId = parseInt(path.split('/')[3], 10);
      const groupPath = path.replace(`/api/group/${groupId}`, '');

      if (groupPath.startsWith('/car')) {
        const carId = parseInt(groupPath.split('/')[2], 10);

        return this.model.deleteCar(groupId, carId);
      }
    }

    return {
      data: {
        message: 'Request not supported',
        errorName: 'notSupported',
      },
      status: 500,
    };
  }
}

export default DemoServer;
