/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/indexing-test.js
 *
 * @file Tests for functions for indexing lists.
 * @license ISC
 */

/* global describe, it */

import {
  even,
  Nothing,
  just,
  list,
  index,
  elemIndex,
  elemIndices,
  find,
  findIndex,
  findIndices
} from '../../source';

describe(`Tests for functions for indexing lists`, function() {
  const lst1 = list(1,2,3,4,5);
  const lst2 = list(1,2,2,3,2,4,2,2,5,2,6,8);
  const lst3 = list(1,2,3,4,5,6,7,8,9,10);
  const pred1 = x => x % 3 === 0;
  const pred2 = x => x > 10;
  const pred3 = x => even(x);
  describe(`index()`, function() {
    it(`should return the value from a list at the specified index, starting at 0`, function() {
      index(lst1, 3).should.equal(4);
    });
    it(`should throw an error if the first argument is not a list`, function() {
      index.bind(null, 0, 3).should.throw();
    });
    it(`should throw an error if the index value specified is less than 0`, function() {
      index.bind(null, lst1, -1).should.throw();
    });
    it(`should throw an error if the list is empty`, function() {
      index.bind(null, list(), 3).should.throw();
    });
  });
  describe(`elemIndex()`, function() {
    it(`should return the index of the first value of a list equal to a query value as a Just`, function() {
      elemIndex(8, lst2).should.eql(just(11));
    });
    it(`should return Nothing if the list does not contain the query value`, function() {
      elemIndex(10, lst2).should.equal(Nothing);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      elemIndex.bind(null, 8, 0).should.throw();
    });
  });
  describe(`elemIndices()`, function() {
    it(`should return in a new list the indices of all values in a list equal to a query value, in ascending order`, function() {
      elemIndices(2, lst2).should.eql(list(1,2,4,6,7,9));
      elemIndices(10, lst2).should.eql(list());
    });
    it(`should throw an error if the second argument is not a list`, function() {
      elemIndices.bind(null, 2, 0).should.throw();
    });
  });
  describe(`find()`, function() {
    it(`should return the first value in a list that satisfies a given predicate function as a Just`, function() {
      find(pred1, lst3).should.eql(just(3));
    });
    it(`should return Nothing if no element in a list satisfies a given predicate function`, function() {
      find(pred2, lst3).should.equal(Nothing);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      find.bind(null, pred1, 0).should.throw();
    });
  });
  describe(`findIndex()`, function() {
    it(`should return the index of the first value in a list that satisfies a given predicate function`, function() {
      findIndex(pred1, lst3).should.eql(just(2));
    });
    it(`should return Nothing if no element in a list satisfies a given predicate function`, function() {
      findIndex(pred2, lst3).should.equal(Nothing);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      findIndex.bind(null, pred1, 0).should.throw();
    });
  });
  describe(`findIndices()`, function() {
    it(`should return in a new list the indices of all values in a list that satisfy a predicate function`, function() {
      findIndices(pred3, lst3).should.eql(list(1,3,5,7,9));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      findIndices.bind(null, pred3, 0).should.throw();
    });
  });
});
