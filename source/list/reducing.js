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

/** @function foldl
 * Left-associative fold of a structure (i.e. fold from the end to the beginning, rather than from
 * the beginning to the end, as with `foldr`). This function currently only works with `List`
 * objects but should be generalized to work with all `Foldable` types, as in Haskell.
 * Haskell> foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 * @param {Function} f - The function to map over the list.
 * @param {*} z - An accumulator value.
 * @param {List} as - The `List` to fold.
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x - y;
 * foldl(f, 0, lst);          // => -6
 */
export const foldl = (f, z, as) => {
  const foldl_ = (f, z, as) => last(scanl(f, z, as));
  return partial(foldl_, f, z, as);
}
