import ReduxError from './ReduxError';

/**
 * Error thrown if user tries to create a car which already exists.
 */
export class CarAlreadyExistsError extends ReduxError {
  /**
   * Creates instance.
   */
  constructor() {
    super('CarAlreadyExistsError', 'Car already exists');
  }
}

export default CarAlreadyExistsError;
