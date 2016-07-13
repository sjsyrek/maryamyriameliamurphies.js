/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/folds.js
 *
 * @file Special folds for lists.
 * @license ISC
 */

/** @module list/folds */

import {partial} from '../base';

import {
  emptyList,
  listAppend,
  head,
  tail,
  isList,
  isEmpty,
  map
} from '../list';

import {error} from '../error';

/** @function concat
 * Concatenate the elements in a container of lists. Currently, this function only works on `List`
 * objects, though it should in the future work on all `Foldable` types.
 * Haskell> concat :: Foldable t => t [a] -> [a]
 * @param {List} xss - A `List` of lists.
 * @returns {List} - The concatenated `List`.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * const lst3 = list(7,8,9);
 * const xss = list(lst1, lst2, lst3); // [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 * concat(xss);                        // => [1:2:3:4:5:6:7:8:9:[]]
 */
export const concat = xss => {
  if (isList(xss)) {
    if (isEmpty(xss)) { return emptyList; }
    const x = head(xss);
    const xs = tail(xss);
    return isList(x) ? listAppend(x, concat(xs)) : error.listError(x, concat);
  }
  return error.listError(xss, concat);
}

/** @function concatMap
 * Map a function that takes a value and returns a `List` over a `List` of values and concatenate
 * the resulting list. In the future, should work on all `Foldable` types.
 * Haskell> concatMap :: Foldable t => (a -> [b]) -> t a -> [b]
 * @param {Function} f - The function to map.
 * @param {List} as - The `List` to map over.
 * @returns {List} - The `List` of results of mapping `f` over `as`, concatenated.
 * @example
 * const f = x => list(x * 3);
 * const lst = list(1,2,3);    // [1:2:3:[]]
 * map(f, lst);                // => [[3:[]]:[6:[]]:[9:[]]:[]]
 * concatMap(f, lst);          // => [3:6:9:[]]
 */
export const concatMap = (f, as) => {
  const concatMap_ = (f, as) => concat(map(f, as));
  return partial(concatMap_, f, as);
}
