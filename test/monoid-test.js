/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/monoid-test.js
 *
 * @file Tests for Monoid type class.
 * @license ISC
 */

/* global describe, it */

import {
  mempty,
  mappend,
  mconcat,
  Nothing,
  just,
  unit,
  tuple,
  emptyList,
  list
} from '../source';

describe(`Monoid type class`, function() {
  const lst1 = list(1,2,3);
  const lst2 = list(4,5,6);
  const lst3 = list(7,8,9);
  const lst4 = list(1,2,3,4,5,6);
  const lst5 = list(1,2,3,4,5,6,7,8,9);
  const lst6 = list(lst1, lst2, lst3);
  const mb1 = just(lst1);
  const mb2 = just(lst2);
  const mb3 = just(lst3);
  const mb4 = just(lst6);
  const tup1 = tuple(lst1, lst2);
  const tup2 = tuple(lst2, lst1);
  const tup3 = tuple(lst2, lst3);
  const tup4 = tuple(mappend(lst4, lst2), mappend(lst2, mappend(lst1, lst3)));
  describe(`mempty()`, function() {
    it(`should return the identity value for the monoid`, function() {
      mempty(mb1).should.equal(Nothing);
      mempty(tup1).should.equal(unit);
      mempty(lst1).should.equal(emptyList);
    });
    it(`should throw an error if its argument is not a monoid`, function() {
      mempty.bind(null, 0).should.throw();
    });
  });
  describe(`mappend()`, function() {
    it(`should perform an associative operation on two monoids`, function() {
      mappend(lst1, lst2).should.eql(lst4);
      mappend(mempty(lst1), lst1).should.equal(lst1);
      mappend(lst1, mappend(lst2, lst3)).should.eql(lst5);
      mappend(mappend(lst1, lst2), lst3).should.eql(lst5);
      mappend(mb1, mb2).should.eql(just(lst4));
      mappend(mempty(mb1), mb1).should.equal(mb1);
      mappend(mb1, mappend(mb2, mb3)).should.eql(just(lst5));
      mappend(mappend(mb1, mb2), mb3).should.eql(just(lst5));
      mappend(tup1, tup2).should.eql(tuple(lst4, list(4,5,6,1,2,3)));
      mappend(tup1, mappend(tup2, tup3)).should.eql(tup4);
      mappend(mappend(tup1, tup2), tup3).should.eql(tup4);
    });
    it(`should throw an error if either of its arguments is not a monoid`, function() {
      mappend.bind(null, 0, 1).should.throw();
    });
    it(`should throw an error if its arguments are different types`, function() {
      mappend.bind(null, lst1, mb1).should.throw();
    });
  });
  describe(`mconcat()`, function() {
    it(`should concatenate a list of monoids into a single list`, function() {
      mconcat(just(mb4)).should.equal(mb4);
      mconcat(lst6).should.eql(lst5);
    });
  });
});
