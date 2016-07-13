/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/sub.js
 *
 * @file Sublist functions.
 * @license ISC
 */

/** @module list/sub */

import {
  partial,
  $,
  not
} from '../base';

import {isEq} from '../eq';

import {
  Nothing,
  just
} from '../maybe';

import {
  tuple,
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

/** @function take
 * Return the prefix of a `List` of a given length.
 * Haskell> take :: Int -> [a] -> [a]
 * @param {number} n - The length of the prefix to take.
 * @param {List} as - The `List` to take from.
 * @returns {List} - A new `List`, the desired prefix of the original list.
 * @example
 * const lst = list(1,2,3);
 * take(2, lst);            // => [1:2:[]]
 */
export const take = (n, as) => {
  const take_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, take); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return cons(x)(take(n - 1)(xs));
  }
  return partial(take_, n, as);
}

/** @function drop
 * Return the suffix of a `List` after discarding a specified number of values.
 * Haskell> drop :: Int -> [a] -> [a]
 * @param {number} n - The number of values to drop.
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - A new `List`, the desired suffix of the original list.
 * @example
 * const lst = list(1,2,3);
 * drop(2, lst);            // => [3:[]]
 */
export const drop = (n, as) => {
  const drop_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, drop); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return drop(n - 1)(xs);
  }
  return partial(drop_, n, as);
}

/** @function splitAt
 * Return a `Tuple` in which the first element is the prefix of a `List` of a given
 * length and the second element is the remainder of the list.
 * Haskell> splitAt :: Int -> [a] -> ([a], [a])
 * @param {number} n - The length of the prefix.
 * @param {List} as - The `List` to split.
 * @returns {Tuple} - The split list.
 * @example
 * const lst = list(1,2,3);
 * splitAt(2, lst);         // => ([1:2:[]],[3:[]])
 */
export const splitAt = (n, as) => {
  const splitAt_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, splitAt); }
    return tuple(take(n, as), drop(n, as));
  }
  return partial(splitAt_, n, as);
}

/** @function takeWhile
 * Return the longest prefix (possibly empty) of a `List` of values that satisfy a
 * predicate function.
 * Haskell> takeWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to take from.
 * @returns {List} - The `List` of values that satisfy the predicate function.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x < 3;
 * takeWhile(f, lst);                 // => [1:2:[]]
 */
export const takeWhile = (p, as) => {
  const takeWhile_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, takeWhile); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const test = p(x);
    if (test === true) { return cons(x)(takeWhile(p, xs)); }
    if (test === false) { return emptyList; }
    return error.listError(as, takeWhile);
  }
  return partial(takeWhile_, p, as);
}

/** @function dropWhile
 * Drop values from a `List` while a given predicate function returns `true` for
 * each value.
 * Haskell> dropWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - The `List` of values that do not satisfy the predicate function.
 * @example
 * const lst = list(1,2,3,4,5,1,2,3);
 * const f = x => x < 3;
 * dropWhile(f, lst);                 // => [3:4:5:1:2:3:[]]
 */
export const dropWhile = (p, as) => {
  const dropWhile_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, dropWhile); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const test = p(x);
    if (test === true) { return dropWhile(p, xs); }
    if (test === false) { return as; }
    return error.listError(as, dropWhile);
  }
  return partial(dropWhile_, p, as);
}

/** @function span
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that satisfy a predicate function and the second element is
 * the rest of the list.
 * Haskell> span :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @returns {Tuple} - The `Tuple` of results.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x < 3;
 * span(f, lst);                    // => ([1:2:[]],[3:4:1:2:3:4:[]])
 */
export const span = (p, as) => {
  const span_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, span); }
    tuple(takeWhile(p, as), dropWhile(p, as));
  }
  return partial(span_, p, as);
}

/** @function spanNot
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that do not satisfy a predicate function and the second element
 * is the rest of the list.
 * Haskell> break :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @returns {Tuple} - The `Tuple` of results.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x > 3;
 * spanNot(f, lst);                 // => ([1:2:3:[]],[4:1:2:3:4:[]])
 */
export const spanNot = (p, as) => {
  const spanNot_ = (p, as) => span($(not)(p), as);
  return partial(spanNot_, p, as);
}

/** @function stripPrefix
 * Drops the given prefix from a `List`. Returns `Nothing` if the list did not
 * start with the prefix given, or `Just` the `List` after the prefix, if it does.
 * Haskell> stripPrefix :: Eq a => [a] -> [a] -> Maybe [a]
 * @param {List} as - The prefix `List` to strip.
 * @param {List} bs - The `List` from which to strip the prefix.
 * @returns {Maybe} - The result `List` contained in a `Just`, or `Nothing`.
 * @example
 * const prefix = fromStringToList(`foo`);
 * stripPrefix(prefix, fromStringToList(`foobar`));    // => Just [bar]
 * stripPrefix(prefix, fromStringToList(`foo`));       // => Just [[]]
 * stripPrefix(prefix, fromStringToList(`barfoo`));    // => Nothing
 * stripPrefix(prefix, fromStringToList(`barfoobaz`)); // => Nothing
 */
export const stripPrefix = (as, bs) => {
  const stripPrefix_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, stripPrefix); }
    if (isList(bs) === false) { return error.listError(bs, stripPrefix); }
    if (isEmpty(as)) { return just(bs); }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    if (x === y) { return stripPrefix(xs, ys); }
    return Nothing;
  }
  return partial(stripPrefix_, as, bs);
}

/** @function group
 * Take a `List` and return a `List` of lists such that the concatenation of the result
 * is equal to the argument. Each sublist in the result contains only equal values. Use
 * `groupBy` to supply your own equality function.
 * Haskell> group :: Eq a => [a] -> [[a]]
 * @param {List} as - A `List`.
 * @returns {List} - A `List` of result lists.
 * @example
 * const str = fromStringToList(`Mississippi`);
 * group(str); // => [[M]:[i]:[ss]:[i]:[ss]:[i]:[pp]:[i]:[]]
 */
export const group = as => groupBy(isEq, as);

/** @function groupBy
 * Take a `List` and return a `List` of lists such that the concatenation of the result
 * is equal to the argument. Each sublist in the result is grouped according to the
 * the supplied equality function.
 * Haskell> groupBy :: (a -> a -> Bool) -> [a] -> [[a]]
 * @param {Function} eq - A function to test the equality of elements (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - A `List` of result lists.
 */
export const groupBy = (eq, as) => {
  const groupBy_ = (eq, as) => {
    if (isList(as) === false) { return error.listError(as, groupBy); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const t = span(eq(x), xs);
    const ys = fst(t);
    const zs = snd(t);
    return cons(cons(x)(ys))(groupBy(eq, zs));
  }
  return partial(groupBy_, eq, as);
}
