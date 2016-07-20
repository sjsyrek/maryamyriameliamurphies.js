/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * test/error-test.js
 *
 * @file Tests for error handling functions.
 * @license ISC
 */

/* global describe, it */

import {
  error,
  throwError
} from '../source';

describe(`error handling functions`, function() {
  describe(`error()`, function() {
    it(`should throw errors`, function() {
      error.emptyList.bind(null, 0, 0).should.throw(Error);
      error.listError.bind(null, 0, 0).should.throw(Error);
      error.nothing.bind(null, 0, 0).should.throw(Error);
      error.rangeError.bind(null, 0, 0).should.throw(Error);
      error.returnError.bind(null, 0, 0).should.throw(Error);
      error.tupleError.bind(null, 0, 0).should.throw(Error);
      error.typeError.bind(null, 0, 0).should.throw(Error);
      error.typeError.bind(null, () => {}, 0).should.throw(Error);    
      error.typeMismatch.bind(null, 0, 0, 0).should.throw(Error);
    });
  });
  describe(`throwError()`, function() {
    it(`should throw an error`, function() {
      throwError.bind(null).should.throw;
    });
  });
});
