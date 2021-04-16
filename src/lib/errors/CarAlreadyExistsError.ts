/**
 * Error thrown if user tries to create a car which already exists.
 */
export class CarAlreadyExistsError extends Error {
  /**
   * Creates instance.
   */
  constructor() {
    super('Car already exists');
  }
}

export default CarAlreadyExistsError;
