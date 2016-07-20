/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/base/bool-test.js
 *
 * @file Tests for boolean functions.
 * @license ISC
 */

/* global describe, it */

import {
  and,
  or,
  not
} from '../../source';

describe(`Boolean functions`, function() {
  describe(`and()`, function() {
   it(`should return true if both of two values are true`, function() {
     and(true, true).should.be.true;
   });
   it(`should return false if either of two values is false`, function() {
     and(true, false).should.be.false;
     and(false, true).should.be.false;
   });
   it(`should throw an error if either argument is not a boolean value`, function() {
     and.bind(null, true, 0);
     and.bind(null, 0, false);
   });
  });
  describe(`or()`, function() {
   it(`should return true if either of two values are true`, function() {
     or(true, false).should.be.true;
     or(false, true).should.be.true;
     or(true, true).should.be.true;
   });
   it(`should return false if both of two values are false`, function() {
     or(false, false).should.be.false;
   });
   it(`should throw an error if either argument is not a boolean value`, function() {
     or.bind(null, true, 0);
     or.bind(null, 0, false);
   });
  });
  describe(`not()`, function() {
   it(`should return false if a value is true`, function() {
     not(true);
   });
   it(`should return true if a value is false`, function() {
     not(false);
   });
   it(`should throw an error if the argument is not a boolean value`, function() {
     and.bind(null, 0);
   });
  });
});
