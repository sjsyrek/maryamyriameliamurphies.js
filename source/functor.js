/**
 * maryamyriameliamurphies.js
 *
 * @name functor.js
 * @author Steven J. Syrek
 * @file Functor type class.
 * @license ISC
 */

/** @module maryamyriameliamurphies.js/source/functor */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functor

/**
 * A `Functor` is a type that can be mapped over. This includes lists and other collections, but functions
 * themselves as well as other sorts of values can also be mapped over, so no one metaphor is likely to
 * cover all possible cases. Functors must define an `fmap` method.
 * @const {Function} - Returns `true` if an object is an instance of `Functor` and `false` otherwise.
 */
const Functor = defines(`fmap`);

/**
 * Map a function over a functor, which is a type that specifies how functions may be mapped over it.
 * Haskell> fmap :: (a -> b) -> f a -> f b
 * @param {Function} f - The function to map.
 * @param {Object} a - The functor to map over.
 * @returns {Object} - A new functor of the same type, the result of the mapping.
 * @example
 * const lst = list(1,2,3);   // => [1:2:3:[]]
 * fmap(id, lst);           // => [1:2:3:[]]
 * const f = x => x * 11;
 * const g = x => x * 100;
 * $(fmap(f))(fmap(g))(lst) // => [1100:2200:3300:[]]
 * fmap($(f)(g))(lst)       // => [1100:2200:3300:[]]
 */
export function fmap(f, a) {
  const fmapP = (f, a) => Functor(a) ? dataType(a).fmap(f, a) : error.typeError(a, fmap);
  return partial(fmapP, f, a);
}

/**
 * Replace all locations in a functor with the same value.
 * Haskell> (<$) :: a -> f b -> f a
 * @param {*} a - The value to inject into the functor.
 * @param {Object} b - The functor to map over.
 * @returns {Object} - A new functor of the same type, with the values of the original replaced by the new value.
 * @example
 * const lst = list(1,2,3); // => [1:2:3:[]]
 * fmapReplaceBy(5, lst)  // => [5:5:5:[]]
 */
export function fmapReplaceBy(a, b) {
  const fmapReplaceByP = (a, b) => fmap(constant(a), b);
  return partial(fmapReplaceByP, a, b);
}
