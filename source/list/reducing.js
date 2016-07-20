/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/reducing.js
 *
 * @file Functions for reducing lists.
 * @license ISC
 */

/** @module list/reducing */

import {partial} from '../base';

import {
  last,
  scanl
} from '../list';

/**
 * Left-associative fold of a structure (i.e. fold from the end to the beginning, rather than from
 * the beginning to the end, as with `foldr`, the right-associative version). This function
 * currently only works with `List` objects but should be generalized to work with all `Foldable`
 * types, as in Haskell.
 * <br>`Haskell> foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
 * @param {Function} f - The function to map over the `List`
 * @param {*} z - An accumulator value
 * @param {List} xs - The `List` to fold
 * @returns {*} The result of applying the function to the `List` and the accumulator
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x - y;
 * foldl(f, 0, lst);          // => -6
 */
export const foldl = (f, z, xs) => {
  const foldl_ = (f, z, xs) => last(scanl(f, z, xs));
  return partial(foldl_, f, z, xs);
}
