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

/**
 * Remove duplicate values from a `List` by dropping all occurrences after the first. Use `nubBy` to
 * supply your own equality function.
 * <br>`Haskell> nub :: Eq a => [a] -> [a]`
 * @param {List} xs - A `List`
 * @returns {List} The essence of `xs`
 * @kind function
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * nub(lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export const nub = xs => isList(xs) ? nubBy(isEq, xs) : error.listError(xs, nub);

/**
 * Remove duplicate values from a `List` by dropping all occurrences after the first. This function
 * generalizes `nub` by allowing you to supply your own equality test.
 * <br>`Haskell> nubBy :: (a -> a -> Bool) -> [a] -> [a]`
 * @param {Function} eq - A function to test for equality (must return `boolean`)
 * @param {List} as - A `List`
 * @returns {List} The essence of `as`
 * @kind function
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

/**
 * Remove the first occurrence of a value from a `List`. Use `deleteLBy` to supply your own equality
 * function.
 * <br>`Haskell> delete :: (Eq a) => a -> [a] -> [a]`
 * @param {*} x - The value to delete
 * @param {List} xs - A `List`
 * @returns {List} The `List` with the first `x` deleted
 * @kind function
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * deleteL(2, lst); // => [1:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export const deleteL = (x, xs) => {
  const deleteL_ = (x, xs) => isList(xs) ? deleteLBy(isEq, x, xs) : error.listError(xs, deleteL);
  return partial(deleteL_, x, xs);
}

/**
 * Remove the first occurrence of a value from a `List` using a provided function to check for
 * equality.
 * <br>`Haskell> deleteBy :: (a -> a -> Bool) -> a -> [a] -> [a]`
 * @param {Function} eq - A function to test for equality (must return `boolean`)
 * @param {*} n - The value to delete
 * @param {List} as - A `List`
 * @returns {List} The `List` with the first `a` deleted
 * @kind function
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * const eq = (x, y) => odd(x + y);
 * deleteLBy(eq, 2, lst); // => [2:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export const deleteLBy = (eq, n, as) => {
  const deleteLBy_ = (eq, n, as) => {
    if (isList(as) === false) { return error.listError(as, deleteLBy); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return eq(n, x) ? xs : cons(x)(deleteLBy(eq, n, xs));
  }
  return partial(deleteLBy_, eq, n, as);
}

/**
 * Non-associative list difference: remove the first occurrence of each value of a `List` in turn
 * from another `List`. Use `deleteFirstsBy` to supply your own equality function.
 * <br>`Haskell> (\\) :: Eq a => [a] -> [a] -> [a]`
 * @param {List} xs - The first `List`
 * @param {List} ys - The second `List`
 * @returns {List} The difference of `xs` and `ys`
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst2, lst2);
 * deleteFirsts(lst3, lst1);                            // => [6:7:8:9:10:[]]
 * deleteFirsts(listAppend(lst1, lst2), lst1) === lst2; // => true
 */
export const deleteFirsts = (xs, ys) => {
  const deleteFirsts_ = (xs, ys) => {
    if (isList(xs) === false) { return error.listError(xs, deleteFirsts); }
    if (isList(ys) === false) { return error.listError(ys, deleteFirsts); }
    return foldl(flip(deleteL), xs, ys);
  }
  return partial(deleteFirsts_, xs, ys);
}

/**
 * Non-associative list difference: remove the first occurrence of each value of a `List` in turn
 * from another `List` using a provided function to check for equality.
 * <br>`Haskell> deleteFirstsBy :: (a -> a -> Bool) -> [a] -> [a] -> [a]`
 * @param {Function} eq - A function to test for equality (must return `boolean`)
 * @param {List} xs - The first `List`
 * @param {List} ys - The second `List`
 * @returns {List} The difference of `xs` and `ys`
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst1, lst2);
 * const eq = (x, y) => even(x * y);
 * deleteFirstsBy(eq, lst3, lst1);      // => [5:7:8:9:10:[]]
 */
export const deleteFirstsBy = (eq, xs, ys) => {
  const deleteFirstsBy_ = (eq, xs, ys) => foldl(flip(deleteLBy(eq)), xs, ys);
  return partial(deleteFirstsBy_, eq, xs, ys);
}
