/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * traversable.js
 *
 * @file Traversable type class.
 * @license ISC
 */

/** @module traversable */

import {
  partial,
  id
} from './base';

import {
  defines,
  dataType
} from './type';

import {Monad} from './monad';

import {error} from './error';

/**
 * A `Traversable` is a functor representing data structures that can be walked over or "traversed"
 * from left to right (useful in trees, for example). They must define a `traverse` method and also
 * be instances of `Functor` and `Foldable`.
 * @param {*} - Any object
 * @returns {boolean} `true` if an object is an instance of `Traversable` and `false` otherwise
 * @kind function
 */
export const Traversable = defines(`fmap`, `foldr`, `traverse`);

/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and
 * collect the results.
 * <br>`Haskell> traverse :: Applicative f => (a -> f b) -> t a -> f (t b)`
 * @param {Function} f - The function to map
 * @param {Object} a - The traversable structure to traverse
 * @returns {Object} A collection of the results of the traversal
 * @kind function
 * @example
 * const mb = just(1);
 * const tup = tuple(1,2);
 * const lst = list(1,2,3);
 * const f = x => list(x + 7);
 * traverse(f, mb);            // => [Just 8:[]]
 * traverse(f, tup);           // => [(1,9):[]]
 * traverse(f)(lst);           // => [[8:9:10:[]]:[]]
 */
export const traverse = (f, a) => {
  const traverse_ = (f, a) => {
    return Traversable(a) ? dataType(a).traverse(f, a) : error.typeError(a, traverse);
  }
  return partial(traverse_, f, a);
}

/**
 * Map each element of a structure to a monadic action, evaluate these actions from left to right,
 * and collect the results. This function is essentially the same as `traverse` but restricted to
 * monads.
 * <br>`Haskell> mapM :: Monad m => (a -> m b) -> t a -> m (t b)`
 * @param {Function} f - The function to map
 * @param {Object} m - The monad to traverse
 * @returns {Object} A collection of the results of the traversal
 * @kind function
 * @example
 * const mb = just(1);
 * const lst = list(1,2,3);
 * const f = x => list(x + 7);
 * mapM(f, mb);                // => [Just [8:[]]:[]]
 * mapM(f, lst);               // => [[8:9:10:[]]:[[]]:[]]
 */
export const mapM = (f, m) => {
  const mapM_ = (f, m) => Monad(m) ? dataType(m).traverse(f, m) : error.typeError(m, mapM);
  return partial(mapM_, f, m);
}

/**
 * Evaluate each monadic action in a structure from left to right, and collect the results.
 * <br>`Haskell> sequence :: Monad m => t (m a) -> m (t a)`
 * @param {Object} m - The monadic collection of actions
 * @returns {Object} A collection of the results
 * @kind function
 * @example
 * const mb = just(1);
 * const mmb = just(mb);
 * const lst = list(1,2,3);
 * const llst = list(lst);
 * sequence(mmb);           // => Just Just 1
 * sequence(llst);          // => [[1:[]]:[2:[]]:[3:[]]:[]]
 */
export const sequence = m => Monad(m) ? traverse(id, m) : error.typeError(m, sequence);
