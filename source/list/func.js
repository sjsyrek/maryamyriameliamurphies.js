/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/func.js
 *
 * @file Basic list functions.
 * @license ISC
 */

/** @module list/func */

import {
  partial,
  until
} from '../base';

import {
  greaterThan,
  lessThan
} from '../ord';

import {
  type,
  typeCheck
} from '../type';

import {foldr} from '../foldable';

import {
  Nothing,
  just
} from '../maybe';

import {tuple} from '../tuple';

import {List} from '../list';

import {error} from '../error';

/** @const {List} emptyList
 * The empty list, or [] in Haskell (represented as [[]] in this library).
 */
export const emptyList = new List();

/** @function list
 * Create a new `List` from a series of zero or more values.
 * @param {...*} as - Values to put into a new `List`.
 * @returns {List} - The new `List`.
 * @example
 * list(1,2,3); // => [1:2:3:[]]
 */
export const list = (...as) => as.length === 0 ? emptyList : new List(as.shift(), list(...as));

/** @function listRange
 * Build a list from a range of values. Currently, this only works with numbers. The equivalent is
 * achieved in Haskell using list comprehensions.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [f=(x => x + 1)] - The function to apply iteratively to each value.
 * @param {Function} [filt] - An optional filter (returning `boolean`) to test whether to add each
 * value to the list.
 * @returns {List} - The new list.
 * @example
 * const f = x => x + 5;
 * const evens = x => even(x);
 * listRange(0, 100, f);        // => [0:5:10:15:20:25:30:35:40:45:50:55:60:65:70:75:80:85:90:95:[]]
 * listRange(0, 100, f, evens); // => [0:10:20:30:40:50:60:70:80:90:[]]
 */
export const listRange = (start, end, f, filt) => {
 const listRange_ = (start, end) => {
   if (f === undefined) { f = x => x + 1; }
   let lst = emptyList;
   const p = x => x >= end;
   const go = x => {
     if (filt === undefined) { lst = listAppend(lst)(list(x)); }
     if (filt !== undefined && filt(x)) { lst = listAppend(lst)(list(x)); }
     x = f(x);
     return x;
   }
   until(p, go, start);
   return lst;
 }
 return partial(listRange_, start, end);
}

/** @function listRangeLazy
 * Build a finite list from a range of values using lazy evaluation (i.e. each successive value is
 * only computed on demand, making infinite lists feasible). To supply your own function for
 * determining the increment, use `listRangeLazyBy`.
 * @param {*} start - The starting value.
 * @param {*} end - The end value.
 * @returns {List} - The lazy evaluated `List`.
 */
export const listRangeLazy = (start, end) => {
  const listRangeLazy_ = (start, end) => listRangeLazyBy(start, end, (x => x + 1));
  return partial(listRangeLazy_, start, end);
}

/** @function listRangeLazyBy
 * Build a finite list from a range of values using lazy evaluation and incrementing it using a
 * given step function.
 * @param {*} start - The starting value.
 * @param {*} end - The end value.
 * @param {Function} step - The increment function.
 * @returns {List} - The lazy evaluated `List`.
 */
export const listRangeLazyBy = (start, end, step) => {
  const listRangeLazyBy_ = (start, end, step) => {
    if (start === end) { return list(start); }
    if (greaterThan(start, end)) { return emptyList; }
    let x = start;
    const xs = list(x);
    const listGenerator = function* () {
      do {
        x = step(x);
        yield list(x);
      } while (lessThan(x, end));
    }
    const gen = listGenerator();
    const handler = {
      get: function (target, prop) {
        if (prop === `tail` && isEmpty(tail(target))) {
          const next = gen.next();
          if (next.done === false) { target[prop] = () => new Proxy(next.value, handler); }
        }
        return target[prop];
      }
    };
    const proxy = new Proxy(xs, handler);
    return proxy;
  }
  return partial(listRangeLazyBy_, start, end, step);
}

/** @function listFilter
 * Build a list from a range of enumerated values, and apply a filter to each one. This function is
 * a shortcut for `listRange` that simply applies a filter with the default function `x = x + 1`.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [filt] - An optional filter (returning `boolean`) to test whether to add each
 * value to the list.
 * @returns {List} - The new list.
 * @example
 * const f = x => x + 5;
 * const evens = x => even(x);
 * listFilter(1, 30, evens)    // => [2:4:6:8:10:12:14:16:18:20:22:24:26:28:[]]
 */
export const listFilter = (start, end, filt) => {
 const f = x => x + 1;
 const listFilter_ = (start, end, filt) => listRange(start, end, f, filt);
 return partial(listFilter_, start, end, filt);
}

/** @function listAppend
 * Append one `List` to another.
 * Haskell> (++) :: [a] -> [a] -> [a]
 * @param {List} as - A `List`.
 * @param {List} bs - A `List`.
 * @returns {List} - The new list, the result of the append.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * listAppend(lst1, lst2);   // => [1:2:3:4:5:6:[]]
 */
export const listAppend = (as, bs) => {
  const listAppend_ = (as, bs) => {
    if (isList(as) === false ) { return error.listError(as, listAppend); }
    if (isList(bs) === false ) { return error.listError(bs, listAppend); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(head(as))(listAppend(tail(as))(bs)); }
    return error.typeMismatch(type(head(as)), type(head(bs)), listAppend);
  }
  return partial(listAppend_, as, bs);
}

/** @function cons
 * Create a new `List` from a head and tail. As in Haskell, `cons` is based on the classic Lisp
 * function of the same name.
 * Haskell> (:) :: a -> [a] -> [a]
 * @param {*} x - Any value, the head of the new list.
 * @param {List} xs - A `List`, the tail of the new list.
 * @returns {List} - The new `List`, constructed from `x` and `xs`.
 * @example
 * const lst = list(4,5,6);
 * cons(3)(lst);            // => [3:4:5:6:[]]
 */
export const cons = (x, xs) => {
  const cons_ = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return new List(x, emptyList); }
    if (xs instanceof List === false) { return error.listError(xs, cons); }
    if (typeCheck(x, head(xs))) { return new List(x, xs); }
    return error.typeError(head(xs), cons);
  }
  return partial(cons_, x, xs);
}

/** @function head
 * Extract the first element of a `List`.
 * Haskell> head :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The head of the list.
 * @example
 * const lst = list(1,2,3);
 * head(lst);               // => 1
 */
export const head = as => {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head(); }
  return error.listError(as, head);
}

/** @function last
 * Extract the last element of a `List`.
 * Haskell> last :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The last element of the list.
 * @example
 * const lst = list(1,2,3);
 * last(lst);               // => 3
 */
export const last = as => {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, last); }
    return isEmpty(tail(as)) ? head(as) : last(tail(as));
  }
  return error.listError(as, last);
}

/** @function tail
 * Extract the elements after the head of a `List`.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The tail of the list.
 * @example
 * const lst = list(1,2,3);
 * tail(lst);               // => [2:3:[]]
 */
export const tail = as => {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, tail) : as.tail(); }
  return error.listError(as, tail);
}

/** @function init
 * Return all the elements of a `List` except the last one.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - A new list, without the original list's last element.
 * @example
 * const lst = list(1,2,3);
 * init(lst);               // => [1:2:[]]
 */
export const init = as => {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, init); }
    return isEmpty(tail(as)) ? emptyList : cons(head(as))(init(tail(as)));
  }
  return error.listError(as, init);
}

/** @function uncons
 * Decompose a `List` into its head and tail. If the list is empty, returns `Nothing`. If the list
 * is non-empty, returns `Just (x, xs)`, where `x` is the head of the list and `xs` its tail.
 * Haskell> uncons :: [a] -> Maybe (a, [a])
 * @param {List} as - The `List` to decompose.
 * @returns {Maybe} - The decomposed `List` wrapped in a `Just`, or `Nothing` if the list is empty.
 * @example
 * const lst = list(1,2,3);
 * uncons(lst);             // => Just (1,[2:3:[]])
 */
export const uncons = as => isEmpty(as) ? Nothing : just(tuple(head(as), tail(as)));

/** @function empty
 * Test whether a `Foldable` structure (such as a `List`) is empty.
 * Haskell> null :: t a -> Bool
 * @param {Object} t - The `Foldable` structure to test.
 * @returns {boolean} - `true` if the structure is empty, `false` otherwise.
 * @example
 * empty(list(1,2,3)); // => false
 * empty(emptyList);   // => true
 */
export const empty = t => foldr(x => x === undefined, true, t);

/** @function length
 * Return the length of a `List`. In the future, this function should work on all `Foldable`
 * structures.
 * Haskell> length :: Foldable t => t a -> Int
 * @param {List} as - A `List`.
 * @returns {number} - The length of the list.
 * @example
 * const lst = list(1,2,3);
 * length(lst);             // => 3
 */
export const length = as => {
  const lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(tail(xs), n + 1);
  return isList(as) ? lenAcc(as, 0) : error.listError(as, length);
}

/** @function isList
 * Determine whether a given object is a `List`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `List` and `false` otherwise.
 */
export const isList = a => a instanceof List ? true : false;

/** @function isEmpty
 * Check whether a value is an empty list. Returns `true` if the value is an empty list. Throws a
 * type error, otherwise.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the collection is an empty list, `false` otherwise.
 * @example
 * isEmpty([]);              // => true
 * isEmpty([[]]);            // => false
 * isEmpty(emptyList);       // => true
 * isEmpty(list(emptyList)); // => false
 */
export const isEmpty = a => isList(a) ? a === emptyList : error.typeError(a, isEmpty);

/** @function fromArrayToList
 * Convert an array into a `List`.
 * @param {Array<*>} a - An array to convert into a `List`.
 * @returns {List} - A new `List`, the converted array.
 * @example
 * const arr = [1,2,3];
 * fromArrayToList(arr); // => [1:2:3:[]]
 */
export const fromArrayToList = a =>
  Array.isArray(a) ? list(...a) : error.typeError(a, fromArrayToList);

/** @function fromListToArray
 * Convert a `List` into an array.
 * @param {List} as - A `List` to convert into an array.
 * @returns {Array} - A new array, the converted list.
 * @example
 * const lst = list(1,2,3);
 * fromListToArray(lst);    // => [1,2,3]
 */
export const fromListToArray = as => {
  if (isList(as)) { return isEmpty(as) ? [] : [head(as)].concat(fromListToArray(tail(as))); }
  return error.listError(as, fromListToArray);
}

/** @function fromListToString
 * Convert a `List` into a string.
 * @param {List} as - A `List` to convert into a string.
 * @returns {string} - A new string, the converted list.
 * @example
 * const str = list('a','b','c');
 * fromListToString(str);         // => "abc"
 */
export const fromListToString = as =>
  isList(as) ? fromListToArray(as).join(``) : error.listError(as, fromListToString);

/** @function fromStringToList
 * Convert a string into a `List`.
 * @param {string} str - A string to convert into a `List`.
 * @returns {List} - A new `List`, the converted string.
 * @example
 * const str = `abc`;
 * fromStringToList(str); // => [abc]
 */
export const fromStringToList = str =>
  typeof str === 'string' ? fromArrayToList(str.split(``)) : error.typeError(str, fromStringToList);
