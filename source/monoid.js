/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * monoid.js
 *
 * @file Monoid type class.
 * @license ISC
 */

/** @module monoid */

import {partial} from './base';

import {foldr} from './foldable';

import {
  defines,
  dataType,
  typeCheck
} from './type';

import {error} from './error';

/** @const {Function} Monoid
 * A `Monoid` is a type with an associative binary operation that has an identity. In plainer
 * language, a monoid is any type that has an "empty" value that, when "appended" to any other value
 * of that type, equals that same value. For example, an integer is a monoid, because any integer
 * added to 0, the "empty" value, equals that integer. Likewise, a list is a monoid, because any
 * list appended to the empty list equals the original list. Monoids must define `mempty` and
 * @param {*} - Any object.
 * @returns {boolean} - `true` if an object is an instance of `Monoid` and `false` otherwise.
 */
export const Monoid = defines(`mempty`, `mappend`);

/** @function mempty
 * Return the identity (or "empty") value for the monoid.
 * Haskell> mempty :: a
 * @param {Object} a - Any monoid.
 * @returns {Object} - Identity value for the monoid.
 */
export const mempty = a => Monoid(a) ? dataType(a).mempty(a) : error.typeError(a, mempty);

/** @function mappend
 * Perform an associative operation (similar to appending to a list) on two monoids.
 * Haskell> mappend :: a -> a -> a
 * @param {Object} a - Any monoid.
 * @param {Object} b - Any monoid.
 * @returns {Object} - A new monoid of the same type, the result of the associative operation.
 * @example
 * const l1 = list(1,2,3);       // => [1:2:3:[]]
 * const l2 = list(4,5,6);       // => [4:5:6:[]]
 * const l3 = list(7,8,9);       // => [7:8:9:[]]
 * mappend(mempty(l1), l1);      // => [1:2:3:[]]
 * mappend(l1, mappend(l2, l3)); // => [1:2:3:4:5:6:7:8:9:[]]
 * mappend(mappend(l1, l2), l3); // => [1:2:3:4:5:6:7:8:9:[]]
 */
export const mappend = (a, b) => {
  const mappend_ = (a, b) => {
    if (typeCheck(a, b)) {
      return Monoid(a) ? dataType(a).mappend(a, b) : error.typeError(a, mappend);
    }
    return error.typeMismatch(a, b, mappend);
  }
  return partial(mappend_, a, b);
}

/** @function mconcat
 * Fold a list using the monoid. Concatenates a list of monoids into a single list. Since lists
 * themselves are monoids, for example, `mconcat` will flatten a list of lists into a single list.
 * Haskell> mconcat :: [a] -> a
 * @param {Object} a - Any monoid.
 * @returns {Object} - A new monoid of the same type, the result of the concatenation.
 * @example
 * const l1 = list(1,2,3);    // => [1:2:3:[]]
 * const l2 = list(4,5,6);    // => [4:5:6:[]]
 * const l3 = list(7,8,9);    // => [7:8:9:[]]
 * const ls = list(l1,l2,l3); // => [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 * mconcat(ls);               // => [1:2:3:4:5:6:7:8:9:[]]
 */
export const mconcat = a => foldr(mappend, mempty(a), a);
