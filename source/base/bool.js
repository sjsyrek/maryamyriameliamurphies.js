/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/bool.js
 *
 * @file Boolean functions.
 * @license ISC
 */

/** @module base/bool */

import {partial} from '../base';

import {type} from '../type';

import {error} from '../error';

/** @function and
 * Boolean "and". Return `true` if both arguments are true, `false` otherwise.
 * Haskell> (&&) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @returns {boolean} - a && b.
 * @example
 * and(true, true); // => true
 * const a = 5 > 0;
 * const b = 0 > 5;
 * and(a, b);       // => false
 */
export const and = (a, b) => {
  const and_ = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, and); }
    if (type(b) !== `boolean`) { return error.typeError(b, and); }
    if (a) { return b; }
    return false;
  }
  return partial(and_, a, b);
}

/** @function or
 * Boolean "or". Return `true` if either argument is true, `false` otherwise.
 * Haskell> (||) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @returns {boolean} - a || b.
 * @example
 * or(true, false); // => true
 * const a = 5 > 0;
 * const b = 0 > 5;
 * or(a, b);        // => true
 */
export const or = (a, b) => {
  const or_ = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, or); }
    if (type(b) !== `boolean`) { return error.typeError(b, or); }
    if (a)  { return true; }
    return b;
  }
  return partial(or_, a, b);
}

/** @function not
 * Boolean "not". Return `true` if the argument is false, `false` otherwise.
 * Example: {@code not(false) // true }
 * Haskell> not :: Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @returns {boolean} - !a.
 * @example
 * not(true);       // => false
 * not(false);      // => true
 * const a = 5 > 0;
 * const b = 0 > 5;
 * not(a);          // => false
 * not(b);          // => true
 */
export const not = a => {
  if (type(a) !== `boolean`) { return error.typeError(a, not); }
  if (a) { return false; }
  return true;
}
