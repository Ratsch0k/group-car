/* eslint-disable @typescript-eslint/no-explicit-any, no-invalid-this */

/**
 * createdAt and updatedAt object with dates
 * @returns createdAt and updatedAt default dates
 */
export function getDefaultDates(): { createdAt: string; updatedAt: string; } {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const defaultUserEntries = {
  isBetaUser: false,
  ...getDefaultDates(),
};

interface User {
  createdAt: string;
  updatedAt: string;
  isBetaUser: boolean;
  id: number;
  username: string;
  email: string;
  password: string;
}

/**
 * Creates user object for given id and username
 * @param id id of user
 * @param username username of user
 * @returns User object
 */
function createUser(id: number, username: string): User {
  return {
    id,
    username,
    email: `${username.toLowerCase()}@mygroupcar.de`,
    password: `${username.toLowerCase()}groupcar`,
    ...defaultUserEntries,
  };
}

/**
 * Get simple object of the user
 * @param id id of user
 * @returns Object with id and usename of user
 */
export function getSimpleUser(id: number): { id: any; username: any; } {
  const user = (users as any)[id];

  return {
    id: user.id,
    username: user.username,
  };
}

/**
 * List of users.
 */
const users = {
  1: createUser(1, 'Demo'),
  2: createUser(2, 'Dad'),
  3: createUser(3, 'Mom'),
  4: createUser(4, 'Sister'),
  5: createUser(5, 'Alice'),
  6: createUser(6, 'Bob'),
  7: createUser(7, 'Charlie'),
  8: createUser(8, 'David'),
  9: createUser(9, 'Fred'),
  10: createUser(10, 'Sarah'),
};

/**
 * Map of all cars.
 */
const cars = {
  1: {
    1: {
      groupId: 1,
      carId: 1,
      name: 'Hyundai Colt',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: 'Black',
      driverId: null,
      Driver: null,
    },
  },
  2: {},
  3: {},
};

/**
 * Map of all groups.
 */
const groups = {
  1: {
    id: 1,
    name: 'Family',
    description: null,
    ownerId: 3,
    Owner: getSimpleUser(3),
    ...getDefaultDates(),
  },
  2: {
    id: 2,
    name: 'Friends',
    description: 'Please organize the cars we share.',
    ownerId: 1,
    Owner: getSimpleUser(1),
    ...getDefaultDates(),
  },
  3: {
    id: 3,
    name: 'Work cars',
    description: 'All work related cars, for delivery, etc.',
    ownerId: 10,
    ...getDefaultDates(),
    Owner: getSimpleUser(10),
  },
};

/**
 * Map of all membership.
 */
const memberships = {
  1: {
    1: {
      User: getSimpleUser(1),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 1,
      groupId: 1,
    },
    2: {
      User: getSimpleUser(1),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 1,
      groupId: 2,
    },
  },
  2: {
    1: {
      User: getSimpleUser(2),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 2,
      groupId: 1,
    },
  },
  3: {
    1: {
      User: getSimpleUser(3),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 3,
      groupId: 1,
    },
  },
  4: {
    1: {
      User: getSimpleUser(4),
      isAdmin: false,
      ...getDefaultDates(),
      userId: 4,
      groupId: 1,
    },
  },
  5: {
    2: {
      User: getSimpleUser(5),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 5,
      groupId: 2,
    },
  },
  6: {
    2: {
      User: getSimpleUser(6),
      isAdmin: false,
      ...getDefaultDates(),
      userId: 6,
      groupId: 2,
    },
  },
  7: {
    2: {
      User: getSimpleUser(7),
      isAdmin: false,
      ...getDefaultDates(),
      userId: 7,
      groupId: 2,
    },
  },
  8: {
    2: {
      User: getSimpleUser(8),
      isAdmin: false,
      ...getDefaultDates(),
      userId: 8,
      groupId: 2,
    },
  },
  9: {},
  10: {
    3: {
      User: getSimpleUser(10),
      isAdmin: true,
      ...getDefaultDates(),
      userId: 10,
      groupId: 3,
    },
  },
};

/**
 * Object representing all invites for all users.
 *
 * Each invite can be accessed by two ids, the user id
 * and the group id.
 * The first id is the user id and the second the group id.
 */
const invites = {
  1: {
    3: {
      User: getSimpleUser(1),
      userId: 1,
      groupId: 3,
      createdAt: new Date().toISOString(),
      invitedBy: 10,
      InviteSender: {
        id: 10,
        username: users[10].username,
      },
      Group: groups[3],
    },
  },
  2: {},
  9: {
    2: {
      User: getSimpleUser(9),
      userId: 9,
      groupId: 2,
      createdAt: new Date().toISOString(),
      invitedBy: 1,
      InviteSender: getSimpleUser(1),
      Group: groups[2],
    },
  },
};

/**
 * Demo state
 *
 * Any changes to this class are stored in the session storage.
 */
class State {
  /**
   * Creates a named proxy handler
   * @param name Name of the object
   * @returns The proxy handler
   */
  private proxyHandler(name?: string): any {
    /* eslint-disable-next-line */
    const self = this;
    return {
      set(obj: any, prop: any, value: any) {
        const hasSet = Reflect.set(obj, prop, value);

        self.storeAttribute(name ? name : prop);

        return hasSet;
      },
    };
  }

  private readonly INITIAL_STATE = {
    users,
    invites,
    groups,
    cars,
    isLoggedIn: false,
    memberships,
    loginUser: users[1],
  }

  public readonly loginUser = users[1];
  public users = new ObjectProxy(users, this.proxyHandler('users')) as any;
  public invites = new ObjectProxy(invites,
    this.proxyHandler('invites')) as any;
  public groups = new ObjectProxy(groups,
    this.proxyHandler('groups')) as any;
  public cars = new ObjectProxy(cars,
    this.proxyHandler('cars')) as any;
  public memberships = new ObjectProxy(memberships,
    this.proxyHandler('memberships')) as any;
  public isLoggedIn = false;

  private readonly SERIALIZABLE_FIELDS = [
    'isLoggedIn',
    'users',
    'invites',
    'groups',
    'cars',
    'memberships',
  ]

  /**
   * Create instance of this class.
   * @returns This class as proxy
   */
  constructor() {
    this.loadState();

    return new Proxy(this, this.proxyHandler());
  }

  /**
   * Stores the named attribute in the session storage.
   * @param name Name of the attribute
   */
  private storeAttribute(name: string) {
    const value = (this as any)[name];
    let serializedValue = null;
    switch (typeof value) {
      case 'object': {
        serializedValue = JSON.stringify(value);
        break;
      }
      default: {
        serializedValue = value.toString();
      }
    }
    sessionStorage.setItem(name, serializedValue);
  }

  /**
   * Loads the named attribute from session storage
   * @param name Name of the attribute
   * @param type Type of the attribute
   * @returns Returns the value of this attribute stored in the session storage
   */
  private loadAttribute(
    name: string,
    type: 'int' | 'float' | 'string' | 'object' | 'boolean',
  ) {
    const sessionValue = sessionStorage.getItem(name);
    let value = null;
    if (sessionValue) {
      switch (type) {
        case 'int': {
          value = parseInt(sessionValue, 10);
          break;
        }
        case 'float': {
          value = parseFloat(sessionValue);
          break;
        }
        case 'string': {
          value = sessionValue;
          break;
        }
        case 'object': {
          value = JSON.parse(sessionValue);
          break;
        }
        case 'boolean': {
          value = sessionValue === 'true';
          break;
        }
      }
    } else if (name in this.INITIAL_STATE) {
      // If name not in session storage but in in initial state,
      // load the initial value
      value = (this.INITIAL_STATE as any)[name];
    }

    if (value) {
      switch (type) {
        case 'object': {
          (this as any)[name] = new ObjectProxy(value, this.proxyHandler(name));
          break;
        }
        default: {
          (this as any)[name] = value;
        }
      }
    }

    return value;
  }

  /**
   * Load the entire state from session storage.
   */
  private loadState() {
    this.loadAttribute('isLoggedIn', 'boolean');
    this.loadAttribute('cars', 'object');
    this.loadAttribute('groups', 'object');
    this.loadAttribute('invites', 'object');
    this.loadAttribute('users', 'object');
    this.loadAttribute('memberships', 'object');
  }
}

/**
 * Variant of a Proxy that also wraps every nested objected inside a Proxy.
 */
class ObjectProxy {
  /**
   * Creates instance.
   * @param target Object to wrap
   * @param handler Handler method
   * @returns Nested proxy
   */
  constructor(target: any, handler: any) {
    for (const [key, value] of Object.entries(target)) {
      (this as any)[key] = target[key];

      if (typeof value !== 'object' || value === null || value === undefined) {
        continue;
      }

      (this as any)[key] = new ObjectProxy((this as any)[key], handler);
    }

    return new Proxy(this, handler);
  }
}

export default State;
