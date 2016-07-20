/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/sub-test.js
 *
 * @file Tests for sublist functions.
 * @license ISC
 */

/* global describe, it */

import {
  isEq,
  Nothing,
  just,
  tuple,
  list,
  fromStringToList,
  take,
  drop,
  splitAt,
  takeWhile,
  dropWhile,
  span,
  spanNot,
  stripPrefix,
  group,
  groupBy
} from '../../source';

describe(`Tests for sublist functions`, function() {
  const lst1 = list(1,2,3);
  const lst2 = list(1,2,3,4,1,2,3,4);
  const lst3 = list(1,2,3,4,5,1,2,3);
  const f = x => x < 3;
  const g = x => x;
  describe(`take()`, function() {
    it(`should return the prefix of a list of a given length`, function() {
      take(2, lst1).should.eql(list(1,2));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      take.bind(null, 2, 0).should.throw;
    });
  });
  describe(`drop()`, function() {
    it(`should return the suffix of a list after discarding a specified number of values`, function() {
      drop(2, lst1).should.eql(list(3));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      drop.bind(null, 2, 0).should.throw;
    });
  });
  describe(`splitAt()`, function() {
    it(`should return a tuple of the prefix and remainder of a list of a given length`, function() {
      splitAt(2, lst1).should.eql(tuple(list(1,2),list(3)));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      splitAt.bind(null, 2, 0).should.throw;
    });
  });
  describe(`takeWhile()`, function() {
    it(`should return the longest prefix of a list of values that satisfy a predicate function`, function() {
      takeWhile(f, lst2).should.eql(list(1,2));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      takeWhile.bind(null, f, 0).should.throw;
    });
    it(`should throw an error if the predicate function does not return a boolean value`, function() {
      takeWhile.bind(null, g, 0).should.throw;
    });
  });
  describe(`dropWhile()`, function() {
    it(`should drop values from a list while a given predicate function returns true`, function() {
      dropWhile(f, lst3).should.eql(list(3,4,5,1,2,3));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      dropWhile.bind(null, f, 0).should.throw;
    });
    it(`should throw an error if the predicate function does not return a boolean value`, function() {
      dropWhile.bind(null, g, 0).should.throw;
    });
  });
  describe(`span()`, function() {
    it(`should return a tuple of the longest prefix of a list of values that satisfy a predicate function and the rest of the list`, function() {
      span(f, lst2).should.eql(tuple(list(1,2),list(3,4,1,2,3,4)));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      span.bind(null, f, 0).should.throw;
    });
  });
  describe(`spanNot()`, function() {
    it(`should return a tuple of the longest prefix of a list of values that do not satisfy a predicate function and the rest of the list`, function() {
      spanNot(f, lst2).should.eql(tuple(list(1,2,3),list(4,1,2,3,4)));
    });
  });
  describe(`stripPrefix()`, function() {
    const prefix = fromStringToList(`foo`);
    it(`should drop the given prefix from a list and return the rest of the list in a Just`, function() {
      stripPrefix(prefix, fromStringToList(`foobar`)).should.eql(just(list(`b`,`a`,`r`)));
      stripPrefix(prefix, fromStringToList(`foo`)).should.eql(just(list(list())));
    });
    it(`should return Nothing if the list does not start with the prefix`, function() {
      stripPrefix(prefix, fromStringToList(`barfoo`)).should.equal(Nothing);
      stripPrefix(prefix, fromStringToList(`barfoobaz`)).should.equal(Nothing);
    });
    it(`should throw an error if either argument is not a list`, function() {
      stripPrefix.bind(null, prefix, 0).should.throw;
      stripPrefix.bind(null, 0, fromStringToList(`foobar`)).should.throw;
    });
  });
  describe(`group()`, function() {
    it(`should take a list and return a list of lists such that the concatenation of the result is equal to the argument`, function() {
      const str = fromStringToList(`Mississippi`);
      group(str).should.eql(list(list(`M`,`i`,`ss`,`i`,`ss`,`i`,`pp`,`i`)));
    });
  });
  describe(`groupBy()`, function() {
    it(`should group the elements of a list using a given equality function`, function() {
      groupBy(isEq, list(1,2,3,3,2,1,2,1,3)).should.eql(list(list(1,1,1),list(2,2,2),list(3,3,3)));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      groupBy.bind(null, f, 0).should.throw;
    });
  });
});
