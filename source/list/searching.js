/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/searching.js
 *
 * @file Functions for searching lists.
 * @license ISC
 */

/** @module list/searching */

import {partial} from '../base';

import {
  Nothing,
  just
} from '..maybe';

import {
  fst,
  snd
} from '../tuple';

import {
  emptyList,
  cons,
  head,
  tail,
  isList,
  isEmpty
} from '../list';

import {error} from '../error';

/** @function lookup
 * Look up a key in an association list. For a list of `Tuple` objects, returns the second element
 * of the first tuple for which the key matches the first element.
 * Haskell> lookup :: Eq a => a -> [(a, b)] -> Maybe b
 * @param {*} key - The key value to lookup.
 * @param {List} assocs - A `List` of `Tuple` objects.
 * @returns {Maybe} - The matching value in a `Just` or `Nothing`, otherwise.
 * @example
 * const assocs =
 *   list(tuple(1,2), tuple(3,4), tuple(3,3), tuple(4,2)); // [(1,2):(3,4):(3,3):(4,2):[]]
 * lookup(3, assocs);                                      // => Just 4
 * lookup(5, assocs);                                      // => Nothing
 */
export const lookup = (key, assocs) => {
  const lookup_ = (key, assocs) => {
    if (isList(assocs) === false) { return error.listError(assocs, lookup); }
    if (isEmpty(assocs)) { return Nothing; }
    const xy = head(assocs);
    const xys = tail(assocs);
    const x = fst(xy);
    const y = snd(xy);
    if (key === x) { return just(y); }
    return lookup(key, xys);
  }
  return partial(lookup_, key, assocs);
}

/** @function filter
 * Return the `List` of elements in a `List` for which a function `f` returns `true`.
 * Haskell> filter :: (a -> Bool) -> [a] -> [a]
 * @param {Function} f - The filter function. Must return a `boolean`.
 * @param {List} as - The `List` to filter.
 * @returns {List} - The filtered `List`.
 * @example
 * const lst = listRange(1,50);
 * const f = x => and(odd(x), greaterThan(x, 10));
 * filter(f, lst); // => [11:13:15:17:19:21:23:25:27:29:31:33:35:37:39:41:43:45:47:49:[]]
 */
export const filter = (f, as) => {
  const filter_ = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, filter); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    if (f(x) === true) { return cons(x)(filter(f, xs)); }
    if (f(x) === false) { return filter(f, xs); }
    return error.returnError(f, filter);
  }
  return partial(filter_, f, as);
}
