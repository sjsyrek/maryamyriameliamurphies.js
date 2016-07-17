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
  isEq,
  fold,
  foldMap,
  foldr,
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
    it(`should combine the elements of a structure using a monoid`, function() {
      isEq(fold(mmb), mb).should.be.true;
      isEq(fold(llst), lst).should.be.true;
    });
  });
  describe(`foldMap()`, function() {
    it(`should map each element of the structure to a monoid, and combine the results`, function() {
      isEq(foldMap(f1, mb), just(3)).should.be.true;
      isEq(foldMap(f2, lst), list(3,6,9)).should.be.true;
    });
    it(`should throw an error if the second argument is not a monoid`, function() {
      foldMap.bind(null, f1, 0).should.throw;
    });
  });
  describe(`foldr()`, function() {
    it(`should perform a right-associative fold of a structure`, function() {
      isEq(foldr(g, 0, mb), 1).should.be.true;
      isEq(foldr(g, 0, tup), 2).should.be.true;
      isEq(foldr(g, 0, lst), 6).should.be.true;
    });
    it(`should throw an error if the third argument is not a foldable type`, function() {
      foldr.bind(null, g, 0, 0);
    });
  });
});
