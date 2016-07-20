/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/tuple-test.js
 *
 * @file Tests for Tuple data type.
 * @license ISC
 */

/* global describe, it */

import {
  unit,
  tuple,
  fst,
  snd,
  curry,
  uncurry,
  swap,
  isTuple,
  isUnit,
  fromArrayToTuple,
  fromTupleToArray
} from '../source';

/* eslint no-unused-vars: ["error", { "args": "none" }] */

describe(`Tuple data type`, function() {
  const a = tuple(1,2);
  const b = tuple(1,2);
  const c = swap(b);
  const p = tuple(100,15);
  const v = tuple(7);
  const u = tuple();
  const f = p => x - y;
  const g = p => fst(p) - snd(p);
  const x = 10;
  const y = 2;
  const curried1 = curry(f);
  const curried2 = curry(f, x, y)
  const curried3 = curry(f)(x)(y);
  const curried4 = curry(g);
  const uncurried1 = uncurry(curried4);
  const curried5 = curry(uncurried1);
  const uncurried2 = uncurry(curried4)(p);
  const arr = [1,2];
  it(`should return [Object Tuple] when cast to a string`, function() {
    a.toString().should.equal(`[Object Tuple]`);
  });
  it(`should return a tuple string, e.g. "(1,2)", as its value`, function() {
    a.valueOf().should.equal(`(1,2)`);
  });
  describe(`unit`, function() {
    it(`should be the empty tuple`, function() {
      unit.should.have.properties({"0": null});
    });
    it(`isTuple(unit) should return false`, function() {
      isTuple(unit).should.be.false;
    });
  });
  describe(`tuple()`, function() {
    it(`should return a new tuple if at least two values are passed as arguments`, function() {
      a.should.have.properties({"1":1, "2":2});
    });
    it(`should return the argument value if only one value is passed as an argument`, function() {
      v.should.equal(7);
    });
    it(`should return unit (an empty tuple) if no values are passed as arguments`, function() {
      u.should.have.properties({"0": null});
    });
  });
  describe(`fst()`, function() {
    it(`should return the first element of a tuple`, function() {
      fst(a).should.equal(1);
    });
    it(`should throw an error if the argument is not a tuple`, function() {
      fst.bind(null, unit).should.throw();
      fst.bind(null, {}).should.throw();
      fst.bind(null).should.throw();
    });
  });
  describe(`snd()`, function() {
    it(`should return the second element of a tuple`, function() {
      snd(a).should.equal(2);
    });
    it(`should throw an error if the argument is not a tuple`, function() {
      snd.bind(null, unit).should.throw();
      snd.bind(null, {}).should.throw();
      snd.bind(null).should.throw();
    });
  });
  describe(`curry()`, function() {
    it(`should return a function when no arguments are applied to the argument function`, function() {
      curried1.should.be.a.Function;
      curried1(x).should.be.a.Function;
    });
    it(`should return a function when arguments are partially applied to the argument function`, function() {
      curried1.should.be.a.Function;
    });
    it(`should return a value when all arguments are applied to the argument function`, function() {
      curried2.should.equal(8);
      curried3.should.equal(8);
    });
    it(`should be transitive with uncurry`, function() {
      (curried4(100)(15) === uncurried1(p) === curried5(100)(15)).should.be.true;
    });
  });
  describe(`uncurry()`, function() {
    it(`should return a function when no argument is applied to the argument function`, function() {
      uncurried1.should.be.a.Function;
    });
    it(`should return a value when all arguments are applied to the argument function`, function() {
      uncurried1(p).should.equal(85);
    });
    it(`should be transitive with curry`, function() {
      uncurried2.should.equal(85);
    });
  });
  describe(`swap()`, function() {
    it(`should swap the values of a tuple and return a new tuple`, function() {
      c.should.have.properties({"1":2, "2":1});
    });
    it(`should throw an error if the argument is not a tuple`, function() {
      swap.bind(null, unit).should.throw();
      swap.bind(null, {}).should.throw();
      swap.bind(null).should.throw();
    });
  });
  describe(`isTuple()`, function() {
    it(`should return true when the value is a tuple`, function() {
      isTuple(a).should.be.true;
    });
    it(`should return false when the value is not a tuple`, function() {
      isTuple(arr).should.be.false;
    });
    it(`should return false when the value is unit, the empty tuple`, function() {
      isTuple(unit).should.be.false;
    });
  });
  describe(`isUnit()`, function() {
    it(`should return true if the argument is unit, the empty tuple`, function() {
      isUnit(u).should.be.true;
    });
    it(`should return false if the argument is a tuple, but is not unit`, function() {
      isUnit(a).should.be.false;
    });
    it(`should throw an error if the argument is not a tuple or unit`, function() {
      isUnit.bind(null, 0);
    });
  });
  describe(`fromArrayToTuple()`, function() {
    it(`should create a new tuple from the values of an array`, function() {
      fromArrayToTuple([2,1]).should.have.properties({"1":2, "2":1});
    });
    it(`should return the value at index 0 if the argument is a single element array`, function() {
      fromArrayToTuple([1]).should.equal(1);
    });
    it(`should return unit if the argument is an empty array`, function() {
      fromArrayToTuple([]).should.equal(unit);
    });
    it(`should throw an error if the argument is not an array`, function() {
      fromArrayToTuple.bind(null, 0).should.throw;
    });
  });
  describe(`fromTupleToArray()`, function() {
    it(`should create a new array from the values of a tuple`, function() {
      fromTupleToArray(a).should.eql([1,2]);
    });
    it(`should throw an error if the argument is not a tuple`, function() {
      fromTupleToArray.bind(null).should.throw();
      fromTupleToArray.bind(null, {}).should.throw();
    });
  });
});
