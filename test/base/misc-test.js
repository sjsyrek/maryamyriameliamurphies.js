/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/base/misc-test.js
 *
 * @file Tests for miscellaneous basic functions.
 * @license ISC
 */

/* global describe, it */

import {
  partial,
  $,
  flip,
  id,
  constant,
  until
} from '../../source';

describe(`Miscellaneous basic functions`, function() {
  const f = (x, y) => {
    const p = (x, y) => x * y;
    return partial(p, x, y);
  }
  const g = (x, y) => {
    const p = (x, y) => x / y;
    return partial(p, x, y);
  }
  const h = (x, y) => x - y;
  const addTen = x =>  x + 10;
  const multHund = x => x * 100;
  const addTwenty = x => x + addTen(10);
  const divByTen = g(10);
  describe(`partial()`, function() {
    const p = f(5);
    const a = f(5, 5);
    it(`should return a function if not all arguments are applied`, function() {
      p.should.be.a.Function();
    });
    it(`should return a value if all arguments are applied`, function() {
      a.should.equal(25);
    });
  });
  describe(`$()`, function() {
    it(`should compose two functions and return the result`, function() {
      $(addTen)(multHund)(10).should.equal(1010);
      $(addTen)(multHund, 10).should.equal(1010);
      $(multHund)(addTen)(10).should.equal(2000);
      $(multHund)(addTen, 10).should.equal(2000);
      $(addTen)(addTwenty)(10).should.equal(40);
      $(divByTen)(multHund)(10).should.equal(0.01);
    });
  });
  describe(`flip()`, function() {
    const flipped = flip(h);
    it(`should return a function`, function() {
      flipped.should.be.a.Function();
    });
    it(`should return the value of the original function with its arguments flipped`, function() {
      h(100, 50).should.equal(50);
      flipped(100, 50).should.equal(-50);
    });
  });
  describe(`id()`, function() {
    it(`should return whatever is passed as an argument`, function() {
      id(1).should.equal(1);
      id(`A`).should.equal(`A`);
    });
  });
  describe(`constant()`, function() {
    const c = (x, y) => $(constant(x))(multHund)(y);
    it(`should return the value of the first argument applied to it`, function() {
      constant(2, 3).should.equal(2);
      c(5, 10).should.equal(5);
    });
  });
  describe(`until()`, function() {
    const pred = x => x > 10;
    const r = x => x + 1;
    const u = until(pred, r);
    it(`should yield apply a function to a value until a predicate is true`, function() {
      u(1).should.equal(11);
    });
  });
});
