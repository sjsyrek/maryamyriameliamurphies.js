/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/folds-test.js
 *
 * @file Tests for special folds for lists.
 * @license ISC
 */

/* global describe, it */

import {
  list,
  concat,
  concatMap
} from '../../source';

describe(`Tests for special folds for lists`, function() {
  const lst1 = list(1,2,3);
  const lst2 = list(4,5,6);
  const lst3 = list(7,8,9);
  const f = x => list(x * 3);
  describe(`concat()`, function() {
    const xss = list(lst1, lst2, lst3);
    it(`should concatenate the elements in a container of lists`, function() {
      concat(xss).should.eql(list(1,2,3,4,5,6,7,8,9));
    });
    it(`should throw an error if the argument is not a list`, function() {
      concat.bind(null, 0).should.throw();
    });
    it(`should throw an error if the argument elements are not also lists`, function() {
      concat.bind(null, lst1).should.throw();
    });
  });
  describe(`concatMap()`, function() {
    it(`should map a function that returns a list over a list and concatenate the result`, function() {
      concatMap(f, lst1).should.eql(list(3,6,9));
    });
  });
});
