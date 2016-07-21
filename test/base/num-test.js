/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/base/num-test.js
 *
 * @file Tests for numeric functions.
 * @license ISC
 */

/* global describe, it */

import {
  even,
  odd
} from '../../source';

describe(`Numeric functions`, function() {
  describe(`even()`, function() {
    it(`should return true if a value is even`, function() {
      even(2).should.be.true;
    });
    it(`should return false if a value is not even`, function() {
      even(3).should.be.false;
    });
  });
  describe(`odd()`, function() {
    it(`should return true if a value is odd`, function() {
      odd(1).should.be.true;
    });
    it(`should return false if a value is not odd`, function() {
      odd(2).should.be.false;
    });
  });
});
