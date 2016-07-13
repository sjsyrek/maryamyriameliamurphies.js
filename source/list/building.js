/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/building.js
 *
 * @file Functions for building lists.
 * @license ISC
 */

/** @module list/building */

import {partial} from '../base';

import {
  emptyList,
  list,
  listAppend,
  cons,
  head,
  tail,
  isList,
  isEmpty
} from '../list';

import {error} from '../error';

/** @function scanl
 * Scan a `List` from the right to left and return a `List` of successive reduced values.
 * Haskell> scanl :: (b -> a -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q - An accumulator value.
 * @param {List} ls - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * const lst = list(1,2,3)
 * const f = (x, y) => x - y;
 * scanl(f, 0, lst);          // => [0:-1:-3:-6:[]]
 */
export const scanl = (f, q, ls) => {
  const scanl_ = (f, q, ls) => {
    if (isList(ls) === false) { return error.listError(ls, scanl); }
    if (isEmpty(ls)) { return cons(q)(emptyList); }
    const x = head(ls);
    const xs = tail(ls);
    return cons(q)(p(f, f(q, x), xs));
  }
  return partial(scanl_, f, q, ls);
}

/** @function scanr
 * Like `scanl` but scans left to right instead of right to left.
 * Haskell> scanr :: (a -> b -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q0 - An accumulator value.
 * @param {List} as - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x - y;
 * scanr(f, 0, lst);          // => [2:-1:3:0:[]]
 */
export const scanr = (f, q0, as) => {
  const scanr_ = (f, q0, as) => {
    if (isList(as) === false) { return error.listError(ls, scanr); }
    if (isEmpty(as)) { return list(q0); }
    const x = head(as);
    const xs = tail(as);
    const qs = scanr(f, q0, xs);
    const q = head(qs);
    return cons(f(x, q))(qs);
  }
  return partial(scanr_, f, q0, as);
}
