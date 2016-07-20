/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/trans-test.js
 *
 * @file Tests for List transformation functions.
 * @license ISC
 */

/* global describe, it */

import {
  list,
  fromStringToList,
  map,
  reverse,
  intersperse,
  intercalate,
  transpose
} from '../../source';

describe(`List data type`, function() {
  const lst1 = list(1,2,3,4,5);
  const lst2 = list(1,2,3);
  const lst3 = list(4,5,6);
  const f = x => x * 3;
  describe(`map()`, function() {
    it(`should map a function over a list and return the results in a new list`, function() {
      map(f, lst1).should.eql(list(3,6,9,12,15));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      map.bind(null, f, 0).should.throw();
    });
  });
  describe(`reverse()`, function() {
    it(`should `, function() {
      reverse(lst1).should.eql(list(5,4,3,2,1));
    });
  });
  describe(`intersperse()`, function() {
    it(`should intersperse a separator between the elements of a list`, function() {
      intersperse(0, lst1).should.eql(list(1,0,2,0,3,0,4,0,5,0));
      const str = fromStringToList(`abc`);
      intersperse(`|`, str).should.eql(list(`a`,`|`,`b`,`|`,`c`));
    });
    it(`should throw an error if the second argument is not a list`, function() {
      intersperse.bind(null, `|`, 0).should.throw();
    });
    it(`should throw an error if the separator is not the same type as the list`, function() {
      intersperse.bind(null, `|`, lst1).should.throw();
    });
  });
  describe(`intercalate()`, function() {
    const l1 = list(1,1,1);
    const l2 = list(2,2,2);
    const l3 = list(3,3,3);
    const xs = list(0,0,0);
    const xss = list(l1, l2, l3);
    it(`should insert a list in between the lists in a list of lists`, function() {
      intercalate(xs, xss).should.eql(list(1,1,1,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,5,5,5));
    });
  });
  describe(`transpose()`, function() {
    const xss1 = list(lst2, lst3);
    const xss2 = list(list(10,11), list(20), list(), list(30,31,32));
    it(`should transpose the "rows" and "columns" of a list of lists`, function() {
      transpose(xss1).should.eql(list(list(1,4), list(2,5), list(3,6)));
      transpose(xss2).should.eql(list(list(10,20,30), list(11,31), list(32)));
    });
    it(`should throw an error if the argument is not a list`, function() {
      transpose.bind(null, 0).should.throw();
    });
    it(`should throw an error if the argument elements are not also lists`, function() {
      transpose.bind(null, lst1).should.throw();
    });
  });
});
