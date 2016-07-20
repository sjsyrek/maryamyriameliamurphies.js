/**
 * maryamyriameliamurphies.js
 *
 * @name trans.js
 * @author Steven J. Syrek
 * @file List transformation functions.
 * @license ISC
 */

/** @module list/trans */

import {partial} from '../base';

import {
  emptyList,
  cons,
  head,
  tail,
  isList,
  isEmpty,
  concat,
  filter
} from '../list';

import {typeCheck} from '../type';

import {error} from '../error';

/**
 * Map a function over a `List` and put the results into a new list.
 * <br>`Haskell> map :: (a -> b) -> [a] -> [b]`
 * @param {Function} f - The function to map
 * @param {List} as - The `List` to map over
 * @returns {List} A `List` of results
 * @kind function
 * @example
 * const lst = list(1,2,3,4,5);
 * const f = x => x * 3;
 * map(f, lst));                // => [3:6:9:12:15:[]]
 */
export const map = (f, as) => {
  const map_ = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return emptyList; }
    const x = f(head(as)) === undefined ? f.bind(f, head(as)) : f(head(as));
    const xs = tail(as);
    return cons(x)(map(f)(xs));
  }
  return partial(map_, f, as);
}

/**
 * Reverse the elements of a `List` and return them in a new list.
 * <br>`Haskell> reverse :: [a] -> [a]`
 * @param {List} xs - A `List`
 * @returns {List} The reversed `List`
 * @kind function
 * @example
 * const lst = list(1,2,3,4,5);
 * reverse(lst);                // => [5:4:3:2:1:[]]
 */
export const reverse = xs => {
  const r = (xs, a) => isEmpty(xs) ? a : r(tail(xs), cons(head(xs))(a));
  return r(xs, emptyList);
}

/**
 * Take a separator and a `List` and intersperse the separator between the elements of the list.
 * <br>`Haskell> reverse :: [a] -> [a]`
 * @param {*} sep - The seperator value
 * @param {List} as - The `List` into which to intersperse the `sep` value
 * @returns {List} A new `List` in which the elements of `as` are interspersed with `sep`
 * @kind function
 * @example
 * const lst = list(1,2,3,4,5);
 * intersperse(0, lst);         // => [1:0:2:0:3:0:4:0:5:[]]
 * const str = fromStringToList(`abcdefghijklmnopqrstuvwxyz`);
 * intersperse(`|`, str);       // => [a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z]
 */
export const intersperse = (sep, as) => {
  const intersperse_ = (sep, as) => {
    if (isList(as) === false) { return error.listError(as, intersperse); }
    if (typeCheck(sep, head(as)) === false) {
      return error.typeMismatch(sep, head(as), intersperse);
    }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return cons(x)(prependToAll(sep, xs));
  }
  const prependToAll = (sep, xs) =>
    isEmpty(xs) ? emptyList : cons(sep)(cons(head(xs))(prependToAll(sep, tail(xs))));
  return partial(intersperse_, sep, as);
}

/**
 * Insert a `List` in between the lists in a `List` of lists. This operation is equivalent to
 * `(concat (intersperse xs xss)).`
 * <br>`Haskell> intercalate :: [a] -> [[a]] -> [a]`
 * @param {List} xs - The `List` to intercalate
 * @param {List} xss - A `List` of lists
 * @returns {List} The intercalated `List`
 * @kind function
 * @example
 * const lst1 = list(1,1,1,1,1);
 * const lst2 = list(2,2,2,2,2);
 * const lst3 = list(3,3,3,3,3);
 * const lst4 = list(4,4,4,4,4);
 * const lst5 = list(5,5,5,5,5);
 * const xs = list(0,0,0);
 * const xss = list(lst1, lst2, lst3, lst4, lst5);
 *   // [[1:1:1:1:1:[]]:[2:2:2:2:2:[]]:[3:3:3:3:3:[]]:[4:4:4:4:4:[]]:[5:5:5:5:5:[]]:[]]
 * intercalate(xs, xss);
 *   // => [1:1:1:1:1:0:0:0:2:2:2:2:2:0:0:0:3:3:3:3:3:0:0:0:4:4:4:4:4:0:0:0:5:5:5:5:5:[]]
 */
export const intercalate = (xs, xss) => {
  const intercalate_ = (xs, xss) => concat(intersperse(xs, xss));
  return partial(intercalate_, xs, xss);
}

/**
 * Transpose the "rows" and "columns" of a `List` of lists. If some of the rows are shorter than the
 * following rows, their elements are skipped.
 * <br>`Haskell> transpose :: [[a]] -> [[a]]`
 * @param {List} lss - A `List` of lists
 * @returns {List} A new `List` of lists, with the rows and columns transposed
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * const xss1 = list(lst1, lst2);
 * const xss2 = list(list(10,11), list(20), list(), list(30,31,32));
 * transpose(xss1); // => [[1:4:[]]:[2:5:[]]:[3:6:[]]:[]]
 * transpose(xss2); // => [[10:20:30:[]]:[11:31:[]]:[32:[]]:[]]
 */
export const transpose = lss => {
  if (isList(lss) === false) { return error.listError(lss, transpose); }
  if (isEmpty(lss)) { return emptyList; }
  const ls = head(lss);
  const xss = tail(lss);
  if (isList(ls) === false) { return error.listError(ls, transpose); }
  if (isEmpty(ls)) { return transpose(xss); }
  const x = head(ls);
  const xs = tail(ls);
  const hComp = map(h => head(h), filter(xs => !isEmpty(xs), xss));
  const tComp = map(t => tail(t), filter(xs => !isEmpty(xs), xss));
  return cons(cons(x)(hComp))(transpose(cons(xs)(tComp)));
}
