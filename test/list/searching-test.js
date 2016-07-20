/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/searching-test.js
 *
 * @file Tests for functions for searching lists.
 * @license ISC
 */

/* global describe, it */

import {
  and,
  odd,
  greaterThan,
  Nothing,
  just,
  tuple,
  list,
  listRange,
  lookup,
  filter
} from '../../source';

describe(`Tests for functions for searching lists`, function() {
  describe(`lookup()`, function() {
    it(`should look up a key in an association list of tuples and return a Maybe value`, function() {
      const assocs = list(tuple(1,2), tuple(3,4), tuple(3,3), tuple(4,2));
      lookup(3, assocs).should.eql(just(4));
      lookup(5, assocs).should.equal(Nothing);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      lookup.bind(null, 3, 0).should.throw;
    });
  });
  describe(`filter()`, function() {
    const lst = listRange(1,25);
    const f = x => and(odd(x), greaterThan(x, 10));
    const g = x => x + 1;
    it(`should return the list of elements in a list for which a function f returns true`, function() {
      filter(f, lst).should.eql(list(27,29,31,33,35,37,39,41,43,45,47,49));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      filter.bind(null, f, 0).should.throw;
    });
    it(`should throw an error if the first argument is not a function that returns a boolean value`, function() {
      filter.bind(null, g, 0).should.throw;
    });
  });
});
