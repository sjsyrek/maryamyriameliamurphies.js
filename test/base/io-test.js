/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/base/io-test.js
 *
 * @file Tests for I/O functions.
 * @license ISC
 */

/* global describe, it */

import {
  show,
  print,
  tuple,
  list
} from '../../source';

describe(`I/O functions`, function() {
  const tup = tuple(1, 2);
  const lst = list(1, 2, 3);
  describe(`show()`, function() {
    it(`should display the value of an object as a string`, function() {
      show(lst).should.equal(`[1:2:3:[]]`);
      show(tup).should.equal(`(1,2)`);
    });
  });
  describe(`print()`, function() {
    it(`should display the value of an object on the console`, function() {
      print(`     ${lst}`);
      print(`     ${tup}`);
    });
  });
});
