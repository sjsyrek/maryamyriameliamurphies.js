/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/zip-test.js
 *
 * @file Tests for functions for zipping and unzipping lists.
 * @license ISC
 */

/* global describe, it */

import {
  tuple,
  list,
  zip,
  zip3,
  zipWith,
  zipWith3
} from '../../source';

describe(`Tests for functions for zipping and unzipping lists`, function() {
  const lst1 = list(1,2,3,4,5);
  const lst2 = list(5,4,3,2,1);
  const lst3 = list(6,7,8,9,10);
  const f1 = (x, y) => tuple(x * 3, y * y);
  const g1 = (x, y) => x + y;
  const f2 = (x, y, z) => tuple(x * 3, y * y, z % 2);
  const g2 = (x, y, z) => x + y + z;
  describe(`zip()`, function() {
    it(`should take two lists and return a list of corresponding pairs`, function() {
      zip(lst1, lst2).should.eql(list(tuple(1,5),tuple(2,4),tuple(3,3),tuple(4,2),tuple(5,1)));
    });
    it(`should throw an error if either argument is not a list`, function() {
      zip.bind(null, lst1, 0).should.throw;
      zip.bind(null, 0, lst2).should.throw;
    });
  });
  describe(`zip3()`, function() {
    it(`should take three lists and return a list of triples`, function() {
      zip3(lst1, lst2, lst3).should.eql(list(tuple(1,5,6),tuple(2,4,7),tuple(3,3,8),tuple(4,2,9),tuple(5,1,10)));
    });
    it(`should throw an error if any of the arguments is not a list`, function() {
      zip3.bind(null, lst1, lst2, 0).should.throw;
      zip3.bind(null, lst1, 0, lst3).should.throw;
      zip3.bind(null, 0, lst2, lst3).should.throw;
    });
  });
  describe(`zipWith()`, function() {
    it(`should zip two lists using a provided function`, function() {
      zipWith(f1, lst1, lst2).should.eql(list(tuple(3,25),tuple(6,16),tuple(9,9),tuple(12,4),tuple(15,1)));
      zipWith(g1, lst1, lst2).should.eql(list(6,6,6,6,6));
    });
    it(`should throw an error if either the second or third argument is not a list`, function() {
      zipWith.bind(null, f1, lst1, 0).should.throw;
      zipWith.bind(null, g1, 0, lst2).should.throw;
    });
  });
  describe(`zipWith3()`, function() {
    it(`should zip three lists using a provided function`, function() {
      zipWith3(f2, lst1, lst2, lst3).should.eql(list(tuple(3,25,0),tuple(6,16,1),tuple(9,9,0),tuple(12,4,1),tuple(15,1,0)));
      zipWith3(g2, lst1, lst2, lst3).should.eql(list(12,13,14,15,16));
    });
    it(`should throw an error if any of the last three arguments is not a list`, function() {
      zipWith3.bind(null, f2, lst1, lst2, 0).should.throw;
      zipWith3.bind(null, f2, lst1, 0, lst3).should.throw;
      zipWith3.bind(null, f2, 0, lst2, lst3).should.throw;
    });
  });
});
