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
  min,
  Nothing,
  just,
  tuple,
  list
} from '../source';

describe(`Ord type class`, function() {
  const a = 1;
  const b = 2;
  const c = 2;
  const d = 2;
  const mb1 = just(1);
  const mb2 = just(2);
  const tup1 = tuple(1,2);
  const tup2 = tuple(2,1);
  const tup3 = tuple(2,2,1);
  const tup4 = tuple(2,2,2);
  const lst1 = list(1,2,3);
  const lst2 = list(3,2,1);
  it(`should return the correct value for each Ordering`, function() {
    LT.ord().should.equal(`LT`);
    GT.ord().should.equal(`GT`);
    EQ.ord().should.equal(`EQ`);
    LT.valueOf().should.equal(`LT`);
    GT.valueOf().should.equal(`GT`);
    EQ.valueOf().should.equal(`EQ`);
  });
  describe(`compare()`, function() {
    it(`should return the Ordering of two values if they are the same type`, function() {
      compare(a, b).should.equal(LT);
      compare(b, a).should.equal(GT);
      compare(b, c).should.equal(EQ);
      compare(Infinity, b).should.equal(GT);
      compare(a, Infinity).should.equal(LT);
      compare(mb1, mb2).should.equal(LT);
      compare(mb2, mb1).should.equal(GT);
      compare(Nothing, mb1).should.equal(LT);
      compare(mb1, Nothing).should.equal(GT);
      compare(mb1, just(1)).should.equal(EQ);
      compare(tup1, tup2).should.equal(LT);
      compare(tup2, tup1).should.equal(GT);
      compare(tup3, tup4).should.equal(LT);
      compare(tup4, tup3).should.equal(GT);
      compare(tup1, tuple(1,2)).should.equal(EQ);
      compare(lst1, lst2).should.equal(LT);
      compare(lst2, lst1).should.equal(GT);
      compare(lst1, list(1,2,3)).should.equal(EQ);
    });
    it(`should throw a type error if two tuples are not the same type`, function() {
      compare.bind(null, c, `text`).should.throw();
    });
  });
  describe(`lessThan()`, function() {
    it(`should return true if the first argument is less than the second argument`, function() {
      lessThan(a, b).should.be.true;
      lessThan(mb1, mb2).should.be.true;
      lessThan(tup1, tup2).should.be.true;
      lessThan(lst1, lst2).should.be.true;
    });
    it(`should return false if the first argument is not less than the second argument`, function() {
      lessThan(c, d).should.be.false;
      lessThan(b, a).should.be.false;
      lessThan(mb2, mb1).should.be.false;
      lessThan(tup2, tup1).should.be.false;
      lessThan(lst2, lst1).should.be.false;
    });
  });
  describe(`lessThanOrEqual()`, function() {
    it(`should return true if the first argument is less than or equal to the second argument`, function() {
      lessThanOrEqual(a, b).should.be.true;
      lessThanOrEqual(c, d).should.be.true;
      lessThanOrEqual(mb1, mb2).should.be.true;
      lessThanOrEqual(mb1, just(1)).should.be.true;
      lessThanOrEqual(tup1, tup2).should.be.true;
      lessThanOrEqual(tup1, tuple(1,2)).should.be.true;
      lessThanOrEqual(lst1, lst2).should.be.true;
      lessThanOrEqual(lst1, list(1,2,3)).should.be.true;
    });
    it(`should return false if the first argument is not less than or equal to the second argument`, function() {
      lessThanOrEqual(b, a).should.be.false;
      lessThanOrEqual(mb2, mb1).should.be.false;
      lessThanOrEqual(tup2, tup1).should.be.false;
      lessThanOrEqual(lst2, lst1).should.be.false;
    });
  });
  describe(`greaterThan()`, function() {
    it(`should return true if the first argument is greater than to the second argument`, function() {
      greaterThan(b, a).should.be.true;
      greaterThan(mb2, mb1).should.be.true;
      greaterThan(tup2, tup1).should.be.true;
      greaterThan(lst2, lst1).should.be.true;
    });
    it(`should return false if the first argument is not greater than to the second argument`, function() {
      greaterThan(c, d).should.be.false;
      greaterThan(a, b).should.be.false;
      greaterThan(mb1, mb2).should.be.false;
      greaterThan(tup1, tup2).should.be.false;
      greaterThan(lst1, lst2).should.be.false;
    });
  });
  describe(`greaterThanOrEqual()`, function() {
    it(`should return true if the first argument is greater than or equal to the second argument`, function() {
      greaterThanOrEqual(mb2, mb1).should.be.true;
      greaterThanOrEqual(mb2, just(2)).should.be.true;
      greaterThanOrEqual(tup2, tup1).should.be.true;
      greaterThanOrEqual(tup2, tuple(2,1)).should.be.true;
      greaterThanOrEqual(lst2, lst1).should.be.true;
      greaterThanOrEqual(lst2, list(3,2,1)).should.be.true;
    });
    it(`should return false if the first argument is not greater than or equal to the second argument`, function() {
      greaterThanOrEqual(b, a).should.be.true;
      greaterThanOrEqual(c, d).should.be.true;
      greaterThanOrEqual(a, b).should.be.false;
      greaterThanOrEqual(mb1, mb2).should.be.false;
      greaterThanOrEqual(tup1, tup2).should.be.false;
      greaterThanOrEqual(lst1, lst2).should.be.false;
    });
  });
  describe(`max()`, function() {
    it(`should return the greater of two values`, function() {
      max(a, b).should.equal(2);
      max(b, a).should.equal(2);
      max(mb1, mb2).should.equal(mb2);
      max(tup1, tup2).should.equal(tup2);
      max(lst1, lst2).should.equal(lst2);
    });
  });
  describe(`min()`, function() {
    it(`should return the lesser of two values`, function() {
      min(a, b).should.equal(1);
      min(b, a).should.equal(1);
      min(mb1, mb2).should.equal(mb1);
      min(tup1, tup2).should.equal(tup1);
      min(lst1, lst2).should.equal(lst1);
    });
  });
});
