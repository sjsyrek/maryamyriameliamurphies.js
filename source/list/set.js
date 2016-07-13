/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/set.js
 *
 * @file "Set" operations on lists.
 * @license ISC
 */

/** @module list/set */

import {
  partial,
  flip,
  not
} from '../base';

import {isEq} from '../eq'

import {
  emptyList,
  cons,
  head,
  tail,
  isList,
  isEmpty,
  foldl,
  filter
} from '../list';

import {error} from '../error';

/** @function nub
 * Remove duplicate values from a `List` by dropping all occurrences after the first.
 * Use `nubBy` to supply your own equality function.
 * Haskell> nub :: Eq a => [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The essence of `as`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * nub(lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export const nub = as => isList(as) === false ? error.listError(as, nub) : nubBy(isEq, as);

/** @function nubBy
 * Remove duplicate values from a `List` by dropping all occurrences after the first.
 * This function generalizes `nub` by allowing you to supply your own equality test.
 * Haskell> nubBy :: (a -> a -> Bool) -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - The essence of `as`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * const eq = (x, y) => odd(x + y);
 * nubBy(eq, lst); // => [1:3:5:7:7:9:[]]
 */
export const nubBy = (eq, as) => {
  const nubBy_ = (eq, as) => {
    if (isList(as) === false) { return error.listError(as, nubBy); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = y => not(eq(x, y));
    return cons(x)(nubBy(eq, filter(y, xs)));
    }
  return partial(nubBy_, eq, as);
}

/** @function deleteL
 * Remove the first occurrence of a value from a `List`. Use `deleteLBy` to supply
 * your own equality function.
 * Haskell> delete :: (Eq a) => a -> [a] -> [a]
 * @param {*} a - The value to delete.
 * @param {List} as - A `List`.
 * @returns {List} - The `List` with the first `a` deleted.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * deleteL(2, lst5); // => [1:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export const deleteL = (a, as) => {
  const deleteL_ = (a, as) => {
    if (isList(as) === false) { return error.listError(as, deleteL); }
    return deleteLBy(isEq, a, as);
  }
  return partial(deleteL_, a, as);
}

/** @function deleteLBy
 * Remove the first occurrence of a value from a `List` using a provided function
 * to check for equality.
 * Haskell> deleteBy :: (a -> a -> Bool) -> a -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - The `List` with the first `a` deleted.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * const eq = (x, y) => odd(x + y);
 * deleteLBy(eq, 2, lst); // => [2:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export const deleteLBy = (eq, a, as) => {
  const deleteLBy_ = (eq, a, as) => {
    if (isList(as) === false) { return error.listError(as, deleteLBy); }
    if (isEmpty(as)) { return emptyList; }
    const y = head(as);
    const ys = tail(as);
    const x = eq(a, y) ? ys : y;
    return eq(a, y) ? ys : cons(y)(deleteLBy(eq, a, ys));
  }
  return partial(deleteLBy_, eq, a, as);
}

/** @function deleteFirsts
 * Non-associative list difference: remove the first occurrence of each value of a
 * `List` in turn from another `List`. Use `deleteFirstsBy` to supply your own
 * equality function.
 * Haskell> (\\) :: Eq a => [a] -> [a] -> [a]
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The difference of `as` and `bs`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst2, lst2);
 * deleteFirsts(lst3, lst1);                            // => [6:7:8:9:10:[]]
 * deleteFirsts(listAppend(lst1, lst2), lst1) === lst2; // => true
 */
export const deleteFirsts = (as, bs) => {
  const deleteFirsts_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, deleteFirsts); }
    if (isList(ab) === false) { return error.listError(ab, deleteFirsts); }
    return foldl(flip(deleteL), as, bs);
  }
  return partial(deleteFirsts_, as, bs);
}

/** @function deleteFirstsBy
 * Non-associative list difference: remove the first occurrence of each value of a
 * `List` in turn from another `List` using a provided function to check for equality.
 * Haskell> deleteFirstsBy :: (a -> a -> Bool) -> [a] -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The difference of `as` and `bs`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst1, lst2);
 * const eq = (x, y) => even(x * y);
 * deleteFirstsBy(eq, lst3, lst1);    // => [5:7:8:9:10:[]]
 */
export const deleteFirstsBy = (eq, as, bs) {
  const deleteFirstsBy_ = (eq, as, bs) => {
    return foldl(flip(deleteLBy(eq)), as, bs);
  }
  return partial(deleteFirstsBy_, eq, as, bs);
}
