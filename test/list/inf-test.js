/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/inf-test.js
 *
 * @file Tests for infinite list functions.
 * @license ISC
 */

/* global describe, it */

import {
  list,
  listInf,
  listInfBy,
  iterate,
  repeat,
  replicate,
  cycle,
  take,
  index
} from '../../source';

describe(`Tests for infinite list functions`, function() {
  const f = x => x * 2;
  describe(`listInf()`, function() {
    it(`should generate an infinite list`, function() {
      const lst1 = listInf(1);
      take(3, lst1).should.eql(list(1,2,3));
      index(lst1, 1000).should.equal(1001);
    });
  });
  describe(`listInfBy()`, function() {
    it(`should generate an infinite list using a given step function`, function() {
      const lst2 = listInfBy(1, f);
      take(3, lst2).should.eql(list(1,2,4));
      index(lst2, 10).should.equal(1024);
    });
  });
  describe(`iterate()`, function() {
    it(`should return an infinite list of repeated applications of a function to a value`, function() {
      const lst3 = iterate(f, 1);
      take(10, lst3).should.eql(list(1,2,4,8,16,32,64,128,256,512));
      index(lst3, 10).should.equal(1024);
    });
  });
  describe(`repeat()`, function() {
    it(`should build an infinite list of identical values`, function() {
      const lst4 = repeat(3);
      take(10, lst4).should.eql(list(3,3,3,3,3,3,3,3,3,3));
      index(lst4, 100).should.equal(3);
    });
  });
  describe(`replicate()`, function() {
    it(`should return a list of a specified length in which every value is the same`, function() {
      replicate(10, 3).should.eql(list(3,3,3,3,3,3,3,3,3,3));
    });
  });
  describe(`cycle()`, function() {
    it(`should return the infinite repetition of a list`, function() {
      const lst5 = list(1,2,3);
      const c = cycle(lst5);
      take(9, c).should.eql(list(1,2,3,1,2,3,1,2,3));
      index(c, 100).should.equal(2);
    });
    it(`should throw an error if the argument is not a list`, function() {
      cycle.bind(null, 0).should.throw;
    });
    it(`should throw an error if the argument is an empty list`, function() {
      cycle.bind(null, list()).should.throw;
    });
  });
});
