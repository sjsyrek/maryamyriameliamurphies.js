/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * applicative.js
 *
 * @file Applicative type class.
 * @license ISC
 */

/** @module applicative */

import {
  partial,
  flip,
  id,
  constant
} from './base';

import {fmap} from './functor';

import {
  defines,
  dataType
} from './type';

import {error} from './error';

/** @const {Function} Applicative
 * `Applicative` functors are functors that support function application within their contexts. They
 * must define `pure` and `ap` methods and also be instances of `Functor`.
 * @param {*} - Any object.
 * @returns {boolean} - `true` if an object is an instance of `Applicative` and `false` otherwise.
 */
const Applicative = defines(`fmap`, `pure`, `ap`);

/** @function pure
 * Lift a value into an applicative context.
 * Haskell> pure :: a -> f a
 * @param {Object} f - An applicative functor.
 * @param {*} a - Any object.
 * @returns {Object} - An applicative functor with the value injected.
 * @example
 * const lst = list(1,2,3); // => [1:2:3:[]]
 * pure(lst, 5);            // => [5:[]]
 */
export const pure = (f, a) => {
  const pure_ = (f, a) => Applicative(f) ? dataType(f).pure(a) : error.typeError(f, pure);
  return partial(pure_, f, a);
}

/** @function ap
 * Apply a function within an applicative context to an applicative functor.
 * Haskell> (<*>) :: f (a -> b) -> f a -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - An applicative functor.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 * @example
 * const lst = list(1,2,3);
 * const p = pure(lst, id);     // lift id function into applicative context
 * ap(p, lst);                  // => [1:2:3:[]] // proves identity
 * const f = x => x * 10;
 * const g = x => x * 3;
 * const pf = pure(lst, f);
 * const pg = pure(lst, g);
 * const p$ = pure(lst, $);
 * ap(ap(ap(p$)(pf))(pg))(lst); // => [30:60:90:[]] // not pretty
 * ap(ap(ap(p$, pf), pg), lst); // => [30:60:90:[]] // but
 * ap(pf, ap(pg, lst));         // => [30:60:90:[]] // proves composition
 * ap(pf, pure(lst, 10));       // => [100:[]]
 * pure(lst, f(10));            // => [100:[]] // proves homomorphism
 * ap(pf, pure(lst, 3));        // => [30:[]]
 * const a = pure(lst, 3) ;
 * ap(pf, a);                   // => [30:[]] // proves interchange (not actually possible?)
 */
export const ap = (f, a) => {
  const ap_ = (f, a) => {
    if (Applicative(f) === false) { error.typeError(f, ap); }
    if (Applicative(a) === false) { error.typeError(a, ap); }
    return dataType(a).ap(f, a);
  }
  return partial(ap_, f, a);
}

/** @function apFlip
 * A variant of `ap` with the arguments reversed.
 * Haskell> (<**>) :: Applicative f => f a -> f (a -> b) -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - The first argument to f.
 * @param {Object} b - The second argument to f.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(10,10,10);
 * const f1 = (x, y) => x * y;
 * const f2 = (x, y) => x + y;
 * const f3 = (x, y) => x - y;
 * apFlip(f1, lst1, lst2);     // => [10:10:10:20:20:20:30:30:30:[]]
 * apFlip(f2, lst1, lst2);     // => [11:11:11:12:12:12:13:13:13:[]]
 * apFlip(f3, lst1, lst2);     // => [9:9:9:8:8:8:7:7:7:[]]
 */
export const apFlip = (f, a, b) => {
  const apFlip_ = (f, a, b) => liftA2(flip(f), a, b);
  return partial(apFlip_, f, a, b);
}

/** @function then
 * Sequence actions, discarding the value of the first argument.
 * Haskell> (*>) :: f a -> f b -> f b
 * @param {Object} a1 - The action to skip.
 * @param {Object} a2 - The action to perform.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * const l1 = list(1,2,3);
 * const l2 = list(4,5,6);
 * then(l1, l2);           // => [4:5:6:4:5:6:4:5:6:[]]
 */
export const then = (a1, a2) => {
  const then_ = (a1, a2) => liftA2(constant(id), a1, a2);
  return partial(then_, a1, a2);
}

/** @function skip
 * Sequence actions, discarding the value of the second argument.
 * Haskell> (<*) :: f a -> f b -> f a
 * @param {Object} a1 - The action to perform.
 * @param {Object} a2 - The action to skip.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * const l1 = list(1,2,3);
 * const l2 = list(4,5,6);
 * skip(l1, l2);           // => [1:1:1:2:2:2:3:3:3:[]]
 */
export const skip = (a1, a2) => {
  const skip_ = (a1, a2) => liftA2(constant, a1, a2);
  return partial(skip_, a1, a2);
}

/** @function liftA
 * Lift a function into an applicative context.
 * Haskell> liftA :: Applicative f => (a -> b) -> f a -> f b
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the context to lift the function into.
 * @returns {Object} - The result of applying the lifted function.
 * @example
 * const lst = list(1,2,3);
 * const mb = just(1);
 * const f = x => x * 10;
 * liftA(f, lst);           // => [10:20:30:[]]
 * liftA(f, mb);            // => Just 10
 */
export const liftA = (f, a) => {
  const liftA_ = (f, a) => ap(dataType(a).pure(f))(a);
  return partial(liftA_, f, a);
}

/** @function liftA2
 * Lift a binary function to actions.
 * Haskell> liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @returns {Object} - The result of applying the lifted function.
 * @example
 * const mb1 = just(1);
 * const mb2 = just(10);
 * const lst1 = list(1,2,3);
 * const lst2 = list(10,10,10);
 * const f = (x, y) => {
 *   const k1_ = (x, y) => x * y;
 *   return partial(k1_, x, y);
 *  }
 * liftA2(f, mb1, mb2);           // => Just 10
 * liftA2(f, lst1, lst2);         // => [10:10:10:20:20:20:30:30:30:[]]
 */
export const liftA2 = (f, a, b) => {
  const liftA2_ = (f, a, b) => ap(fmap(f, a))(b);
  return partial(liftA2_, f, a, b);
}

/** @function liftA3
 * Lift a ternary function to actions.
 * Haskell> liftA3 :: Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @param {Object} c - An applicative functor, the third argument to f.
 * @returns {Object} - The result of applying the lifted function.
 */
export const liftA3 = (f, a, b, c) => {
  const liftA3_ = (f, a, b, c) => ap(ap(fmap(f, a))(b))(c);
  return partial(liftA3_, f, a, b, c);
}
