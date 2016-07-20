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
  pure,
  ap,
  apFlip,
  then,
  skip,
  liftA,
  liftA2,
  Nothing,
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
      pure(mb1, 5).should.eql(just(5));
      pure(tup1, tup2).should.eql(tuple(unit, lst4));
      pure(lst1, 5).should.eql(list(5));
    });
    it(`should throw an error if the first argument is not an applicative functor`, function() {
      pure.bind(null, 0, 5).should.throw();
    });
  });
  describe(`ap()`, function() {
    it(`should apply a function in an applicative context to an applicative functor`, function() {
      ap(p, lst1).should.eql(lst1); // identity
      const comp = list(30,60,90);
      ap(ap(ap(p$)(pf))(pg))(lst1).should.eql(comp);
      ap(ap(ap(p$, pf), pg), lst1).should.eql(comp);
      ap(pf, ap(pg, lst1)).should.eql(comp); // composition
      ap(pf, pure(lst1, 10)).should.eql(list(100));
      pure(lst1, f(10)).should.eql(list(100)); // homomorphism
      ap(pf, pure(lst1, 3)).should.eql(list(30));
      const a = pure(lst1, 3);
      ap(pf, a).should.eql(list(30)); // interchange
    });
    it(`should throw an error if either argument is not an applicative functor`, function() {
      ap.bind(null, 0, pf).should.throw();
      ap.bind(null, pf, 0).should.throw();
    });
    it(`should return Nothing if Nothing is passed as the first argument`, function() {
      ap(Nothing, mb1).should.equal(Nothing);
    });
  });
  describe(`apFlip()`, function() {
    it(`should apply a function to an applicative functor with its arguments reversed`, function() {
      apFlip(h1, lst1, lst5).should.eql(list(10,10,10,20,20,20,30,30,30));
      apFlip(h2, lst1, lst5).should.eql(list(11,11,11,12,12,12,13,13,13));
      apFlip(h3, lst1, lst5).should.eql(list(9,9,9,8,8,8,7,7,7));
    });
  });
  describe(`then()`, function() {
    it(`should sequence actions and discard the value of the first argument`, function() {
      then(mb1, mb2).should.eql(mb2);
      then(tup1, tup2).should.eql(tup2);
      then(lst1, lst2).should.eql(list(4,5,6,4,5,6,4,5,6));
    });
  });
  describe(`skip()`, function() {
    it(`should sequence actions and discard the value of the second argument`, function() {
      skip(mb1, mb2).should.eql(mb1);
      skip(tup1, tup2).should.eql(tup1);
      skip(lst1, lst2).should.eql(list(1,1,1,2,2,2,3,3,3));
    });
  });
  describe(`liftA()`, function() {
    it(`should lift a function into an applicative context`, function() {
      liftA(f, mb1).should.eql(mb2);
      liftA(f, lst1).should.eql(list(10,20,30));
    });
  });
  describe(`liftA2()`, function() {
    it(`should lift a binary function to actions`, function() {
      const k1 = (x, y) => {
        const k1_ = (x, y) => x * y;
        return partial(k1_, x, y);
      }
      liftA2(k1, mb1, mb2).should.eql(just(10));
      liftA2(k1, lst1, lst5).should.eql(list(10,10,10,20,20,20,30,30,30));
    });
  });
  // describe(`liftA3()`, function() {
  //   it(`should lift a ternary function to actions`, function() {
  //
  //   });
  // });
});
