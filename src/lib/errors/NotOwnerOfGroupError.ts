import ReduxError from './ReduxError';

/**
 * Error thrown if user tries to do an action with
 * a group which requires the user to be the owner.
 */
export class NotOwnerOfGroupError extends ReduxError {
  /**
   * Creates an instance.
   */
  constructor() {
    super('NotOwnerOfGroupError', 'Not Owner of the group');
  }
}

export default NotOwnerOfGroupError;
