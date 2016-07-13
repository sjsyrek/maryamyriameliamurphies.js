/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/num.js
 *
 * @file Numeric functions.
 * @license ISC
 */

/** @module base/num */

import {
  $,
  not
} from '../base';

/** @function even
 * Return `true` if a value is even, `false` otherwise.
 * Haskell> even :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if even, `false` otherwise.
 */
export const even = a => a % 2 === 0;

/** @function odd
 * Return `true` if a value is odd, `false` otherwise.
 * Haskell> odd :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if odd, `false` otherwise.
 */
export const odd = a => $(not)(even)(a);
