/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/reducing-test.js
 *
 * @file Tests for functions for reducing lists.
 * @license ISC
 */

/* global describe, it */

import {
  list,
  foldl
} from '../../source';

describe(`Tests for functions for reducing lists`, function() {
  const lst = list(1,2,3);
  const f = (x, y) => x - y;
  describe(`foldl()`, function() {
    it(`should perform a Left-associative fold of a structure`, function() {
      foldl(f, 0, lst).should.equal(-6);
    });
  });
});
