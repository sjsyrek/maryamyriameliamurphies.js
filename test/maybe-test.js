/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/maybe-test.js
 *
 * @file Tests for Maybe type class.
 * @license ISC
 */

/* global describe, it */

import {
  even,
  Nothing,
  just,
  maybe,
  isMaybe,
  isJust,
  isNothing,
  fromJust,
  fromMaybe,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe,
  list,
  listRange
} from '../source';

describe(`Maybe data type`, function() {
  const mb1 = just(100);
  const mb2 = just();
  const lst1 = list(1,2,3);
  const lst2 = list(just(1), just(2), just(null), just(3), Nothing, just(), just(4), just(5));
  const lst3 = listRange(1, 25);
  const f = x => x * 10;
  const g = x => even(x) ? just(x * 2) : Nothing;
  it(`should return Just <value> when cast to a string, if it is not Nothing`, function() {
    mb1.toString().should.equal(`Just 100`);
  });
  it(`should return Nothing when cast to a string, if it is Nothing`, function() {
    Nothing.toString().should.equal(`Nothing`);
  });
  it(`should return Just <value> as its value, if it is not Nothing`, function() {
    mb1.valueOf().should.equal(`Just 100`);
  });
  it(`should return Nothing as its value, if it is Nothing`, function() {
    Nothing.valueOf().should.equal(`Nothing`);
  });
  describe(`Nothing`, function() {
    it(`should be Nothing`, function() {
      mb2.should.equal(Nothing);
      Nothing.should.equal(mb2);
    });
  });
  describe(`just()`, function() {
    it(`should construct a Just value if the argument is not undefined, null, or NaN`, function() {
      mb1.should.eql(just(100));
    });
    it(`should return Nothing if the argument is undefined, null, or NaN`, function() {
      mb2.should.equal(Nothing);
    });
  });
  describe(`maybe()`, function() {
    it(`should apply a function to a Maybe value if it is a Just`, function() {
      maybe(0, f, mb1).should.equal(1000);
    });
    it(`should return the default value if the Maybe value is Nothing`, function() {
      maybe(0, f, mb2).should.equal(0);
    });
    it(`should throw an error if the third argument is not a Maybe value`, function() {
      maybe.bind(null, 0, f, 0).should.throw();
    });
  });
  describe(`isMaybe()`, function() {
    it(`should return true if the argument is a Maybe value`, function() {
      isMaybe(mb1).should.be.true;
    });
    it(`should return false if the argument is not a Maybe value`, function() {
      isMaybe(0).should.be.false;
    });
  });
  describe(`isJust()`, function() {
    it(`should return true if the argument is a Just`, function() {
      isJust(mb1).should.be.true;
    });
    it(`should return false if the argument is Nothing`, function() {
      isJust(mb2).should.be.false;
    });
    it(`should throw an error if the argument is not a Maybe value`, function() {
      isJust.bind(null, 0).should.throw();
    });
  });
  describe(`isNothing()`, function() {
    it(`should return true if the argument is Nothing`, function() {
      isNothing(mb2).should.be.true;
    });
    it(`should return false if the argument is a Just`, function() {
      isNothing(mb1).should.be.false;
    });
    it(`should throw an error if the argument is not a Maybe value`, function() {
      isNothing.bind(null, 0).should.throw();
    });
  });
  describe(`fromJust()`, function() {
    it(`should extract the value from a Maybe value if it is a Just`, function() {
      fromJust(mb1).should.equal(100);
    });
    it(`should throw an error if the argument is Nothing`, function() {
      fromJust.bind(null, mb2).should.throw();
    });
    it(`should throw an error if the argument is not a Maybe value`, function() {
      fromJust.bind(null, 0).should.throw();
    });
  });
  describe(`fromMaybe()`, function() {
    it(`should return the value contained in a Maybe value if it is a Just`, function() {
      fromMaybe(-1, mb1).should.equal(100);
    });
    it(`should return the default value if the Maybe value is Nothing`, function() {
      fromMaybe(-1, mb2).should.equal(-1);
    });
    it(`should throw an error if the second argument is not a Maybe value`, function() {
      fromMaybe.bind(null, -1, 0).should.throw();
    });
  });
  describe(`listToMaybe()`, function() {
    it(`should return the first value of a list wrapped in a Just`, function() {
      listToMaybe(lst1).should.eql(just(1));
    });
    it(`should return Nothing if the list is an empty list`, function() {
      listToMaybe(list()).should.equal(Nothing);
    });
    it(`should throw an error if the argument is not a list`, function() {
      listToMaybe.bind(null, 0).should.throw();
    });
  });
  describe(`maybeToList()`, function() {
    it(`should return a singleton list if the argument is a Just`, function() {
      maybeToList(mb1).should.eql(list(1));
    });
    it(`should return an empty list if the argument is Nothing`, function() {
      maybeToList(mb2).should.eql(list());
    });
    it(`should throw an error if the argument is not a Maybe value`, function() {
      maybeToList.bind(null, 0).should.throw();
    });
  });
  describe(`catMaybes()`, function() {
    it(`should take a list of Maybe values and return a list of all the Just values`, function() {
      catMaybes(lst2).should.eql(list(1,2,3,4,5));
    });
    it(`should throw an error if the argument is not a list`, function() {
      catMaybes.bind(null, 0).should.throw();
    });
    it(`should throw an error if the list is not a list of Maybe values`, function() {
      catMaybes.bind(null, lst1).should.throw();
    });
  });
  describe(`mapMaybe()`, function() {
    it(`should map a function that returns a Maybe over a list and return a list of all the Just values`, function() {
      mapMaybe(just, lst1).should.eql(lst1);
      mapMaybe(g, lst3).should.eql(list(4,8,12,16,20,24,28,32,36,40,44,48));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      mapMaybe.bind(null, g, 0).should.throw
    });
    it(`should throw an error if the provided function does not return a Maybe value`, function() {
      mapMaybe.bind(null, f, lst3).should.throw();
    });
  });
});
