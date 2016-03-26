/**
 * maryamyriameliamurphies.js
 *
 * @name applicative.js
 * @author Steven J. Syrek
 * @file Applicative type class.
 * @license ISC
 */

/** @module maryamyriameliamurphies.js/source/applicative */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Applicative

/**
 * `Applicative` functors are functors that support function application within their contexts. They must
 * define `pure` and `ap` methods and also be instances of `Functor`.
 * @const {Function} - Returns `true` if an object is an instance of `Applicative` and `false` otherwise.
 */
const Applicative = defines(`fmap`, `pure`, `ap`);

/**
 * Lift a value into an applicative context.
 * Haskell> pure :: a -> f a
 * @param {Object} f - An applicative functor.
 * @param {*} a - Any object.
 * @returns {Object} - An applicative functor with the value injected.
 * @example
 * const lst = list(1,2,3); // => [1:2:3:[]]
 * pure(lst, 5);            // => [5:[]]
 */
export function pure(f, a) {
  const pure_ = (f, a) => Applicative(f) ? dataType(f).pure(a) : error.typeError(f, pure);
  return partial(pure_, f, a);
}

/**
 * Apply a function within an applicative context to an applicative functor.
 * Haskell> (<*>) :: f (a -> b) -> f a -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - An applicative functor.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 * @example
 * const lst = list(1,2,3);
 * const p = pure(lst, id);       // lift id function into applicative context
 * ap(p, lst);                    // => [1:2:3:[]] // proves identity
 * const f = x => x * 2;
 * const g = x => x * 3;
 * const pf = pure(lst, f);
 * const pg = pure(lst, g);
 * const p$ = pure(lst, $);
 * ap(ap(ap(p$)(pf))(pg))(lst);    // => [6:12:18:[]] // not pretty
 * ap(ap(ap(p$, pf), pg), lst);   // => [6:12:18:[]] // but
 * ap(pf, ap(pg, lst));           // => [6:12:18:[]] // proves composition
 * ap(pf, pure(lst, 10));          // => [20:[]]
 * pure(lst, f(10));              // => [20:[]] // proves homomorphism
 * ap(pf, pure(lst, 3));          // => [6:[]]
 * const a = pure(lst, 3) ;
 * ap(pf, a);                     // => [6:[]] // proves interchange (well, not really possible?)
 */
export function ap(f, a)  {
  const ap_ = (f, a) => {
    if (Applicative(f) === false) { error.typeError(f, ap); }
    if (Applicative(a) === false) { error.typeError(a, ap); }
    return dataType(a).ap(f, a);
  }
  return partial(ap_, f, a);
}

/**
 * A variant of `ap` with the arguments reversed.
 * Haskell> (<**>) :: Applicative f => f a -> f (a -> b) -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - The first argument to f.
 * @param {Object} b - The second argument to f.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 */
export function apFlip(f, a, b) {
  const apFlip_ = (f, a, b) => liftA2(flip(f), a, b);
  return partial(apFlip_, f, a, b);
}

/**
 * Sequence actions, discarding the value of the first argument.
 * Haskell> (*>) :: f a -> f b -> f b
 * @param {Object} a1 - The action to skip.
 * @param {Object} a2 - The action to perform.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * const l1 = list(1,2,3);
 * const l2 = list(4,5,6);
 * then(l1, l2);         // => [4:5:6:4:5:6:4:5:6:[]]
 */
export function then(a1, a2) {
  const then_ = (a1, a2) => liftA2(constant(id), a1, a2);
  return partial(then_, a1, a2);
}

/**
 * Sequence actions, discarding the value of the second argument. Example:
 * Haskell> (<*) :: f a -> f b -> f a
 * @param {Object} a1 - The action to perform.
 * @param {Object} a2 - The action to skip.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * const l1 = list(1,2,3);
 * const l2 = list(4,5,6);
 * skip(l1, l2);         // => [1:1:1:2:2:2:3:3:3:[]]
 */
export function skip(a1, a2) {
  const skip_ = (a1, a2) => liftA2(constant, a1, a2);
  return partial(skip_, a1, a2);
}

/**
 * Lift a function into an applicative context.
 * Haskell> liftA :: Applicative f => (a -> b) -> f a -> f b
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the context to lift the function into.
 * @returns {Object} - The result of applying the lifted function.
 */
export function liftA(f, a) {
  const liftA_ = (f, a) => ap(dataType(a).pure(f))(a);
  return partial(liftA_, f, a);
}

/**
 * Lift a binary function to actions.
 * Haskell> liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @returns {Object} - The result of applying the lifted function.
 */
export function liftA2(f, a, b) {
  const liftA2_ = (f, a, b) => ap(fmap(f, a))(b);
  return partial(liftA2_, f, a, b);
}

/**
 * Lift a ternary function to actions.
 * Haskell> liftA3 :: Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @param {Object} c - An applicative functor, the third argument to f.
 * @returns {Object} - The result of applying the lifted function.
 */
export function liftA3(f, a, b, c) {
  const liftA3_ = (f, a, b, c) => ap(ap(fmap(f, a))(b))(c);
  return partial(liftA3_, f, a, b, c);
}
