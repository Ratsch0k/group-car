import {isCompletedMatcher, isPendingMatcher} from './util';

describe('redux utils', () => {
  describe('isPendingMatcher', () => {
    it('returns true if action starts with ' +
    'slice name and ends with /pending', () => {
      const matcher = isPendingMatcher('slice');

      expect(matcher({type: 'slice/action/pending'})).toBe(true);
    });

    it('returns false if action doesn\'t start with slice name', () => {
      const matcher = isPendingMatcher('slice');

      expect(matcher({type: 'other/action/pending'})).toBe(false);
    });

    it('returns false if action doesn\'t end with /pending', () => {
      const matcher = isPendingMatcher('slice');

      expect(matcher({type: 'other/action/rejected'})).toBe(false);
    });
  });

  describe('isCompletedMatcher', () => {
    it('returns true if action starts with slice name and ' +
    'ends with either fulfilled or rejected', () => {
      const matcher = isCompletedMatcher('slice');

      expect(matcher({type: 'slice/action/fulfilled'})).toBe(true);
      expect(matcher({type: 'slice/action/rejected'})).toBe(true);
    });

    it('returns false if action doesn\'t start with slice name', () => {
      const matcher = isCompletedMatcher('slice');

      expect(matcher({type: 'other/action/fulfilled'})).toBe(false);
    });

    it('returns false if action doesn\'t ' +
    'end with rejected or fulfilled', () => {
      const matcher = isCompletedMatcher('slice');
      
      expect(matcher({type: 'slice/action/pending'})).toBe(false);
    });
  });
});
