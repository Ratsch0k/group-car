import _ from 'lodash';
import {RestError} from 'typings';

const restFields = [
  'message',
  'timestamp',
  'status',
  'statusCode',
  'detail',
] as const;

/**
 * Tests if the given object matches the signature of a rest error.
 * @param e The object to test
 * @returns Whether or not the object matches a rest error
 */
function isRestError(e: unknown): e is RestError {
  const dif = _.difference(_.keys(e), restFields);

  if (dif.length === 0) {
    const eRestFields = e as {[index in typeof restFields[number]]: unknown};

    if (
      typeof eRestFields.detail === 'object' &&
      eRestFields.detail !== null
    ) {
      const detail = eRestFields.detail as Record<string, unknown>;

      return 'errorName' in detail && typeof detail.errorName === 'string';
    }
  }

  return false;
}

export default isRestError;
