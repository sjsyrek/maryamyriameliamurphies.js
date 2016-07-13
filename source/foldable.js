/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * foldable.js
 *
 * @file Foldable type class.
 * @license ISC
 */

/** @module foldable */

import {
  partial,
  $,
  id
} from './base';

import {
  defines,
  dataType
} from './type';

import {
  Monoid,
  mconcat
} from './monoid';

import {fmap} from './functor';

import {error} from './error';

/** @const {Function} Foldable
 * A `Foldable` is a data structure that can be folded into a summary value. Lists are a common form
 * of foldable. Instances of Foldable must define a `foldr` method.
 * @param {*} - Any object.
 * @returns {boolean} - `true` if an object is an instance of `Foldable` and `false` otherwise.
 */
const Foldable = defines(`foldr`);

/** @function fold
 * Combine the elements of a structure using a monoid. For example, fold a list of lists into a
 * single list.
 * Haskell> fold :: Monoid m => t m -> m
 * @param {Object} a - The monoid to fold.
 * @returns {Object} - The folded monoid.
 * @example
 * const lst = list(1,2,3); // => [1:2:3:[]]
 * const llst = list(lst);  // => [[1:2:3:[]]:[]]
 * fold(llst);              // => [1:2:3:[]]
 */
export const fold = a => foldMap(id, a);

/** @function foldMap
 * Map each element of the structure to a monoid, and combine the results.
 * Haskell> foldMap :: Monoid m => (a -> m) -> t a -> m
 * @param {Function} f - The function to map.
 * @param {Object} a - The monoid to map over.
 * @returns {Object} - A new monoid of the same type, the result of the mapping.
 * @example
 * const lst = list(1,2,3);
 * const f = x => list(x * 3);
 * foldMap(f, lst);            // => [3:6:9:[]]
 */
export const foldMap = (f, a) => {
  const foldMap_ = (f, a) => Monoid(a) ? $(mconcat)(fmap(f))(a) : error.typeError(a, foldMap);
  return partial(foldMap_, f, a);
 }

/** @function foldr
 * Right-associative fold of a structure. This is the work horse function of `Foldable`.
 * Haskell> foldr :: (a -> b -> b) -> b -> t a -> b
 * @param {Function} f - A binary function.
 * @param {*} z - A base accumulator value.
 * @param {Object} t - A `Foldable` type.
 * @returns {*} - The result of applying the function to the foldable and the accumulator.
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x + y;
 * foldr(f, 0, lst);          // => 6
 */
export const foldr = (f, z, t) => {
  const foldr_ = (f, z, t) => {
    return Foldable(t) ? dataType(t).foldr(f, z, t) : error.typeError(t, foldr);
  }
  return partial(foldr_, f, z, t);
}
