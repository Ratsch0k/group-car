/**
 * Error thrown inside async thunks should inherit from this class,
 * so that the fields redux-thunk can be overridden.
 * This is especially important for the `name` field.
 */
export class ReduxError extends Error {
  /**
   * Name of the error. Will override redux error name.
   */
  public name: string;

  /**
   * Creates an instance of this class.
   * @param name Name of the error
   * @param message Message of the error
   */
  constructor(name: string, message?: string) {
    super(message || 'Unexpected error occurred');
    this.name = name;
  }
}

export default ReduxError;
