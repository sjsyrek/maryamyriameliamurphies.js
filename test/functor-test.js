/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/functor-test.js
 *
 * @file Tests for Functor type class.
 * @license ISC
 */

/* global describe, it */

import {
  $,
  id,
  isEq,
  fmap,
  fmapReplaceBy,
  just,
  tuple,
  list
} from '../source';

describe(`Functor type class`, function() {
  const lst1 = list(1,2,3);
  const lst2 = list(1100,2200,3300);
  const mb = just(5)
  const tup = tuple(1,2);
  const f = x => x * 11;
  const g = x => x * 100;
  describe(`fmap()`, function() {
    it(`should map a function over a functor and return the correct value`, function() {
      isEq(fmap(id, mb), mb).should.be.true;
      isEq(fmap(f, mb), just(55)).should.be.true;
      isEq(fmap(id, tup), tup).should.be.true;
      isEq(fmap(f, tup), tuple(1,22)).should.be.true;
      isEq(fmap(id, lst1), lst1).should.be.true;
      isEq(fmap(f, lst1), list(11,22,33)).should.be.true;
      isEq($(fmap(f))(fmap(g))(lst1), lst2).should.be.true;
      isEq(fmap($(f)(g))(lst1), lst2).should.be.true;
    });
    it(`should throw an error if the second argument is not a functor`, function() {
      fmap.bind(null, f, 0).should.throw;
    });
  });
  describe(`fmapReplaceBy()`, function() {
    it(`should replace all locations in a functor with the same value`, function() {
      isEq(fmapReplaceBy(1, mb), just(1)).should.be.true;
      isEq(fmapReplaceBy(2, tup), tuple(2,2)).should.be.true;
      isEq(fmapReplaceBy(5, lst1), list(5,5,5)).should.be.true;
    });
  });
});
