/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * monad.js
 *
 * @file Monad type class.
 * @license ISC
 */

/** @module monad */

import {
  partial,
  id
} from './base';

import {then} from './applicative';

import {
  defines,
  dataType
} from './type';

import {error} from './error';

/** @const {Function} Monad
 * A monad is an abstract datatype of actions. Instances of `Monad` must define a `flatMap` method
 * as well as all the required methods for `Functor` and `Applicative`.
 * @param {*} - Any object.
 * @returns {boolean} - `true` if an object is an instance of `Monad` and `false` otherwise.
 */
export const Monad = defines(`fmap`, `pure`, `ap`, `flatMap`);

/** @function inject
 * Inject a value into a monadic context.
 * Haskell> return :: a -> m a
 * @param {Object} m - A monad.
 * @param {*} a - The value to inject.
 * @returns {Object} - A new monad of the same type with the value injected.
 */
export const inject = (m, a) => {
  const inject_ = (m, a) => Monad(m) ? dataType(m).pure(a) : error.typeError(m, inject);
  return partial(inject_, m, a);
}

/** @function flatMap
 * Sequentially compose two actions, passing the value produced by the first action as an argument
 * to the second action. This function is variously referred to as bind, map, and flatMap.
 * Haskell> (>>=) :: m a -> (a -> m b) -> m b
 * @param {Object} m - A monad.
 * @param {Function} f - A function to map over the injected value of the monad. This function must
 * also return a monad.
 * @returns {Object} - A new monad of the same type, the result of mapping the function over the
 * original, injected value.
 */
export const flatMap = (m, f) => {
  const flatMap_ = (m, f) => Monad(m) ? dataType(m).flatMap(m, f) : error.typeError(m, flatMap);
  return partial(flatMap_, m, f);
}

/** @function chain
 * Sequentially compose two actions, discarding any value produced by the first, like sequencing
 * operators (such as the semicolon) in imperative languages.
 * @param {Object} m - A monad.
 * @param {Function} f - A function to call that ignores the injected value of the monad.
 * @returns {Object} - A new monad of the same type, the result of calling the function.
 * Haskell> (>>) :: m a -> m b -> m b
 */
export const chain = (m, f) => {
  const chain_ = (m, f) => Monad(m) ? then(m, f) : error.typeError(m, chain);
  return partial(chain_, m, f);
}

/** @function flatMapFlip
 * The same as `flatMap` but with the arguments interchanged.
 * Haskell> (=<<) :: Monad m => (a -> m b) -> m a -> m b
 * @param {Function} f - A function to map over the injected value of the monad.
 * @param {Object} m - A monad.
 * @returns {Object} - A new monad of the same type, the result of mapping the function over the
 * original, injected value.
 */
export const flatMapFlip = (f, m) => {
  const flatMapFlip_ = (f, m) => flatMap(m, f);
  return partial(flatMapFlip_, f, m);
}

/** @function join
 * Remove one level of monadic structure from a monad, projecting its bound argument into the outer
 * level.
 * Haskell> join :: Monad m => m (m a) -> m a
 * @param {Object} m - A monad (wrapping another monad).
 * @returns {Object} - The wrapped monad on its own.
 * @example
 * const m = just(10); // => Just 10
 * const n = just(m);  // => Just Just 10
 * join(n);            // => Just 10
 * join(m);            // => *** Error: 'Just 10' is not a valid argument to function 'join'.
 */
export const join = m => {
  if (Monad(m)) { return Monad(flatMap(m, id)) ? flatMap(m, id) : error.typeError(m, join); }
  return error.typeError(m, join);
}

/** @function liftM
 * Convert, or lift, a function into a monad.
 * Haskell> liftM :: Monad m => (a1 -> r) -> m a1 -> m r
 * @param {Function} f - The function to convert into a monad.
 * @param {Object} m - The monad to convert the function into.
 * @returns {Object} - A new monad containing the result of mapping the function over the monad.
 * @example
 * const mb = just(1);
 * const lst = list(1,2,3);
 * const doubleJust = x => just(x * 2);
 * const doubleList = x => list(x * 2);
 * liftM(doubleJust, mb);               // => Just Just 2
 * liftM(doubleList, lst);              // => [[2:[]]:[4:[]]:[6:[]]:[]]
 */
export const liftM = (f, m) => {
  const liftM_ = (f, m) => Monad(m) ? dataType(m).fmap(f, m) : error.typeError(m, liftM);
  return partial(liftM_, f, m)
}

/** @class DoBlock
 * Since there is no way to exactly replicate Haskell's 'do' notation for monadic chaining, and it
 * would be useful and instructive for this library to implement a similar affordance, this class
 * provides an analogous mechanism. See the `Do` function below for an example of how it works.
 * @private
 */
class DoBlock {
 /** @constructor
  * Create a new monadic context for chaining actions.
  * @param {Object} m - A monad, the context for the actions.
  */
  constructor(m) { this.m = () => m; }
  inject(a) { return Do(dataType(this.m()).pure(a)); }
  flatMap(f) { return Do(flatMap(this.m(), f)); }
  chain(f) { return Do(chain(this.m(), f)); }
  valueOf() { return `${this.m().typeOf()} >>= ${this.m().valueOf()}`; }
}

/**
 * Wrap a monad in a special container for the purpose of chaining actions, in imitation of the
 * syntactic sugar provided by Haskell's 'do' notation.
 * @param {Object} m - A monad.
 * @returns {DoBlock} - A monadic context in which to chain actions.
 * @example
 * const j = just(10);
 * const doubleJust = x => just(x * 2);
 * const minusOne = x => just(x - 1);
 * const lst = list(1,2,3);
 * const plusOne = x => list(x + 1);
 * const doubleList = x => list(x * 2);
 * const put = x => {
 *    print(x);
 *   return just(x);
 * }
 * const b1 = Do(j).flatMap(doubleJust).flatMap(minusOne);
 * const b2 = Do(j).flatMap(doubleJust).chain(j).flatMap(minusOne);
 * const b3 = Do(lst).flatMap(plusOne).flatMap(doubleList);
 * const b4 = Do(lst).flatMap(plusOne).chain(lst).flatMap(doubleList);
 * print(b1);        // => Maybe number >>= Just 19
 * print(b2);        // => Maybe number >>= Just 9
 * print(b3);        // => [number] >>= [4:6:8:[]]
 * print(b4);        // => [number] >>= [2:4:6:2:4:6:2:4:6:[]]
 * Do(j)
 * .flatMap(put)        // => 10
 * .flatMap(doubleJust)
 * .flatMap(put)        // => 20
 * .chain(j)
 * .flatMap(put)        // => 10
 * .flatMap(minusOne)
 * .flatMap(put)        // => 9
 * .flatMap(doubleJust)
 * .flatMap(put);       // => 18
 */
export const Do = m => Monad(m) ? new DoBlock(m) : error.typeError(Do, m);
