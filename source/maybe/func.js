/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * maybe/func.js
 *
 * @file Maybe functions.
 * @license ISC
 */

/** @module maybe/func */

import {partial} from '../base';

import {Maybe} from '../maybe';

import {
  list,
  emptyList,
  cons,
  isList,
  isEmpty,
  head,
  tail,
  map,
  filter
} from '../list';

import {error} from '../error';

/**
 * `Nothing` is the absence of a value, the opposite of `Just` for a `Maybe` object. Since all
 * nothings are the same nothing, there is only one `Nothing` object.
 * (c.f. Wallace Stevens, "The Snow Man").
 * <br>`Haskell> Nothing :: Maybe a`
 */
export const Nothing = new Maybe();

/**
 * Construct a `Maybe` value. Returns `Nothing` if the argument value is `undefined`,
 * `null`, or `NaN`.
 * <br>`Haskell> Just :: a -> Maybe a`
 * @param {*} a - The value to wrap in a `Maybe`
 * @returns {Maybe} `Just a` or `Nothing`
 * @kind function
 */
export const just = a => a == undefined || a !== a ? Nothing : new Maybe(a);

/**
 * Take a default value, a function, and a `Maybe` value. If the `Maybe` value is `Nothing`, return
 * the default value. Otherwise, apply the function to the `Just` value and return the result.
 * <br>`Haskell> maybe :: b -> (a -> b) -> Maybe a -> b`
 * @param {*} n - The default value to return if `m` is `Nothing`
 * @param {Function} f - The function to apply to the value inside `m` if it is a `Just`
 * @param {Maybe} m - A `Maybe`
 * @returns {*} `f` applied to the `Just` value or `n` if the `Maybe` is `Nothing`
 * @kind function
 * @example
 * const m1 = just(100);
 * const m2 = just(null);
 * const f = x => x * 10;
 * maybe(0, f, m1);       // => 1000
 * maybe(0, f, m2);       // => 0
 */
export const maybe = (n, f, m) => {
  const maybe_ = (n, f, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, maybe); }
    return isNothing(m) ? n : f(fromJust(m));
  }
  return partial(maybe_, n, f, m);
}

/**
 * Determine whether an object is a `Maybe`.
 * @param {*} a - Any object
 * @returns {boolean} `true` if the object is a `Maybe` and `false` otherwise
 * @kind function
 */
export const isMaybe = a => a instanceof Maybe;

/**
 * Determine whether an object is a `Just`.
 * <br>`Haskell> isJust :: Maybe a -> Bool`
 * @param {Maybe} m - Any object
 * @returns {boolean} `true` if the object is a `Just` and `false` otherwise
 * @kind function
 */
export const isJust = m => {
  if (isMaybe(m) === false) { return error.typeError(m, isJust); }
  return !isNothing(m);
}

/**
 * Determine whether an object is `Nothing`.
 * <br>`Haskell> isNothing :: Maybe a -> Bool`
 * @param {Maybe} m - Any object
 * @returns {boolean} `true` if the object is `Nothing` and `false` otherwise
 * @kind function
 */
export const isNothing = m => {
  if (isMaybe(m) === false) { return error.typeError(m, isNothing); }
  return m === Nothing;
}

/**
 * Extract the value from a `Just`. Throws an error if the `Maybe` is `Nothing`.
 * <br>`Haskell> fromJust :: Maybe a -> a`
 * @param {Maybe} m - A `Maybe`
 * @returns {*} The value contained in the `Just`
 * @kind function
 */
export const fromJust = m => {
  if (isMaybe(m) === false) { return error.typeError(m, fromJust); }
  return isNothing(m) ? error.nothing(m, fromJust) : m.value(); // yuck
}

/**
 * Return the value contained in a `Maybe` if it is a `Just` or a default value if it is `Nothing`.
 * <br>`Haskell> fromMaybe :: a -> Maybe a -> a`
 * @param {*} d - The default value to return if `m` is `Nothing`
 * @param {Maybe} m - A `Maybe`
 * @returns {*} The value contained in the `Maybe` or `d` if it is `Nothing`
 * @kind function
 */
export const fromMaybe = (d, m) => {
  const fromMaybe_ = (d, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, fromMaybe); }
    return isNothing(m) ? d : m.value();
  }
  return partial(fromMaybe_, d, m);
}

/**
 * Take a `List` and return `Just a` where `a` is the first element of the `List` or `Nothing` if
 * the `List` is empty.
 * <br>`Haskell> listToMaybe :: [a] -> Maybe a`
 * @param {List} xs - A `List`
 * @returns {Maybe} A `Just` containing the head of `xs` or `Nothing` if `xs` is an empty `List`
 * @kind function
 * @example
 * const lst = list(1,2,3);
 * listToMaybe(lst);        // => Just 1
 * listToMaybe(emptyList);  // => Nothing
 */
export const listToMaybe = xs => {
  if (isList(xs) === false) { return error.listError(xs, listToMaybe); }
  return isEmpty(xs) ? Nothing : just(head(xs));
}

/**
 * Take a `Maybe` and return a singleton `List` containing the `Just` value or an empty `List` if
 * the `Maybe` is `Nothing`.
 * <br>`Haskell> maybeToList :: Maybe a -> [a]`
 * @param {Maybe} m - A `Maybe`
 * @returns {List} A new `List`
 * @kind function
 * @example
 * const l = list(1,2,3);
 * const m = just(10);
 * maybeToList(m);        // => [10:[]]
 * maybeToList(Nothing);  // =>  [[]]
 */
export const maybeToList = m => {
  if (isMaybe(m) === false) { return error.typeError(m, maybeToList); }
  return isNothing(m) ? emptyList : list(m.value());
}

/**
 * Take a `List` of `Maybe` values and return a `List` of all the `Just` values.
 * <br>`Haskell> catMaybes :: [Maybe a] -> [a]`
 * @param {List} xs - A `List`
 * @returns {List} A `List` of the `Just` values from `xs`
 * @kind function
 * @example
 * const lst = list(just(1), just(2), just(null), just(3), Nothing, just(), just(4), just(5));
 * catMaybes(lst); // => [1:2:3:4:5:[]]
 */
export const catMaybes = xs => {
  if (isList(xs) === false) { return error.listError(xs, catMaybes); }
  if (isMaybe(head(xs)) === false) { return error.typeError(xs, catMaybes); }
  const p = x => isJust(x);
  const f = x => fromJust(x);
  return map(f, filter(p, xs));
}

/**
 * Map a function `f` that returns a `Maybe` over a `List`. For each element of the list, if the
 * result of applying the function is a `Just`, then the value it contains is included in the result
 * list. If it is `Nothing`, then no element is added to the result list.
 * <br>`Haskell> mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 * @param {Function} f - A function that returns a `Maybe`
 * @param {List} as - A `List` to map over
 * @returns {List} A `List` of `Just` values returned from `f` mapped over `as`
 * @kind function
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = listRange(1, 25);
 * const f = x => even(x) ? just(x * 2) : Nothing;
 * mapMaybe(just, lst1);                           // => [1:2:3:[]]
 * mapMaybe(f, lst2);                              // => [4:8:12:16:20:24:28:32:36:40:44:48:[]]
 */
export const mapMaybe = (f, as) => {
  const mapMaybe_ = (f, as) => {
    if (isList(as) === false) { return error.listError(as, mapMaybe); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const r = f(x);
    const rs = mapMaybe.bind(this, f, xs);
    if (isMaybe(r) === false) { return error.returnError(f, mapMaybe); }
    return isNothing(r) ? rs() : cons(fromJust(r))(rs());
  }
  return partial(mapMaybe_, f, as);
}
