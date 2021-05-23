import _ from 'lodash';

const restFields = ['message', 'timestamp', 'status', 'statusCode', 'detail'];

/**
 * Tests if the given object matches the signature of a rest error.
 * @param e The object to test
 * @returns Whether or not the object matches a rest error
 */
function isRestError(e: Record<string, unknown>): boolean {
  const dif = _.difference(_.keys(e), restFields);

  if (dif.length !== 0) {
    return false;
  } else {
    return typeof e.detail === 'object' && e.detail !== null &&
    typeof (e.detail as Record<string, unknown>).errorName === 'string';
  }
}

export default isRestError;
