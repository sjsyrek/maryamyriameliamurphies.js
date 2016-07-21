/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/building-test.js
 *
 * @file Tests for functions for building lists.
 * @license ISC
 */

/* global describe, it */

import {
  list,
  scanl,
  scanr
} from '../../source';

describe(`Tests for functions for building lists`, function() {
  const lst = list(1,2,3);
  const f = (x, y) => x - y;
  describe(`scanl()`, function() {
    it(`should scan a list from the right and return a list of successive reduced values`, function() {
      scanl(f, 0, lst).should.eql(list(0,-1,-3,-6));
    });
    it(`should throw an error if the third argument is not a list`, function() {
      scanl.bind(null, f, 0, 0).should.throw();
    });
  });
  describe(`scanr()`, function() {
    it(`should scan a list from the left and return a list of successive reduced values`, function() {
      scanr(f, 0, lst).should.eql(list(2,-1,3,0));
    });
    it(`should throw an error if the third argument is not a list`, function() {
      scanr.bind(null, f, 0, 0).should.throw();
    });
  });
});
