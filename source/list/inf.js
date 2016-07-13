/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/inf.js
 *
 * @file Infinite list functions.
 * @license ISC
 */

/** @module list/inf */

import {
  partial,
  id
} from '../base';

import {
  list,
  listRangeLazyBy,
  cons,
  isList,
  isEmpty,
  head,
  tail,
  take
} from '../list';

import {error} from '../error';

/** @function listInf
 * Generate an infinite list. Use `listInfBy` to supply your own step function.
 * @param {*} start - The value with which to start the list.
 * @returns {List} - An infinite `List` of consecutive values, incremented from `start`.
 */
export const listInf = start => listInfBy(start, (x => x + 1));

/** @function listInfBy
 * Generate an infinite list, incremented using a given step function.
 * @param {*} start - The value with which to start the list.
 * @param {Function} step - A unary step function.
 * @returns {List} - An infinite `List` of consecutive values, incremented from `start`.
 */
export const listInfBy = (start, step) => {
  const listInfBy_ = (start, step) => listRangeLazyBy(start, Infinity, step);
  return partial(listInfBy_, start, step);
}

/** @function iterate
 * Return an infinite `List` of repeated applications of a function to a value.
 * Haskell> iterate :: (a -> a) -> a -> [a]
 * @param {Function} f - The function to apply.
 * @param {*} x - The value to apply the function to.
 * @returns {List} - An infinite `List` of repeated applications of `f` to `x`.
 * @example
 * const f = x => x * 2;
 * const lst = iterate(f, 1);
 * take(10, lst);             // => [1:2:4:8:16:32:64:128:256:512:[]]
 */
export const iterate = (f, x) => {
  const iterate_ = (f, x) => listInfBy(x, (x => f(x)));
  return partial(iterate_, f, x);
}

/** @function repeat
 * Build an infinite list of identical values.
 * Haskell> repeat :: a -> [a]
 * @param {*} a - The value to repeat.
 * @returns {List} - The infinite `List` of repeated values.
 * @example
 * const lst = repeat(3);
 * take(10, lst);         // => [3:3:3:3:3:3:3:3:3:3:[]]
 */
export const repeat = a => cons(a)(listInfBy(a, id));

/** @function replicate
 * Return a `List` of a specified length in which every value is the same.
 * Haskell> replicate :: Int -> a -> [a]
 * @param {number} n - The length of the `List`.
 * @param {*} x - The value to replicate.
 * @returns {List} - The `List` of values.
 */
export const replicate = (n, x) => {
  const replicate_ = (n, x) => take(n, repeat(x));
  return partial(replicate_, n, x);
}

/** @function cycle
 * Return the infinite repetition of a `List` (i.e. the "identity" of infinite lists).
 * Haskell> cycle :: [a] -> [a]
 * @param {List} as - A finite `List`.
 * @returns {List} - A circular `List`, the original list infinitely repeated.
 * @example
 * const lst = list(1,2,3);
 * const c = cycle(lst);
 * take(9, c);              // => [1:2:3:1:2:3:1:2:3:[]]
 */
export const cycle = as => {
  if (isList(as) === false) { return error.listError(as, cycle); }
  if (isEmpty(as)) { return error.emptyList(as, cycle); }
  let x = head(as);
  let xs = tail(as);
  const c = list(x);
  /* eslint no-constant-condition: ["error", { "checkLoops": false }] */
  const listGenerator = function* () {
    do {
      x = isEmpty(xs) ? head(as) : head(xs);
      xs = isEmpty(xs) ? tail(as) : tail(xs);
      yield list(x);
    } while (true);
  }
  const gen = listGenerator();
  const handler = {
    get: function (target, prop) {
      if (prop === `tail` && isEmpty(tail(target))) {
        const next = gen.next();
        target[prop] = () => new Proxy(next.value, handler);
      }
      return target[prop];
    }
  };
  const proxy = new Proxy(c, handler);
  return proxy;
}
