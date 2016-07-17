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
  isEq,
  inject,
  flatMap,
  chain,
  flatMapFlip,
  join,
  liftM,
  Do,
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
  const put = x => {
    print(`     ${x}`);
    return just(x);
  }
  describe(`inject()`, function() {
    it(`should inject a value into a monadic context`, function() {
      isEq(inject(mb1, 5), mb2).should.be.true;
      isEq(inject(lst, 5), list(5)).should.be.true;
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      inject.bind(null, 0, 0).should.throw;
    });
  });
  describe(`flatMap()`, function() {
    it(`should sequentially compose two actions`, function() {
      isEq(flatMap(mb1, doubleJust), just(2)).should.be.true;
      isEq(flatMap(lst, doubleList), list(2,4,6)).should.be.true;
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      flatMap.bind(null, 0, doubleJust).should.throw;
    });
  });
  describe(`chain()`, function() {
    it(`should sequentially compose two actions and discard any value produced by the first`, function() {
      isEq(chain(mb1, j), just(10)).should.be.true;
      isEq(chain(lst, l), list(1,2,3,1,2,3,1,2,3)).should.be.true;
    });
    it(`should throw an error if the first argument is not a monad`, function() {
      chain.bind(null, 0, j).should.throw;
    });
  });
  describe(`flatMapFlip()`, function() {
    it(`should sequentially compose two actions but with the arguments in reverse order`, function() {
      isEq(flatMapFlip(doubleJust, mb1), just(2)).should.be.true;
      isEq(flatMapFlip(doubleList, lst), list(2,4,6)).should.be.true;
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      flatMapFlip.bind(null, doubleList, 0).should.throw;
    });
  });
  describe(`join()`, function() {
    it(`should remove one level of monadic structure from a monad`, function() {
      const mmb = just(mb1);
      const llst = list(lst);
      isEq(mmb, just(just(1))).should.be.true;
      isEq(join(mmb), mb1).should.be.true;
      isEq(llst, list(lst)).should.be.true;
      isEq(join(llst), lst).should.be.true;
    });
    it(`should throw an error if the argument is not a monad`, function() {
      join.bind(null, 0).should.throw;
    });
  });
  describe(`liftM()`, function() {
    it(`should convert a function into a monad`, function() {
      const f = x => x * 10;
      isEq(liftM(f, mb1), just(10)).should.be.true;
      isEq(liftM(f, lst), list(10,20,30)).should.be.true;
    });
    it(`should throw an error if the second argument is not a monad`, function() {
      liftM.bind(null, doubleList, 0).should.throw;
    });
  });
  describe(`Do()`, function() {
    it(`should offer an interface for chaining monadic actions`, function() {
      const b1 = Do(j).flatMap(doubleJust).flatMap(minusOne);
      const b2 = Do(j).flatMap(doubleJust).chain(j).flatMap(minusOne);
      const b3 = Do(lst).flatMap(plusOne).flatMap(doubleList);
      const b4 = Do(lst).flatMap(plusOne).chain(lst).flatMap(doubleList);
      b1.valueOf().should.equal(`Maybe number >>= Just 19`);
      b2.valueOf().should.equal(`Maybe number >>= Just 9`);
      b3.valueOf().should.equal(`[number] >>= [4:6:8:[]]`);
      b4.valueOf().should.equal(`[number] >>= [2:4:6:2:4:6:2:4:6:[]]`);
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
});
