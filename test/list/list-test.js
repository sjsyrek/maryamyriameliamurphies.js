/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/list/list-test.js
 *
 * @file Tests for basic List functions.
 * @license ISC
 */

/* global describe, it */

import {
  even,
  just,
  tuple,
  emptyList,
  list,
  listRange,
  listRangeLazy,
  listRangeLazyBy,
  listFilter,
  listAppend,
  cons,
  head,
  last,
  tail,
  init,
  uncons,
  empty,
  length,
  isList,
  isEmpty,
  fromArrayToList,
  fromListToArray,
  fromListToString,
  fromStringToList
} from '../../source';

describe(`List data type`, function() {
  const lst1 = list(1,2,3);
  const lst2 = list(4,5,6);
  const lst3 = list();
  const str = list(`a`,`b`,`c`);
  const arr = [1,2,3];
  const f = x => x + 5;
  const evens = x => even(x);
  it(`should return [Object List] when cast to a string`, function() {
    lst1.toString().should.equal(`[Object List]`);
  });
  it(`should return a list string, e.g. "[1:2:3:[]]", as its value`, function() {
    lst1.valueOf().should.equal(`[1:2:3:[]]`);
  });
  describe(`emptyList`, function() {
    it(`should be an empty list`, function() {
      lst3.should.equal(emptyList);
      emptyList.should.equal(lst3);
    });
  });
  describe(`list()`, function() {
    it(`should create a new list from a series of zero or more values`, function() {
      list(1,2,3).should.eql(lst1);
      list().should.equal(emptyList);
    });
  });
  describe(`listRange()`, function() {
    it(`should build a list from a range of values`, function() {
      listRange(0, 100, f).should.eql(list(0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95));
      listRange(0, 100, f, evens).should.eql(list(0,10,20,30,40,50,60,70,80,90));
    });
  });
  describe(`listRangeLazy()`, function() {
    it(`should build a list from a range of values`, function() {
      listRangeLazy(1,5).should.eql(list(1,2,3,4,5));
    });
  });
  describe(`listRangeLazyBy()`, function() {
    it(`should build a list from a range of values and using a custom step function`, function() {
      listRangeLazyBy(1, 25, f).should.eql(list(1,6,11,16,21));
    });
  });
  describe(`listFilter()`, function() {
    it(`should build a list from a range of enumerated values, filtered through a boolean function`, function() {
      listFilter(1, 10, evens).should.eql(list(2,4,6,8));
    });
  });
  describe(`listAppend()`, function() {
    it(`should append one list to another`, function() {
      listAppend(lst1, lst2).should.eql(list(1,2,3,4,5,6));
    });
    it(`should throw an error if either argument is not a list`, function() {
      listAppend.bind(null, 0, lst2).should.throw();
      listAppend.bind(null, lst1, 0).should.throw();
    });
    it(`should throw an error if the lists are not the same type`, function() {
      listAppend.bind(null, lst1, str).should.throw();
    });
  });
  describe(`cons()`, function() {
    it(`should create a new list from a head and tail`, function() {
      cons(3)(lst2).should.eql(list(3,4,5,6));
    });
  });
  describe(`head()`, function() {
    it(`should extract the first element of a list`, function() {
      head(lst1).should.equal(1);
    });
    it(`should throw an error if the list is empty`, function() {
      head.bind(null, lst3).should.throw();
    });
    it(`should throw an error if the argument is not a list`, function() {
      head.bind(null, 0).should.throw();
    });
  });
  describe(`last()`, function() {
    it(`should extract the last element of a list`, function() {
      last(lst1).should.equal(3);
    });
    it(`should throw an error if the list is empty`, function() {
      last.bind(null, lst3).should.throw();
    });
    it(`should throw an error if the argument is not a list`, function() {
      last.bind(null, 0).should.throw();
    });
  });
  describe(`tail()`, function() {
    it(`should extract the elements after the head of a list`, function() {
      tail(lst1).should.eql(list(2,3));
    });
    it(`should throw an error if the list is empty`, function() {
      tail.bind(null, lst3).should.throw();
    });
    it(`should throw an error if the argument is not a list`, function() {
      tail.bind(null, 0).should.throw();
    });
  });
  describe(`init()`, function() {
    it(`should return all the elements of a list except the last one`, function() {
      init(lst1).should.eql(list(1,2));
    });
    it(`should throw an error if the list is empty`, function() {
      init.bind(null, lst3).should.throw();
    });
    it(`should throw an error if the argument is not a list`, function() {
      init.bind(null, 0).should.throw();
    });
  });
  describe(`uncons()`, function() {
    it(`should decompose a list into its head and tail`, function() {
      uncons(lst1).should.eql(just(tuple(1,list(2,3))));
    });
  });
  describe(`empty()`, function() {
    it(`should return true if a foldable structure is empty`, function() {
      empty(lst3).should.be.true;
    });
    it(`should return false if a foldable structure is not empty`, function() {
      empty(lst1).should.be.false;
    });
  });
  describe(`length()`, function() {
    it(`should return the length of a list`, function() {
      length(lst1).should.equal(3);
    });
    it(`should throw an error if the argument is not a list`, function() {
      length.bind(null, 0).should.throw();
    });
  });
  describe(`isList()`, function() {
    it(`should return true if the argument is a list`, function() {
      isList(lst1).should.be.true;
      isList(lst3).should.be.true;
    });
    it(`should return false if the argument is not a list`, function() {
      isList(0).should.be.false;
    });
  });
  describe(`isEmpty()`, function() {
    it(`should return true if the argument is an empty list`, function() {
      isEmpty(lst3).should.be.true;
    });
    it(`should return false if the argument list is not empty`, function() {
      isEmpty(lst1).should.be.false;
    });
    it(`should throw an error if the argument is not a list`, function() {
      isEmpty.bind(null, 0).should.throw();
    });
  });
  describe(`fromArrayToList()`, function() {
    it(`should convert an array into a list`, function() {
      fromArrayToList(arr).should.eql(lst1);
    });
    it(`should throw an error if the argument is not an array`, function() {
      isEmpty.bind(null, 0).should.throw();
    });
  });
  describe(`fromListToArray()`, function() {
    it(`should convert a list into an array`, function() {
      fromListToArray(lst1).should.eql(arr);
    });
    it(`should throw an error if the argument is not a list`, function() {
      fromListToArray.bind(null, 0).should.throw();
    });
  });
  describe(`fromListToString()`, function() {
    it(`should convert a list into a string`, function() {
      fromListToString(str).should.equal(`abc`);
    });
    it(`should throw an error if the argument is not a list`, function() {
      fromListToString.bind(null, 0).should.throw();
    });
  });
  describe(`fromStringToList()`, function() {
    it(`should convert a string into a list`, function() {
      fromStringToList(`abc`).should.eql(str);
    });
    it(`should throw an error if the argument is not a string`, function() {
      fromListToArray.bind(null, 0).should.throw();
    });
  });
});
