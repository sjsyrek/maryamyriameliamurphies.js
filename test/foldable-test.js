/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/foldable-test.js
 *
 * @file Tests for Foldable type class.
 * @license ISC
 */

/* global describe, it */

import {
  fold,
  foldMap,
  foldr,
  Nothing,
  just,
  tuple,
  list
} from '../source';

describe(`Foldable type class`, function() {
  const mb = just(1);
  const mmb = just(mb);
  const tup = tuple(1,2);
  const lst = list(1,2,3);
  const llst = list(lst);
  const f1 = x => just(x * 3);
  const f2 = x => list(x * 3);
  const g = (x, y) => x + y;
  describe(`fold()`, function() {
    it(`should combine the elements of a structure using the monoid`, function() {
      fold(mmb).should.eql(mb);
      fold(llst).should.eql(lst);
    });
  });
  describe(`foldMap()`, function() {
    it(`should map each element of the structure to a monoid, and combine the results`, function() {
      foldMap(f1, mb).should.eql(just(3));
      foldMap(f2, lst).should.eql(list(3,6,9));
    });
    it(`should throw an error if the second argument is not a monoid`, function() {
      foldMap.bind(null, f1, 0).should.throw();
    });
  });
  describe(`foldr()`, function() {
    it(`should perform a right-associative fold of a structure`, function() {
      foldr(g, 0, mb).should.eql(1);
      foldr(g, 0, tup).should.eql(2);
      foldr(g, 0, lst).should.eql(6);
      foldr(g, mb, Nothing).should.eql(mb);
    });
    it(`should throw an error if the third argument is not a foldable type`, function() {
      foldr.bind(null, g, 0, 0).should.throw();
    });
  });
});
