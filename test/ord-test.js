/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/ord-test.js
 *
 * @file Tests for Ord type class.
 * @license ISC
 */

/* global describe, it */

import {
  EQ,
  LT,
  GT,
  compare,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  max,
  min
} from '../source';

describe(`Ord type class`, function() {
  describe(`compare()`, function() {
    let a = 1;
    let b = 2;
    let c = 2;
    let d = 2;
    it(`should return the Ordering of two values if they are the same type`, function() {
      compare(a, b).should.equal(LT);
      compare(b, a).should.equal(GT);
      compare(b, c).should.equal(EQ);
    });
    it(`should throw a type error if two tuples are not the same type`, function() {
      compare.bind(null, c, `text`).should.throw();
    });
    it(`should work when called from the other Ord functions`, function() {
      lessThan(a, b).should.be.true;
      lessThan(c, d).should.be.false;
      lessThan(b, a).should.be.false;
      lessThanOrEqual(a, b).should.be.true;
      lessThanOrEqual(c, d).should.be.true;
      lessThanOrEqual(b, a).should.be.false;
      greaterThan(b, a).should.be.true;
      greaterThan(c, d).should.be.false;
      greaterThan(a, b).should.be.false;
      greaterThanOrEqual(b, a).should.be.true;
      greaterThanOrEqual(c, d).should.be.true;
      greaterThanOrEqual(a, b).should.be.false;
      max(a, b).should.equal(2);
      min(a, b).should.equal(1);
    });
  });
});
