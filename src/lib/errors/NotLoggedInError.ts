/**
 * Error thrown if an action was taken which requires the user to be logged in.
 */
export class NotLoggedInError extends Error {
  /**
   * Creates an instance.
   */
  constructor() {
    super('Not logged in');
  }
}

export default NotLoggedInError;
