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
  isNotEq,
  Nothing,
  just,
  tuple,
  list
} from '../source';

describe(`Eq type class`, function() {
  const a = 5;
  const b = 5;
  const c = 10;
  const d = `text`;
  const mb1 = just(1);
  const mb2 = just(2);
  const tup1 = tuple(1,2);
  const tup2 = tuple(2,1);
  const lst1 = list(1,2,3);
  const lst2 = list(3,2,1);
  const str = list(`a`,`b`,`c`);
  describe(`isEq()`, function() {
    it(`should return true if two objects are equatable and equal in value`, function() {
      isEq(a, b).should.be.true;
      isEq(mb1, just(1)).should.be.true;
      isEq(Nothing, Nothing).should.be.true;
      isEq(tup1, tuple(1,2)).should.be.true;
      isEq(lst1, list(1,2,3)).should.be.true;
    });
    it(`should return false if two objects are equatable and not equal in value`, function() {
      isEq(a, c).should.be.false;
      isEq(mb1, mb2).should.be.false;
      isEq(mb1, Nothing).should.be.false;
      isEq(tup1, tup2).should.be.false;
      isEq(lst1, lst2).should.be.false;
    });
    it(`should throw an error if two objects are not the same type`, function() {
      isEq.bind(null, a, d).should.throw();
    });
    it(`should throw an error if two lists being compared are not the same type`, function() {
      isEq.bind(null, lst1, str).should.throw();
    });
  });
  describe(`isNotEq()`, function() {
    it(`should return true if two objects are equatable and not equal in value`, function() {
      isNotEq(a, c).should.be.true;
      isNotEq(mb1, mb2).should.be.true;
      isNotEq(mb1, Nothing).should.be.true;
      isNotEq(tup1, tup2).should.be.true;
      isNotEq(lst1, lst2).should.be.true;
    });
    it(`should return false if two objects are equatable and equal in value`, function() {
      isNotEq(a, b).should.be.false;
      isNotEq(mb1, just(1)).should.be.false;
      isNotEq(Nothing, Nothing).should.be.false;
      isNotEq(tup1, tuple(1,2)).should.be.false;
      isNotEq(lst1, list(1,2,3)).should.be.false;
    });
    it(`should throw an error if two objects are not the same type`, function() {
      isNotEq.bind(null, a, d).should.throw();
    });
  });
});
