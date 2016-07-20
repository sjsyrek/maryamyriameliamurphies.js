/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * eq.js
 *
 * @file Eq type class.
 * @license ISC
 */

/** @module eq */

import {partial} from './base';

import {
  defines,
  dataType,
  typeCheck
} from './type';

import {error} from './error';

/**
 * The `Eq` type class defines equality and inequality. Instances of `Eq` must define an `isEq`
 * method.
 * @param {*} - Any object
 * @returns {boolean} `true` if an object is an instance of `Eq` and `false` otherwise
 * @kind function
 */
export const Eq = defines(`isEq`);

/**
 * Compare two objects for equality. Both objects must be instances of the `Eq` type class (i.e.
 * they both define an `isEq` method) and must also be the same data type (or primitive type).
 * <br>`Haskell> (==) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a === b
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * isEq(lst1, lst2);         // => false
 * isEq(lst1, list(1,2,3));  // => true
 * isEq(0, 1);               // => false
 * isEq(0, 0);               // => true
 */
export const isEq = (a, b) => {
  const isEq_ = (a, b) => {
    if (typeCheck(a, b)) { return Eq(a) ? dataType(a).isEq(a, b) : a === b; }
    return error.typeMismatch(a, b, isEq);
  }
  return partial(isEq_, a, b);
}

/**
 * Compare two objects for inequality. Both objects must be instances of the `Eq` type class (i.e.
 * they both define an `isEq` method) and must be also be the same data type (or primitive type).
 * <br>`Haskell> (/=) :: a -> a -> Bool`
 * @param {*} a - Any object
 * @param {*} b - Any object
 * @returns {boolean} a !== b
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * isNotEq(lst1, lst2);        // => true
 * isNotEq(lst1, list(1,2,3)); // => false
 * isNotEq(0, 1);              // => true
 * isNotEq(0, 0);              // => false
 */
export const isNotEq = (a, b) => {
  const isNotEq_ = (a, b) => !isEq(a, b);
  return partial(isNotEq_, a, b);
}
