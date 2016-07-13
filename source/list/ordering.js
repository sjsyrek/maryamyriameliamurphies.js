/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/ordering.js
 *
 * @file Functions for ordering lists.
 * @license ISC
 */

/** @module list/zip */

import {
  partial,
  $
} from '../base';

import {
  compare,
  GT
} from '../ord';

import {foldr} from '../foldable';

import {
  emptyList,
  list,
  cons,
  head,
  tail,
  isList,
  isEmpty
} from '../list';

import {error} from '../error';

/** @function sort
 * Sort a list using regular value comparison. Use `sortBy` to supply your own
 * comparison function. Uses an insertion sort algorithm. The `mergeSort` function
 * is probably more efficient for larger lists.
 * Haskell> sort :: Ord a => [a] -> [a]
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list. The original list is unmodified.
 * @example
 * lst = list(9,8,7,6,5,4,3,10,13,11,14,23,24,26,25,2,1);
 * sort(lst) // => [1:2:3:4:5:6:7:8:9:10:11:13:14:23:24:25:26:[]]
 */
export const sort = as => sortBy(compare, as);

/** @function sortBy
 * Sort a list using a comparison function of your choice. Uses an insertion sort
 * algorithm. The `mergeSortBy` function is probably more efficient for larger lists.
 * Haskell> sortBy :: (a -> a -> Ordering) -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list. The original list is unmodified.
 * @example
 * const notCompare = (x, y) => compare(x, y) === EQ ? EQ : (GT ? LT : GT);
 * const lst1 = listRange(1, 11);
 * const lst2 = reverse(lst1);       // [10:9:8:7:6:5:4:3:2:1:[]]
 * sortBy(notCompare, lst1);         // => [1:2:3:4:5:6:7:8:9:10:[]]
 * sortBy(notCompare, lst2);         // => [10:9:8:7:6:5:4:3:2:1:[]]
 */
export const sortBy = (cmp, as) => {
  const sortBy_ = (cmp, as) => {
    if (isList(as) === false) { return error.listError(as, sortBy); }
    return foldr(insertBy(cmp), emptyList, as);
  }
  return partial(sortBy_, cmp, as);
}

/** @function mergeSort
 * Sort a list using regular value comparison. Use `mergeSortBy` to supply your own
 * comparison function. Uses a merge sort algorithm, which may be more efficient
 * than `sort` for larger lists. Use `mergeSortBy` to supply your own comparison
 * function.
 * Haskell> sort :: Ord a => [a] -> [a]
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted `List`. The original list is unmodified.
 * @example
 * const lst1 = list(20,19,18,17,16,15,14,13,12,11,10,1,2,3,4,5,6,7,8,9);
 * mergeSort(lst1); // => [1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:[]]
 * const f = x => x + 1;
 * const lst2 = reverse(listRange(1, 11, f)); // [10:9:8:7:6:5:4:3:2:1:[]]
 * mergeSort(lst2);                           // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export const mergeSort = as =>
  isList(as) === false ? error.listError(as, mergeSort) : mergeSortBy(compare, as);

/** @function mergeSortBy
 * Sort a list using a comparison function of your choice. Uses a merge sort algorithm,
 * which may be more efficient than `sortBy` for larger lists.
 * Haskell> sortBy :: (a -> a -> Ordering) -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted `List`. The original list is unmodified.
 * @example
 * const notCompare = (x, y) => compare(x, y) === EQ ? EQ : (GT ? LT : GT);
 * const lst1 = listRange(1, 11);
 * const lst2 = reverse(lst1);    // [10:9:8:7:6:5:4:3:2:1:[]]
 * mergeSortBy(notCompare, lst1); // => [1:2:3:4:5:6:7:8:9:10:[]]
 * mergeSortBy(notCompare, lst2); // => [10:9:8:7:6:5:4:3:2:1:[]]
 */
export const mergeSortBy = (cmp, as) => {
  const mergeSortBy_ = (cmp, as) => {
    if (isList(as) === false) { return error.listError(as, mergeSortBy); }
    const sequences = as => {
      if (isEmpty(as)) { return list(as); }
      let xs = tail(as);
      if (isEmpty(xs)) { return list(as); }
      const a = head(as);
      const b = head(xs);
      xs = tail(xs);
      if (cmp(a, b) === GT) { return descending(b, list(a), xs); }
      return ascending(b, cons(a), xs);
    }
    const descending = (a, as, bbs) => {
      if (isEmpty(bbs)) { return cons(cons(a)(as))(sequences(bbs)); }
      const b = head(bbs);
      const bs = tail(bbs);
      if (cmp(a, b) === GT) { return descending(b, cons(a)(as), bs); }
      return cons(cons(a)(as))(sequences(bbs));
    }
    const ascending = (a, as, bbs) => {
      if (isEmpty(bbs)) { return cons(as(list(a)))(sequences(bbs)); }
      const b = head(bbs);
      const bs = tail(bbs);
      const ys = ys => as(cons(a)(ys));
      if (cmp(a, b) !== GT) { return ascending(b, ys, bs); }
      return cons(as(list(a)))(sequences(bbs));
    }
    const mergeAll = xs => {
      if (isEmpty(tail(xs))) { return head(xs); }
      return mergeAll(mergePairs(xs));
    }
    const mergePairs = as => {
      if (isEmpty(as)) { return as; }
      let xs = tail(as);
      if (isEmpty(xs)) { return as; }
      const a = head(as);
      const b = head(xs);
      xs = tail(xs);
      return cons(merge(a, b))(mergePairs(xs));
    }
    const merge = (as, bs) => {
      if (isEmpty(as)) { return bs; }
      if (isEmpty(bs)) { return as; }
      const a = head(as);
      const as1 = tail(as);
      const b = head(bs);
      const bs1 = tail(bs);
      if (cmp(a, b) === GT) { return cons(b)(merge(as, bs1)); }
      return cons(a)(merge(as1, bs));
    }
    return $(mergeAll)(sequences)(as);
  }
  return partial(mergeSortBy_, cmp, as);
}

/** @function insert
 * The `insert` function takes an element and a `List` and inserts the element into the
 * list at the first position where it is less than or equal to the next element.
 * In particular, if the list is sorted before the call, the result will also be sorted.
 * Use `insertBy` to supply your own comparison function.
 * Haskell> insert :: Ord a => a -> [a] -> [a]
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 * @example
 * const lst = list(1,2,3,4,5,6,8,9,10);
 * insert(7, lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export const insert = (e, ls) => {
  const insert_ = (e, ls) => insertBy(compare, e, ls);
  return partial(insert_, e, ls);
}

/** @function insertBy
 * Insert an element into a list using a comparison function of your choice.
 * Haskell> insertBy :: (a -> a -> Ordering) -> a -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 */
export const insertBy = (cmp, e, ls) => {
  const insertBy_ = (cmp, e, ls) => {
    if (isList(ls) === false) { return error.listError(ls, insertBy); }
    if (isEmpty(ls)) { return list(e); }
    const y = head(ls);
    const ys = tail(ls);
    if (cmp(e, y) === GT) { return cons(y)(insertBy(cmp, e, ys)); }
    return cons(e)(ls);
  }
  return partial(insertBy_, cmp, e, ls);
}
