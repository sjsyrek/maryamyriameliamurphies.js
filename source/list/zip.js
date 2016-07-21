/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/zip.js
 *
 * @file Functions for zipping and unzipping lists.
 * @license ISC
 */

/** @module list/zip */

import {partial} from '../base';

import {tuple} from '../tuple';

import {
  emptyList,
  cons,
  head,
  tail,
  isList,
  isEmpty
} from '../list';

import {error} from '../error';

/**
 * Take two `List` objects and return a `List` of corresponding pairs. If one input list is shorter,
 * excess elements of the longer list are discarded.
 * <br>`Haskell> zip :: [a] -> [b] -> [(a, b)]`
 * @param {List} as - The first `List`
 * @param {List} bs - The second `List`
 * @returns {List} The zipped `List` of `Tuple` objects
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * zip(lst1, lst2);              // => [(1,5):(2,4):(3,3):(4,2):(5,1):[]]
 */
export const zip = (as, bs) => {
  const zip_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, zip); }
    if (isList(bs) === false) { return error.listError(bs, zip); }
    if (isEmpty(as)) { return emptyList; }
    if (isEmpty(bs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return partial(zip_, as, bs);
}

/**
 * Take three `List` objects and return a `List` of triples (`Tuple` objects with three values).
 * Analogous to the `zip` function.
 * <br>`Haskell> zip3 :: [a] -> [b] -> [c] -> [(a, b, c)]`
 * @param {List} as - The first `List`
 * @param {List} bs - The second `List`
 * @param {List} cs - The third `List`
 * @returns {List} The zipped `List` of `Tuple` objects
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const lst3 = list(6,7,8,9,10);
 * zip3(lst1, lst2, lst3);        // => [(1,5,6):(2,4,7):(3,3,8):(4,2,9):(5,1,10):[]]
 */
export const zip3 = (as, bs, cs) => {
  const zip3_ = (as, bs, cs) => {
    if (isList(as) === false) { return error.listError(as, zip3); }
    if (isList(bs) === false) { return error.listError(bs, zip3); }
    if (isList(cs) === false) { return error.listError(cs, zip3); }
    if (isEmpty(as) || isEmpty(bs) || isEmpty(cs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    const z = head(cs);
    const zs = tail(cs);
    return cons(tuple(x, y, z))(zip3(xs, ys, zs));
  }
  return partial(zip3_, as, bs, cs);
}

/**
 * A generalization of the `zip` function. Zip two `List` objects using a provided function.
 * <br>`Haskell> zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]`
 * @param {Function} f - The zipping function
 * @param {List} as - The first `List`
 * @param {List} bs - The second `List`
 * @returns {List} The zipped `List`
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const f = (x, y) => tuple(x * 3, y ** 2);
 * const g = (x, y) => x + y;
 * zipWith(f, lst1, lst2);                   // => [(3,25):(6,16):(9,9):(12,4):(15,1):[]]
 * zipWith(g, lst1, lst2);                   // => [6:6:6:6:6:[]]
 */
export const zipWith = (f, as, bs) => {
  const zipWith_ = (f, as, bs) => {
    if (isList(as) === false) { return error.listError(as, zipWith); }
    if (isList(bs) === false) { return error.listError(bs, zipWith); }
    if (isEmpty(as) || isEmpty(bs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    return cons(f(x, y))(zipWith(f, xs, ys));
  }
  return partial(zipWith_, f, as, bs);
}

/**
 * A generalization of the `zip3` function. Zip three `List` objects using a provided function.
 * <br>`Haskell> zipWith3 :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]`
 * @param {Function} f - The zipping function
 * @param {List} as - The first `List`
 * @param {List} bs - The second `List`
 * @param {List} cs - The third `List`
 * @returns {List} The zipped `List`
 * @kind function
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const lst3 = list(6,7,8,9,10);
 * const f = (x, y, z) => tuple(x * 3, y * y, z % 2);
 * const g = (x, y, z) => x + y + z;
 * zipWith3(f, lst1, lst2, lst3);    // => [(3,25,0):(6,16,1):(9,9,0):(12,4,1):(15,1,0):[]]
 * zipWith3(g, lst1, lst2, lst3);    // => [12:13:14:15:16:[]]
 */
export const zipWith3 = (f, as, bs, cs) => {
  const zipWith3_ = (f, as, bs, cs) => {
    if (isList(as) === false) { return error.listError(as, zipWith3); }
    if (isList(bs) === false) { return error.listError(bs, zipWith3); }
    if (isList(cs) === false) { return error.listError(cs, zipWith3); }
    if (isEmpty(as) || isEmpty(bs) || isEmpty(cs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    const z = head(cs);
    const zs = tail(cs);
    return cons(f(x, y, z))(zipWith3(f, xs, ys, zs));
  }
  return partial(zipWith3_, f, as, bs, cs);
}
