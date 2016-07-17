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
  isEq,
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
      isEq(traverse(f, mb), list(just(list(8)))).should.be.true;
      isEq(traverse(f, tup), list(tuple(1,9))).should.be.true;
      isEq(traverse(f, lst), list(list(8,9,10), list())).should.be.true;
    });
    it(`should throw an error if the second argument is not a traversable type`, function() {
      traverse.bind(null, f, 0).should.throw;
    });
  });
  describe(`mapM()`, function() {
    it(`should map the elements of a structure to a monadic action, then evaluate and collect the results`, function() {
      isEq(mapM(f, mb), list(just(list(8)))).should.be.true;
      isEq(mapM(f, lst), list(list(8,9,10), list())).should.be.true;
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      mapM.bind(null, f, tup).should.throw;
    });
  });
  describe(`sequence()`, function() {
    it(`should evaluate each monadic action in a structure from left to right, and collect the results`, function() {
      isEq(sequence(mmb), just(just(1))).should.be.true;
      isEq(sequence(llst), list(list(1), list(2), list(3))).should.be.true;
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      sequence.bind(null, tup).should.throw;
    });
  });
});
