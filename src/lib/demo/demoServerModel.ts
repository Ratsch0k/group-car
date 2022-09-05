/* eslint-disable-next-line */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import State, {getDefaultDates, getSimpleUser} from './state';

/**
 * Response object of a handler method.
 */
export interface HandlerResponseObject {
  status: number;
  data?: any;
  headers?: Record<string, string>;
  cookies?: Record<string, string>
}

export type HandlerResponse = string | HandlerResponseObject;

/**
 * Model of the demo server.
 * Contains demo business logic.
 */
class DemoServerModel {
  private state = new State();

  /**
   * Counter how many times the client has requested all
   * all invites of the user.
   */
  private inviteCheckCounter = 0;

  /**
   * Logs the user in
   * @param data Credentials
   * @returns Success or failure response
   */
  login(data: any): HandlerResponse {
    const loginUser = this.state.loginUser;

    if (
      data.username === loginUser.username &&
        data.password === loginUser.password
    ) {
      this.state.isLoggedIn = true;

      return {
        status: 200,
        data: {
          ...loginUser,
          password: undefined,
        },
      };
    }

    return {
      status: 401,
      data: {
        message: 'Credentials incorrect',
        errorName: 'unauthorizedError',
      },
    };
  }

  /**
   * Check if user is logged in.
   */
  checkLoggedIn() {
    if (this.state.isLoggedIn) {
      return {
        status: 200,
        data: this.convert(this.state.loginUser),
      };
    } else {
      return {
        status: 401,
        data: {
          message: 'Not logged in',
          errorName: 'NotLoggedInError',
        },
      };
    }
  }

  /**
   * Logs the user out.
   * @returns Response
   */
  logout() {
    this.state.isLoggedIn = false;

    return {status: 204};
  }

  /**
   * Gets all invites of the user.
   *
   * To simulate the user being invited while their on the page
   * we will send an empty list for the 5 requests. On the 6th request
   * it will return the actual list.
   * @returns Success response with empty or full array
   */
  getInvites(): HandlerResponse {
    if (
      this.inviteCheckCounter < 5 &&
      this.state.memberships[this.state.loginUser.id][3] === undefined
    ) {
      this.inviteCheckCounter += 1;
      return {
        status: 200,
        data: {
          invites: [],
        },
      };
    }


    return {
      status: 200,
      data: {
        invites: this.convert(
          Object.values(
            (this.state.invites as any)[this.state.loginUser.id])),
      },
    };
  }

  /**
   * Get all groups of the user.
   */
  getGroups(): HandlerResponse {
    const memberships = Object.values(
      this.state.memberships[this.state.loginUser.id]) as any;
    const groups = [];

    for (const membership of memberships) {
      groups.push(this.state.groups[membership.groupId]);
    }

    return {
      status: 200,
      data: {
        groups: this.convert(groups),
      },
    };
  }

  /**
   * Get a specific group.
   * @param id Id of group
   * @returns Group
   */
  getGroup(id: number) {
    if (id in this.state.groups) {
      return {
        status: 200,
        data: this.convert(this.state.groups[id]),
      };
    }

    return {
      status: 404,
      data: {
        message: 'Group doesn\'t exist',
        errorName: 'GroupNotFoundError',
      },
    };
  }

  /**
   * Get all invites for a group.
   * @param id Id of group
   * @returns All invites of the group
   */
  getInvitesOfGroup(id: number) {
    const invites = this.state.invites;

    return {
      status: 200,
      data: {
        invites: this.convert(Object
          .values(invites)
          .map((userInvites: any) => Object.values(userInvites))
          .flat()
          .filter((invite: any) => invite && invite.groupId === id)),
      },
    };
  }

  /**
   * Gets all cars of a group.
   * @param id Id of group
   * @returns Response with all cars of group
   */
  getCarsOfGroup(id: number) {
    const allCarsProxy = this.state.cars;
    const carsOfGroupProxy = Object.values(
      allCarsProxy[id]).filter((car) => car !== undefined);

    return {
      status: 200,
      data: {
        cars: this.convert(carsOfGroupProxy),
      },
    };
  }

  /**
   * Get all members of the group.
   * @param id Id of the group
   * @returns Response with all members of the group
   */
  getMemberOfGroup(id: number) {
    const memberships = Object
      .values(this.state.memberships)
      .map((userMemberships: any) => Object.values(userMemberships))
      .flat()
      .filter((membership: any) => membership && membership.groupId === id);

    return {
      status: 200,
      data: {
        members: this.convert(memberships),
      },
    };
  }

  /**
   * Creates a group with the given data and returns it
   * @param data Data for the group
   * @returns Response with the created group
   */
  createGroup(data: any) {
    const name = data.name;
    const description = data.description;
    const id = Object.values(this.state.groups).length + 1;

    this.state.groups[id] = {
      id,
      name,
      description,
      Owner: {
        id: this.state.loginUser.id,
        username: this.state.loginUser.username,
      },
      ownerId: this.state.loginUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.cars[id] = {};
    this.state.memberships[this.state.loginUser.id][id] = {
      isAdmin: true,
      userId: this.state.loginUser.id,
      groupId: id,
      User: getSimpleUser(this.state.loginUser.id),
      ...getDefaultDates(),
    };

    return {
      status: 200,
      data: this.convert(this.state.groups[id]),
    };
  }

  /**
   * Accepts the invite for the logged in user.
   * @param id Id of the group for which the invite is
   * @returns Response
   */
  acceptInvite(id: number) {
    if (id in this.state.invites[this.state.loginUser.id]) {
      this.state.invites[this.state.loginUser.id][id] = undefined;
      this.state.memberships[this.state.loginUser.id][id] = {
        User: getSimpleUser(this.state.loginUser.id),
        isAdmin: false,
        ...getDefaultDates(),
        userId: this.state.loginUser.id,
        groupId: id,
      };

      return {
        status: 204,
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not authorized',
        errorName: 'UnauthorizedError',
      },
    };
  }

  /**
   * Leaves the given group.
   * @param id Id of the group
   * @returns Response
   */
  leaveGroup(id: number) {
    const group = this.state.groups[id];

    if (group.ownerId === this.state.loginUser.id) {
      return {
        status: 400,
        data: {
          message: 'You cannot leave a group you are the owner of',
          errorName: 'IsOwnerOfGroupError',
        },
      };
    }

    this.state.memberships[this.state.loginUser.id][id] = undefined;

    return {
      status: 204,
    };
  }

  /**
   * Sets the specific car to be driven from the logged in user.
   * @param groupId Id of group
   * @param carId Id of car
   * @returns Response
   */
  driveCar(groupId: number, carId: number) {
    if (!(carId in this.state.cars[groupId])) {
      return {
        status: 404,
        data: {
          message: 'Car doesn\'t exist',
          errorName: 'CarNotFoundError',
        },
      };
    }

    this.state.cars[groupId][carId].latitude = null;
    this.state.cars[groupId][carId].longitude = null;
    this.state.cars[groupId][carId].driverId = this.state.loginUser.id;
    this.state.cars[groupId][carId].Driver = getSimpleUser(
      this.state.loginUser.id);

    return {
      status: 204,
    };
  }

  /**
   * Sets the specific car to the set location and that it's parked.
   * @param groupId Id of group
   * @param carId Id of car
   * @param data Data containing the location
   * @returns Response
   */
  parkCar(groupId: number, carId: number, data: any) {
    const lat = data.latitude;
    const long = data.longitude;

    if (!(carId in this.state.cars[groupId])) {
      return {
        status: 404,
        data: {
          message: 'Car doesn\'t exist',
          errorName: 'CarNotFoundError',
        },
      };
    }

    this.state.cars[groupId][carId] = {
      ...this.state.cars[groupId][carId],
      latitude: lat,
      longitude: long,
      Driver: null,
      driverId: null,
    };

    return {
      status: 204,
    };
  }

  /**
   * Find users that start with the given query. Case insensitive
   * @param query Query for the username
   * @returns List of users that match the query
   */
  findUsername(query: string) {
    query = query.toLowerCase();
    const usernames = Object.values(this.state.users);
    const filteredUsernames = usernames
      .filter((user: any) =>
        user.username.toLowerCase().startsWith(query))
      .map((user: any) => ({id: user.id, username: user.username}));

    return {
      status: 200,
      data: {users: this.convert(filteredUsernames)},
    };
  }

  /**
   * Grants the given user admin privileges for the given group if the
   * logged in user is admin of that group.
   * @param groupId Id of group
   * @param userId Id of user
   * @returns Response
   */
  grantUserAdmin(groupId: number, userId: number) {
    // Check if logged in user is admin of group
    if (this.isAdminOfGroup(groupId, this.state.loginUser.id)) {
      const membership = this.state.memberships[userId][groupId];

      if (membership === undefined) {
        return {
          status: 400,
          data: {
            message: 'User is not a member of the group',
            details: {
              errorName: 'UserNotMemberOfGroup',
            },
          },
        };
      }

      membership.isAdmin = true;

      return {
        status: 204,
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not admin of group',
        errorName: 'NotAdminOfGroupError',
      },
    };
  }

  /**
   * Revokes admin privileges of the given user in that group if
   * logged in user is owner of the group.
   * @param groupId Id of group
   * @param userId Id of user
   * @returns Response
   */
  revokeUserAdmin(groupId: number, userId: number) {
    // Check if logged in user is owner of group
    const group = this.state.groups[groupId];
    if (group.ownerId === this.state.loginUser.id) {
      const membership = this.state.memberships[userId][groupId];

      if (membership === undefined) {
        return {
          status: 400,
          data: {
            message: 'User is not a member of the group',
            errorName: 'UserNotMemberOfGroup',
          },
        };
      }

      membership.isAdmin = false;

      return {
        status: 204,
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not ower of group',
        details: {
          errorName: 'NotOwnerOfGroupError',
        },
      },
    };
  }

  /**
   * Invites the specified user to the group.
   * @param groupId Id of group
   * @param data Contains username
   * @returns Response
   */
  inviteUser(groupId: number, data: any) {
    debugger;
    const username = data.username;

    const user = Object.values(this.state.users)
      .find((user: any) => user.username === username) as any;

    if (this.state.invites[user.id] === undefined) {
      this.state.invites[user.id] = {};
    }
    
    this.state.invites[user.id][groupId] = {
      User: getSimpleUser(user.id),
      userId: user.id,
      groupId: groupId,
      ...getDefaultDates(),
      invitedBy: this.state.loginUser.id,
      InviteSender: getSimpleUser(this.state.loginUser.id),
      Group: this.state.groups[groupId],
    };

    return {
      status: 204,
    };
  }

  /**
   * Creates a car for the group if logged in user is admin of the group
   * and returns the car data.
   * @param groupId Id of group
   * @param data Data of the car
   * @returns The created car
   */
  createCar(groupId: number, data: any) {
    if (this.isAdminOfGroup(groupId, this.state.loginUser.id)) {
      const name = data.name;
      const color = data.color;
      const id = Object.values(this.state.cars[groupId]).length + 1;

      this.state.cars[groupId][id] = {
        groupId,
        carId: id,
        name,
        color,
        driverId: null,
        Driver: null,
        ...getDefaultDates(),
      };

      return {
        status: 201,
        data: this.convert(this.state.cars[groupId][id]),
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not admin of the group',
        errorName: 'NotAdminOfGroupError',
      },
    };
  }

  /**
   * Deletes the car if logged in user is admin of the group.
   * @param groupId Id of group
   * @param carId Id of car
   * @returns Response
   */
  deleteCar(groupId: number, carId: number) {
    if (this.isAdminOfGroup(groupId, this.state.loginUser.id)) {
      this.state.cars[groupId][carId] = undefined;

      return {
        status: 204,
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not admin of the group',
        errorName: 'NotAdminOfGroupError',
      },
    };
  }

  /**
   * Deletes the group if user is owner of it.
   * @param groupId Id of group
   * @returns Response
   */
  deleteGroup(groupId: number) {
    const group = this.state.groups[groupId];

    // Check if user is owner of group
    if (group !== undefined && group.ownerId === this.state.loginUser.id) {
      this.state.groups[groupId] = undefined;

      return {
        status: 204,
      };
    }

    return {
      status: 401,
      data: {
        message: 'Not owner of group',
        errorName: 'NotOwnerOfGroupError',
      },
    };
  }

  /**
   * Returns whether a user is an admin of a group.
   * @param groupId Id of group
   * @param userId Id of user
   * @returns Whether the user is an admin of the group
   */
  isAdminOfGroup(groupId: number, userId: number): boolean {
    const membership = this.state.memberships[userId][groupId];

    return membership !== undefined && membership.isAdmin;
  }

  /**
   * Helper function to convert a proxy object or an array of
   * proxy objects into plain objects.
   *
   * This is useful for serialization in redux.
   */
  private convert(obj: any): any {
    let simpleObj;
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        simpleObj = obj.map((e) => this.convert(e));
      } else {
        simpleObj = Object.assign({}, obj);

        // Iterate through attributes of object and convert nested proxies
        for (const [key, value] of Object.entries(simpleObj)) {
          if (typeof value === 'object' && value !== null) {
            simpleObj[key] = this.convert(value);
          }
        }
      }

      return simpleObj;
    }

    return obj;
  }
}

export default DemoServerModel;
