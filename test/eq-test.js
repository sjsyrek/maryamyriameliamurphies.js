/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/eq-test.js
 *
 * @file Tests for Eq type class.
 * @license ISC
 */

/* global describe, it */

import {
  isEq,
  isNotEq
} from '../source';

describe(`Eq type class`, function() {
  let a = 5;
  let b = 5;
  let c = 10;
  let d = `text`;
  describe(`isEq()`, function() {
    it(`should return true if two objects are equatable and equal in value`, function() {
      isEq(a, b).should.be.true;
    });
    it(`should return false if two objects are equatable and not equal in value`, function() {
      isEq(a, c).should.be.false;
    });
    it(`should throw a type error if two objects are not the same type`, function() {
      isEq.bind(null, a, d).should.throw();
    });
  });
  describe(`isNotEq()`, function() {
    it(`should return true if two objects are equatable and not equal in value`, function() {
      isNotEq(a, c).should.be.true;
    });
    it(`should return false if two objects are equatable and equal in value`, function() {
      isNotEq(a, b).should.be.false;
    });
    it(`should throw a type error if two objects are not the same type`, function() {
      isNotEq.bind(null, a, d).should.throw();
    });
  });
});
