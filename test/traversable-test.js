/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/traversable-test.js
 *
 * @file Tests for Traversable type class.
 * @license ISC
 */

/* global describe, it */

import {
  traverse,
  mapM,
  sequence,
  just,
  tuple,
  list
} from '../source';

describe(`Traversable type class`, function() {
  const mb = just(1);
  const mmb = just(mb);
  const tup = tuple(1,2);
  const lst = list(1,2,3);
  const llst = list(lst);
  const f = x => list(x + 7);
  describe(`traverse()`, function() {
    it(`should map the elements of a structure to an action, then evaluate and collect the results`, function() {
      traverse(f, mb).should.eql(list(just(list(8))));
      traverse(f, tup).should.eql(list(tuple(1,9)));
      traverse(f, lst).should.eql(list(list(8,9,10)));
    });
    it(`should throw an error if the second argument is not a traversable type`, function() {
      traverse.bind(null, f, 0).should.throw;
    });
  });
  describe(`mapM()`, function() {
    it(`should map the elements of a structure to a monadic action, then evaluate and collect the results`, function() {
      mapM(f, mb).should.eql(list(just(list(8))));
      mapM(f, lst).should.eql(list(list(8,9,10), list()));
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      mapM.bind(null, f, tup).should.throw;
    });
  });
  describe(`sequence()`, function() {
    it(`should evaluate each monadic action in a structure from left to right, and collect the results`, function() {
      sequence(mmb).should.eql(just(just(1)));
      sequence(llst).should.eql(list(list(1), list(2), list(3)));
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      sequence.bind(null, tup).should.throw;
    });
  });
});
