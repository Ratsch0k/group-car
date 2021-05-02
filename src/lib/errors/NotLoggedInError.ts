import ReduxError from './ReduxError';

/**
 * Error thrown if an action was taken which requires the user to be logged in.
 */
export class NotLoggedInError extends ReduxError {
  /**
   * Creates an instance.
   */
  constructor() {
    super('NotLoggedInError', 'Not logged in');
  }
}

export default NotLoggedInError;
