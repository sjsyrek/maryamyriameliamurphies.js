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
  fmap,
  fmapReplaceBy,
  Nothing,
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
      fmap(id, mb).should.eql(mb);
      fmap(f, mb).should.eql(just(55));
      fmap(id, tup).should.eql(tup);
      fmap(f, tup).should.eql(tuple(1,22));
      fmap(id, lst1).should.eql(lst1);
      fmap(f, lst1).should.eql(list(11,22,33));
      $(fmap(f))(fmap(g))(lst1).should.eql(lst2);
      fmap($(f)(g))(lst1).should.eql(lst2);
    });
    it(`should return Nothing if Nothing is passed as the second argument`, function() {
      fmap(f, Nothing).should.equal(Nothing);
    });
    it(`should throw an error if the second argument is not a functor`, function() {
      fmap.bind(null, f, 0).should.throw();
    });
  });
  describe(`fmapReplaceBy()`, function() {
    it(`should replace all locations in a functor with the same value`, function() {
      fmapReplaceBy(1, mb).should.eql(just(1));
      fmapReplaceBy(5, tup).should.eql(tuple(1,5));
      fmapReplaceBy(5, lst1).should.eql(list(5,5,5));
    });
  });
});
