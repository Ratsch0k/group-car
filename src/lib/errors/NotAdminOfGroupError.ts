import ReduxError from './ReduxError';

/**
 * Error thrown if the user tries to do an
 * action with a group which requires the user to be an admin of that group.
 */
export class NotAdminOfGroupError extends ReduxError {
  /**
   * Creates an instance of this class.
   */
  constructor() {
    super('NotAdminOfGroupError', 'You have to be an admin of the group');
  }
}

export default NotAdminOfGroupError;
