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

/**
 * The empty list, or [] in Haskell (represented as [[]] in this library).
 * <br>`Haskell> [] :: [t]`
 */
export const emptyList = new List();

/**
 * Create a new `List` from a series of zero or more values.
 * @param {...*} as - Values to put into a new `List`
 * @returns {List} The new `List`
 * @kind function
 * @example
 * list(1,2,3); // => [1:2:3:[]]
 */
export const list = (...as) => as.length === 0 ? emptyList : new List(as.shift(), list(...as));

/**
 * Build a `List` from a range of values. Currently, this only works with numbers. The equivalent is
 * achieved in Haskell using list comprehensions.<br>
 * @param {*} start - The beginning of the range (inclusive)
 * @param {*} end - The end of the range (exclusive)
 * @param {Function} [f=(x => x + 1)] - The function to apply iteratively to each value
 * @param {Function} [filt] - An optional filter (returning `boolean`) to test whether to add each
 * value to the `List`
 * @returns {List} The new `List`
 * @kind function
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

/**
 * Build a `List` from a range of values using lazy evaluation (i.e. each successive value is only
 * computed on demand, making infinite lists feasible). To supply your own function for determining
 * the increment, use `listRangeLazyBy`.
 * @param {*} start - The starting value
 * @param {*} end - The end value
 * @returns {List} A `List` that will be evaluated lazily
 * @kind function
 */
export const listRangeLazy = (start, end) => {
  const listRangeLazy_ = (start, end) => listRangeLazyBy(start, end, (x => x + 1));
  return partial(listRangeLazy_, start, end);
}

/**
 * Build a `List` from a range of values using lazy evaluation and incrementing it using a given
 * step function.
 * @param {*} start - The starting value
 * @param {*} end - The end value
 * @param {Function} step - The increment function
 * @returns {List} A `List` that will be evaluated lazily
 * @kind function
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

/**
 * Build a `List` from a range of enumerated values, and apply a filter to each one. This function
 * is a shortcut for `listRange` that simply applies a filter with the default function `x = x + 1`.
 * @param {*} start - The beginning of the range (inclusive)
 * @param {*} end - The end of the range (exclusive)
 * @param {Function} [filt] - An optional filter (returning `boolean`) to test whether to add each
 * value to the `List`
 * @returns {List} A new `List` of filtered values
 * @kind function
 * @example
 * const f = x => x + 5;
 * const evens = x => even(x);
 * listFilter(1, 30, evens);   // => [2:4:6:8:10:12:14:16:18:20:22:24:26:28:[]]
 */
export const listFilter = (start, end, filt) => {
 const f = x => x + 1;
 const listFilter_ = (start, end, filt) => listRange(start, end, f, filt);
 return partial(listFilter_, start, end, filt);
}

/**
 * Append one `List` to another.
 * <br>`Haskell> (++) :: [a] -> [a] -> [a]`
 * @param {List} xs - A `List`
 * @param {List} ys - A `List`
 * @returns {List} A new `List`, the result of appending `xs` to `ys`
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * listAppend(lst1, lst2);   // => [1:2:3:4:5:6:[]]
 */
export const listAppend = (xs, ys) => {
  const listAppend_ = (xs, ys) => {
    if (isList(xs) === false ) { return error.listError(xs, listAppend); }
    if (isList(ys) === false ) { return error.listError(ys, listAppend); }
    if (isEmpty(xs)) { return ys; }
    if (isEmpty(ys)) { return xs; }
    if (type(head(xs)) === type(head(ys))) { return cons(head(xs))(listAppend(tail(xs))(ys)); }
    return error.typeMismatch(type(head(xs)), type(head(ys)), listAppend);
  }
  return partial(listAppend_, xs, ys);
}

/**
 * Create a new `List` from a head and tail. As in Haskell, `cons` is based on the classic Lisp
 * function of the same name.
 * <br>`Haskell> (:) :: a -> [a] -> [a]`
 * @param {*} x - Any value, the head of the new list
 * @param {List} xs - A `List`, the tail of the new list
 * @returns {List} The new `List`, constructed from `x` and `xs`
 * @kind function
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

/**
 * Extract the first element of a `List`.
 * <br>`Haskell> head :: [a] -> a`
 * @param {List} xs - A `List`
 * @returns {*} The head of the `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * head(lst);               // => 1
 */
export const head = xs => {
  if (isList(xs)) { return isEmpty(xs) ? error.emptyList(xs, head) : xs.head(); }
  return error.listError(xs, head);
}

/**
 * Extract the last element of a `List`.
 * <br>`Haskell> last :: [a] -> a`
 * @param {List} xs - A `List`
 * @returns {*} The last element of the `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * last(lst);               // => 3
 */
export const last = xs => {
  if (isList(xs)) {
    if (isEmpty(xs)) { return error.emptyList(xs, last); }
    return isEmpty(tail(xs)) ? head(xs) : last(tail(xs));
  }
  return error.listError(xs, last);
}

/**
 * Extract the elements after the head of a `List`.
 * <br>`Haskell> tail :: [a] -> [a]`
 * @param {List} xs - A `List`
 * @returns {List} The tail of the `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * tail(lst);               // => [2:3:[]]
 */
export const tail = xs => {
  if (isList(xs)) { return isEmpty(xs) ? error.emptyList(xs, tail) : xs.tail(); }
  return error.listError(xs, tail);
}

/**
 * Return all the elements of a `List` except the last one.
 * <br>`Haskell> tail :: [a] -> [a]`
 * @param {List} xs - A `List`
 * @returns {List} A new `List`, without the original list's last element
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * init(lst);               // => [1:2:[]]
 */
export const init = xs => {
  if (isList(xs)) {
    if (isEmpty(xs)) { return error.emptyList(xs, init); }
    return isEmpty(tail(xs)) ? emptyList : cons(head(xs))(init(tail(xs)));
  }
  return error.listError(xs, init);
}

/**
 * Decompose a `List` into its head and tail. If the list is empty, returns `Nothing`. If the list
 * is non-empty, returns `Just (x, xs)`, where `x` is the head of the `List` and `xs` its tail.
 * <br>`Haskell> uncons :: [a] -> Maybe (a, [a])`
 * @param {List} xs - The `List` to decompose
 * @returns {Maybe} The decomposed `List` wrapped in a `Just`, or `Nothing` if the list is empty
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * uncons(lst);             // => Just (1,[2:3:[]])
 */
export const uncons = xs => isEmpty(xs) ? Nothing : just(tuple(head(xs), tail(xs)));

/**
 * Test whether a `Foldable` structure (such as a `List`) is empty.
 * <br>`Haskell> null :: t a -> Bool`
 * @param {Object} t - The `Foldable` structure to test
 * @returns {boolean} `true` if the structure is empty, `false` otherwise
 * @kind function
 * @example
 * empty(list(1,2,3)); // => false
 * empty(emptyList);   // => true
 */
export const empty = t => foldr(x => x === undefined, true, t);

/**
 * Return the length of a `List`. In the future, this function should work on all `Foldable`
 * structures.
 * <br>`Haskell> length :: Foldable t => t a -> Int`
 * @param {List} xs - A `List`
 * @returns {number} The length of the `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * length(lst);             // => 3
 */
export const length = xs => {
  const lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(tail(xs), n + 1);
  return isList(xs) ? lenAcc(xs, 0) : error.listError(xs, length);
}

/**
 * Determine whether a given object is a `List`.<br>
 * @param {*} a - Any object
 * @returns {boolean} `true` if the object is a `List` and `false` otherwise
 * @kind function
 */
export const isList = a => a instanceof List ? true : false;

/**
 * Check whether a `List` is empty. Returns `true` if the `List` is empty or false if it is
 * non-empty. Throws a type error, otherwise.
 * @param {*} xs - A `List`
 * @returns {boolean} `true` if the `List` is empty, `false` if it is non-empty
 * @kind function
 * @example
 * isEmpty([]);              // => true
 * isEmpty([[]]);            // => false
 * isEmpty(emptyList);       // => true
 * isEmpty(list(emptyList)); // => false
 */
export const isEmpty = xs => isList(xs) ? xs === emptyList : error.typeError(xs, isEmpty);

/**
 * Convert an array into a `List`.
 * @param {Array.<*>} arr - An array to convert into a `List`
 * @returns {List} A new `List`, the converted array
 * @kind function
 * @example
 * const arr = [1,2,3];
 * fromArrayToList(arr); // => [1:2:3:[]]
 */
export const fromArrayToList = arr =>
  Array.isArray(arr) ? list(...arr) : error.typeError(arr, fromArrayToList);

/**
 * Convert a `List` into an array.
 * @param {List} xs - A `List` to convert into an array
 * @returns {Array} A new array, the converted `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * fromListToArray(lst);    // => [1,2,3]
 */
export const fromListToArray = xs => {
  if (isList(xs)) { return isEmpty(xs) ? [] : [head(xs)].concat(fromListToArray(tail(xs))); }
  return error.listError(xs, fromListToArray);
}

/**
 * Convert a `List` into a string.
 * @param {List} xs - A `List` to convert into a string
 * @returns {string} A new string, the converted `List`
 * @kind function
 * @example
 * const str = list('a','b','c');
 * fromListToString(str);         // => "abc"
 */
export const fromListToString = xs =>
  isList(xs) ? fromListToArray(xs).join(``) : error.listError(xs, fromListToString);

/**
 * Convert a string into a `List`.
 * @param {string} str - A string to convert into a `List`
 * @returns {List} A new `List`, the converted string
 * @kind function
 * @example
 * const str = `abc`;
 * fromStringToList(str); // => [abc]
 */
export const fromStringToList = str =>
  typeof str === 'string' ? fromArrayToList(str.split(``)) : error.typeError(str, fromStringToList);
