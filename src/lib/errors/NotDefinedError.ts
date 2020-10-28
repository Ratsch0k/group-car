/**
 * Error which is thrown if a property from a context is used which is not
 * yet initialized by using the Provider.
 */
export class NotDefinedError extends Error {
  /**
   * Creates an instance of this error.
   */
  constructor() {
    super('Not defined yet');
  }
}

export default NotDefinedError;
