/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/set-test.js
 *
 * @file Tests for "set" operations on lists.
 * @license ISC
 */

/* global describe, it */

import {
  odd,
  list,
  listAppend,
  nub,
  nubBy,
  deleteL,
  deleteLBy,
  deleteFirsts,
  deleteFirstsBy
} from '../../source';

describe(`Tests for "set" operations on lists`, function() {
  const lst1 = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
  const lst2 = list(1,2,3,4,5);
  const lst3 = list(6,7,8,9,10);
  const lst4 = listAppend(lst3, lst3);
  const lst5 = listAppend(lst2, lst3);
  const eq = (x, y) => odd(x + y);
  describe(`nub()`, function() {
    it(`remove duplicate values from a list by dropping all occurrences after the first`, function() {
      nub(lst1).should.eql(list(1,2,3,4,5,6,7,8,9,10));
    });
    it(`should throw an error if the argument is not a list`, function() {
      nub.bind(null, 0).should.throw();
    });
  });
  describe(`nubBy()`, function() {
    it(`should remove duplicate values from a list using a custom equality function`, function() {
      nubBy(eq, lst1).should.eql(list(1,3,5,7,7,9));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      nubBy.bind(null, eq, 0).should.throw();
    });
  });
  describe(`deleteL()`, function() {
    it(`should remove the first occurrence of a value from a list`, function() {
      deleteL(2, lst1).should.eql(list(1,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      deleteL.bind(null, 2, 0).should.throw();
    });
  });
  describe(`deleteLBy()`, function() {
    it(`should remove the first occurrence of a value from a list using a custom equality function`, function() {
      deleteLBy(eq, 2, lst1).should.eql(list(2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10));
    });
    it(`should throw an error if the third argument is not a list`, function() {
      deleteLBy.bind(null, eq, 2, 0).should.throw();
    });
  });
  describe(`deleteFirsts()`, function() {
    it(`should remove the first occurrence of each value of a list in turn from another list`, function() {
      deleteFirsts(lst4, lst2).should.eql(list(6,7,8,9,10));
      deleteFirsts(listAppend(lst2, lst3), lst2).should.eql(lst3);
    });
    it(`should throw an error if either argument is not a list`, function() {
      deleteFirsts.bind(null, lst1, 0).should.throw();
      deleteFirsts.bind(null, 0, lst2).should.throw();
    });
  });
  describe(`deleteFirstsBy()`, function() {
    it(`should remove the first occurrence of each value of a list in turn from another list using a custom equality function`, function() {
      deleteFirstsBy(eq, lst5, lst2).should.eql(list(5,7,8,9,10));
    });
  });
});
