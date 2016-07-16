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
  just,
  tuple,
  list
} from '../source';

describe(`Ord type class`, function() {
  describe(`compare()`, function() {
    const a = 1;
    const b = 2;
    const c = 2;
    const d = 2;
    const mb1 = just(1);
    const mb2 = just(2);
    const tup1 = tuple(1,2);
    const tup2 = tuple(2,1);
    const lst1 = list(1,2,3);
    const lst2 = list(3,2,1);
    it(`should return the Ordering of two values if they are the same type`, function() {
      compare(a, b).should.equal(LT);
      compare(b, a).should.equal(GT);
      compare(b, c).should.equal(EQ);
      compare(mb1, mb2).should.equal(LT);
      compare(mb2, mb1).should.equal(GT);
      compare(mb1, just(1)).should.equal(EQ);
      compare(tup1, tup2).should.equal(LT);
      compare(tup2, tup1).should.equal(GT);
      compare(tup1, tuple(1,2)).should.equal(EQ);
      compare(lst1, lst2).should.equal(LT);
      compare(lst2, lst1).should.equal(GT);
      compare(lst1, list(1,2,3)).should.equal(EQ);
    });
    it(`should throw a type error if two tuples are not the same type`, function() {
      compare.bind(null, c, `text`).should.throw();
    });
    it(`should work when called from the other Ord functions`, function() {
      lessThan(a, b).should.be.true;
      lessThan(c, d).should.be.false;
      lessThan(b, a).should.be.false;
      lessThan(mb1, mb2).should.be.true;
      lessThan(mb2, mb1).should.be.false;
      lessThan(tup1, tup2).should.be.true;
      lessThan(tup2, tup1).should.be.false;
      lessThan(lst1, lst2).should.be.true;
      lessThan(lst2, lst1).should.be.false;
      lessThanOrEqual(a, b).should.be.true;
      lessThanOrEqual(c, d).should.be.true;
      lessThanOrEqual(b, a).should.be.false;
      lessThanOrEqual(mb1, mb2).should.be.true;
      lessThanOrEqual(mb1, just(1)).should.be.true;
      lessThanOrEqual(mb2, mb1).should.be.false;
      lessThanOrEqual(tup1, tup2).should.be.true;
      lessThanOrEqual(tup1, tuple(1,2)).should.be.true;
      lessThanOrEqual(tup2, tup1).should.be.false;
      lessThanOrEqual(lst1, lst2).should.be.true;
      lessThanOrEqual(lst1, list(1,2,3)).should.be.true;
      lessThanOrEqual(lst2, lst1).should.be.false;
      greaterThan(b, a).should.be.true;
      greaterThan(c, d).should.be.false;
      greaterThan(a, b).should.be.false;
      greaterThan(mb2, mb1).should.be.true;
      greaterThan(mb1, mb2).should.be.false;
      greaterThan(tup2, tup1).should.be.true;
      greaterThan(tup1, tup2).should.be.false;
      greaterThan(lst2, lst1).should.be.true;
      greaterThan(lst1, lst2).should.be.false;
      greaterThanOrEqual(b, a).should.be.true;
      greaterThanOrEqual(c, d).should.be.true;
      greaterThanOrEqual(a, b).should.be.false;
      greaterThanOrEqual(mb2, mb1).should.be.true;
      greaterThanOrEqual(mb2, just(2)).should.be.true;
      greaterThanOrEqual(mb1, mb2).should.be.false;
      greaterThanOrEqual(tup2, tup1).should.be.true;
      greaterThanOrEqual(tup2, tuple(2,1)).should.be.true;
      greaterThanOrEqual(tup1, tup2).should.be.false;
      greaterThanOrEqual(lst2, lst1).should.be.true;
      greaterThanOrEqual(lst2, list(3,2,1)).should.be.true;
      greaterThanOrEqual(lst1, lst2).should.be.false;
      max(a, b).should.equal(2);
      min(a, b).should.equal(1);
      max(mb1, mb2).should.equal(mb2);
      min(mb1, mb2).should.equal(mb1);
      max(tup1, tup2).should.equal(tup2);
      min(tup1, tup2).should.equal(tup1);
      max(lst1, lst2).should.equal(lst2);
      min(lst1, lst2).should.equal(lst1);
    });
  });
});
