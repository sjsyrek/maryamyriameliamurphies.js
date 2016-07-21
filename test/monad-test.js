/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/monad-test.js
 *
 * @file Tests for Monad type class.
 * @license ISC
 */

/* global describe, it */

import {
  print,
  inject,
  flatMap,
  chain,
  flatMapFlip,
  join,
  liftM,
  Do,
  Nothing,
  just,
  list
} from '../source';

describe(`Monad type class`, function() {
  const mb1 = just(1);
  const mb2 = just(5);
  const lst = list(1,2,3);
  const doubleJust = x => just(x * 2);
  const doubleList = x => list(x * 2);
  const minusOne = x => just(x - 1);
  const plusOne = x => list(x + 1);
  const j = just(10);
  const l = list(1,2,3);
  describe(`inject()`, function() {
    it(`should inject a value into a monadic context`, function() {
      inject(mb1, 5).should.eql(mb2);
      inject(lst, 5).should.eql(list(5));
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      inject.bind(null, 0, 0).should.throw();
    });
  });
  describe(`flatMap()`, function() {
    it(`should sequentially compose two actions`, function() {
      flatMap(mb1, doubleJust).should.eql(just(2));
      flatMap(lst, doubleList).should.eql(list(2,4,6));
    });
    it(`should return Nothing if Nothing is passed as the first argument`, function() {
      flatMap(Nothing, mb1).should.equal(Nothing);
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      flatMap.bind(null, 0, doubleJust).should.throw();
    });
  });
  describe(`chain()`, function() {
    it(`should sequentially compose two actions and discard any value produced by the first`, function() {
      chain(mb1, j).should.eql(just(10));
      chain(lst, l).should.eql(list(1,2,3,1,2,3,1,2,3));
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      chain.bind(null, 0, j).should.throw();
    });
  });
  describe(`flatMapFlip()`, function() {
    it(`should sequentially compose two actions but with the arguments in reverse order`, function() {
      flatMapFlip(doubleJust, mb1).should.eql(just(2));
      flatMapFlip(doubleList, lst).should.eql(list(2,4,6));
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      flatMapFlip.bind(null, doubleList, 0).should.throw();
    });
  });
  describe(`join()`, function() {
    it(`should remove one level of monadic structure from a monad`, function() {
      const mmb = just(mb1);
      const llst = list(lst);
      mmb.should.eql(just(just(1)));
      join(mmb).should.eql(mb1);
      llst.should.eql(list(lst));
      join(llst).should.eql(lst);
    });
    it(`should throw an error if the argument is not a monad`, function() {
      join.bind(null, 0).should.throw();
    });
    it(`should throw an error if the monad does not wrap another monad`, function() {
      join.bind(null, lst).should.throw();
      join.bind(null, mb1).should.throw();
    });
  });
  describe(`liftM()`, function() {
    it(`should convert a function into a monad`, function() {
      const f = x => x * 10;
      liftM(f, mb1).should.eql(just(10));
      liftM(f, lst).should.eql(list(10,20,30));
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      liftM.bind(null, doubleList, 0).should.throw();
    });
  });
  describe(`Do()`, function() {
    const put = x => {
      print(`     ${x}`);
      return just(x);
    }
    it(`should offer an interface for chaining monadic actions`, function() {
      const b1 = Do(j).flatMap(doubleJust).flatMap(minusOne);
      const b2 = Do(j).flatMap(doubleJust).chain(j).flatMap(minusOne);
      const b3 = Do(lst).flatMap(plusOne).flatMap(doubleList);
      const b4 = Do(lst).flatMap(plusOne).chain(lst).flatMap(doubleList);
      const b5 = Do(j).inject(100);
      const b6 = Do(lst).inject(100);
      b1.valueOf().should.equal(`Maybe number >>= Just 19`);
      b2.valueOf().should.equal(`Maybe number >>= Just 9`);
      b3.valueOf().should.equal(`[number] >>= [4:6:8:[]]`);
      b4.valueOf().should.equal(`[number] >>= [2:4:6:2:4:6:2:4:6:[]]`);
      b5.valueOf().should.equal(`Maybe number >>= Just 100`);
      b6.valueOf().should.equal(`[number] >>= [100:[]]`);
      Do(j)
      .flatMap(put)        // => 10
      .flatMap(doubleJust)
      .flatMap(put)        // => 20
      .chain(j)
      .flatMap(put)        // => 10
      .flatMap(minusOne)
      .flatMap(put)        // => 9
      .flatMap(doubleJust)
      .flatMap(put);       // => 18
    });
  });
  it(`should throw an error if the argument is not a monad`, function() {
    Do.bind(null, 0).should.throw();
  });
});
