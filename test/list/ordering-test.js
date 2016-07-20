/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/ordering-test.js
 *
 * @file Tests for functions for ordering lists.
 * @license ISC
 */

/* global describe, it */

import {
  LT,
  GT,
  EQ,
  compare,
  list,
  listRange,
  reverse,
  sort,
  sortBy,
  mergeSort,
  mergeSortBy,
  insert,
  insertBy
} from '../../source';

describe(`Tests for functions for ordering lists`, function() {
  const lst1 = list(9,8,7,6,5,4,3,10,13,11,14,23,24,26,25,2,1);
  const lst2 = listRange(1, 11);
  const lst3 = reverse(lst2);
  const lst4 = list(20,19,18,17,16,15,14,13,12,11,10,1,2,3,4,5,6,7,8,9);
  const lst5 = reverse(listRange(1, 11, f));
  const lst6 = listRange(1, 11);
  const lst7 = reverse(lst6);
  const lst8 = list(1,2,3,4,5,6,7,8,9,10);
  const lst9 = list(10,9,8,7,6,5,4,3,2,1);
  const lst10 = list(1,2,3,4,5,6,8,9,10);
  const notCompare = (x, y) => compare(x, y) === EQ ? EQ : (GT ? LT : GT);
  const f = x => x + 1;
  describe(`sort()`, function() {
    it(`should sort a list using an insertion sort algorithm`, function() {
      sort(lst1).should.eql(list(1,2,3,4,5,6,7,8,9,10,11,13,14,23,24,25,26));
    });
    it(`should throw an error if the argument is not a list`, function() {
      mergeSort.bind(null, 0).should.throw();
    });
  });
  describe(`sortBy()`, function() {
    it(`should sort a list using an insertion sort algorithm and a custom comparison function`, function() {
      sortBy(notCompare, lst2).should.eql(lst8);
      sortBy(notCompare, lst3).should.eql(lst9);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      sortBy.bind(null, notCompare, 0).should.throw();
    });
  });
  describe(`mergeSort()`, function() {
    it(`should sort a list using a merge sort algorithm`, function() {
      mergeSort(lst4).should.eql(list(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,30));
      mergeSort(lst5).should.eql(lst8);
    });
    it(`should throw an error if the argument is not a list`, function() {
      mergeSort.bind(null, 0).should.throw();
    });
  });
  describe(`mergeSortBy()`, function() {
    it(`should sort a list using a merge sort algorithm and a custom comparison function`, function() {
      mergeSortBy(notCompare, lst6).should.eql(lst8);
      mergeSortBy(notCompare, lst7).should.eql(lst9);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      mergeSortBy.bind(null, notCompare, 0).should.throw();
    });
  });
  describe(`insert()`, function() {
    it(`should insert an element into a list at the first position where it is less than or equal to the next element`, function() {
      insert(7, lst10).should.eql(lst8);
    });
    it(`should throw an error if the second argument is not a list`, function() {
      insert.bind(null, 7, 0).should.throw();
    });
  });
  describe(`insertBy()`, function() {
    it(`should insert an element into a list using a custom comparison function`, function() {
      insertBy(notCompare, 7, lst10).should.eql(list(7,1,2,3,4,5,6,8,9,10));
    });
    it(`should throw an error if the third argument is not a list`, function() {
      insertBy.bind(null, notCompare, 7, 0).should.throw();
    });
  });
});
