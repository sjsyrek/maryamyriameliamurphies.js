/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/applicative-test.js
 *
 * @file Tests for Applicative type class.
 * @license ISC
 */

/* global describe, it */

import {
  partial,
  $,
  id,
  isEq,
  pure,
  ap,
  apFlip,
  then,
  skip,
  liftA,
  liftA2,
  liftA3,
  just,
  unit,
  tuple,
  list
} from '../source';

describe(`Applicative type class`, function() {
  const mb1 = just(1);
  const mb2 = just(10);
  const lst1 = list(1,2,3);
  const lst2 = list(4,5,6);
  const lst3 = list(7,8,9);
  const lst4 = list(10,11,12);
  const lst5 = list(10,10,10);
  const tup1 = tuple(lst1, lst2);
  const tup2 = tuple(lst3, lst4);
  const f = x => x * 10;
  const g = x => x * 3;
  const h1 = (x, y) => x * y;
  const h2 = (x, y) => x + y;
  const h3 = (x, y) => x - y;
  const p = pure(lst1, id);
  const pf = pure(lst1, f);
  const pg = pure(lst1, g);
  const p$ = pure(lst1, $);
  describe(`pure()`, function() {
    it(`should lift a value into an applicative context`, function() {
      isEq(pure(mb1, 5), just(5)).should.be.true;
      isEq(pure(tup1, tup2), tuple(unit, lst4)).should.be.true;
      isEq(pure(lst1, 5), list(5)).should.be.true;
    });
    it(`should throw an error if the second argument is not an applicative functor.`, function() {
      pure.bind(null, f, 0).should.throw;
    });
  });
  describe(`ap()`, function() {
    it(`should apply a function in an applicative context to an applicative functor`, function() {
      isEq(ap(p, lst1), lst1).should.be.true; // identity
      const comp = list(30,60,90);
      isEq(ap(ap(ap(p$)(pf))(pg))(lst1), comp).should.be.true;
      isEq(ap(ap(ap(p$, pf), pg), lst1), comp).should.be.true;
      isEq(ap(pf, ap(pg, lst1)), comp).should.be.true; // composition
      isEq(ap(pf, pure(lst1, 10)), list(100)).should.be.true;
      isEq(pure(lst1, f(10)), list(100)).should.be.true; // homomorphism
      isEq(ap(pf, pure(lst1, 3)), list(30)).should.be.true;
      const a = pure(lst1, 3);
      isEq(ap(pf, a), list(30)).should.be.true; // interchange
    });
    it(`should throw an error if either argument is not an applicative functor`, function() {
      ap.bind(null, 0, pf).should.throw;
      ap.bind(null, pf, 0).should.throw;
    });
  });
  describe(`apFlip()`, function() {
    it(`should apply a function to an applicative functor with its arguments reversed`, function() {
      isEq(apFlip(h1, lst1, lst5), list(10,10,10,20,20,20,30,30,30)).should.be.true;
      isEq(apFlip(h2, lst1, lst5), list(11,11,11,12,12,12,13,13,13)).should.be.true;
      isEq(apFlip(h3, lst1, lst5), list(9,9,9,8,8,8,7,7,7)).should.be.true;
    });
  });
  describe(`then()`, function() {
    it(`should sequence actions and discard the value of the first argument`, function() {
      isEq(then(mb1, mb2), mb2).should.be.true;
      isEq(then(tup1, tup2), tup2).should.be.true;
      isEq(then(lst1, lst2), list(4,5,6,4,5,6,4,5,6)).should.be.true;
    });
  });
  describe(`skip()`, function() {
    it(`should sequence actions and discard the value of the second argument`, function() {
      isEq(skip(mb1, mb2), mb1).should.be.true;
      isEq(skip(tup1, tup2), tup1).should.be.true;
      isEq(skip(lst1, lst2), list(1,1,1,2,2,2,3,3,3)).should.be.true;
    });
  });
  describe(`liftA()`, function() {
    it(`should lift a function into an applicative context`, function() {
      isEq(liftA(f, mb1), mb2).should.be.true;
      isEq(liftA(f, lst1), list(10,20,30)).should.be.true;
    });
  });
  describe(`liftA2()`, function() {
    it(`should lift a binary function to actions`, function() {
      const k1 = (x, y) => {
        const k1_ = (x, y) => x * y;
        return partial(k1_, x, y);
      }
      isEq(liftA2(k1, mb1, mb2), just(10)).should.be.true;
      isEq(liftA2(k1, lst1, lst5), list(10,10,10,20,20,20,30,30,30)).should.be.true;
    });
  });
  describe(`liftA3()`, function() {
    it(`should lift a ternary function to actions`, function() {

    });
  });
});
