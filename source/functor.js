/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * functor.js
 *
 * @file Functor type class.
 * @license ISC
 */

/** @module functor */

import {
  partial,
  constant
} from './base';

import {
  defines,
  dataType
} from './type';

import {error} from './error';

/**
 * A `Functor` is a type that can be mapped over. This includes lists and other collections, but
 * functions themselves as well as other sorts of values could conceivably be mapped over, so no one
 * metaphor covers all possible cases.
 * @param {*} - Any object
 * @returns {boolean} `true` if an object is an instance of `Functor` and `false` otherwise
 * @kind function
 */
export const Functor = defines(`fmap`);

/**
 * Map a function over a functor, a data type that specifies how functions may be mapped over it.
 * <br>`Haskell> fmap :: (a -> b) -> f a -> f b`
 * @param {Function} f - The function to map
 * @param {Object} a - The functor to map over
 * @returns {Object} A new functor of the same type, the result of the mapping
 * @kind function
 * @example
 * const lst = list(1,2,3);  // => [1:2:3:[]]
 * fmap(id, lst);            // => [1:2:3:[]]
 * const f = x => x * 11;
 * const g = x => x * 100;
 * $(fmap(f))(fmap(g))(lst); // => [1100:2200:3300:[]]
 * fmap($(f)(g))(lst);       // => [1100:2200:3300:[]]
 */
export const fmap = (f, a) => {
  const fmap_ = (f, a) => Functor(a) ? dataType(a).fmap(f, a) : error.typeError(a, fmap);
  return partial(fmap_, f, a);
}

/**
 * Replace all locations in a functor with the same value.
 * <br>`Haskell> (<$) :: a -> f b -> f a`
 * @param {*} a - The value to inject into the functor
 * @param {Object} b - The functor to map over
 * @returns {Object} A new functor of the same type, with the values of the original replaced by
 * the new value
 * @kind function
 * @example
 * const lst = list(1,2,3); // => [1:2:3:[]]
 * fmapReplaceBy(5, lst);   // => [5:5:5:[]]
 */
export const fmapReplaceBy = (a, b) => {
  const fmapReplaceBy_ = (a, b) => fmap(constant(a), b);
  return partial(fmapReplaceBy_, a, b);
}
