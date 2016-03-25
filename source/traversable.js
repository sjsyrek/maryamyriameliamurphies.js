/**
 * maryamyriameliamurphies.js
 *
 * @name traversable.js
 * @author Steven J. Syrek
 * @file Traversable type class.
 * @license ISC
 */

/** @module maryamyriameliamurphies.js/source/traversable */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Traversable

/**
 * A `Traversable` is a functor representing data structures that can be traversed from left to right. They
 * must define a `traverse` method and also be instances of `Functor` and `Foldable`.
 * @const {Function} - Returns `true` if an object is an instance of `Traversable` and `false` otherwise.
 */
const Traversable = defines(`fmap`, `foldr`, `traverse`);

/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect
 * the results.
 * Haskell> traverse :: Applicative f => (a -> f b) -> t a -> f (t b)
 * @param {Function} f - The function to map.
 * @param {Object} a - The traversable structure to traverse.
 * @returns {Object} - A collection of the results of the traversal.
 * @example
 * const lst = list(1,2,3);
 * const f = x => list(x + 7);
 * const tup = tuple(1,2);
 * traverse(f)(lst);         // => [[8:9:10:[]]:[]]
 * traverse(f, tup);         // => [(1,9):[]]
 */
export function traverse(f, a) {
  const traverseP = (f, a) => { return Traversable(a) ? dataType(a).traverse(f, a) : error.typeError(a, traverse); }
  return partial(traverseP, f, a);
}

/**
 * Map each element of a structure to a monadic action, evaluate these actions from left to right,
 * and collect the results. This function is essentially the same as `traverse`.
 * Haskell> mapM :: Monad m => (a -> m b) -> t a -> m (t b)
 * @param {Function} f - The function to map.
 * @param {Object} m - The monad to traverse.
 * @returns {Object} - A collection of the results of the traversal.
 */
export function mapM(f, m) {
  const mapMP = (f, m) => Monad(m) ? dataType(m).traverse(f, m) : error.typeError(m, mapM);
  return partial(mapMP, f, m);
}

/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 * Haskell> sequence :: Monad m => t (m a) -> m (t a)
 * @param {Object} m - The monadic collection of actions.
 * @returns {Object} - A collection of the results.
 * @example
 * const lst = list(1,2,3);
 * const llst = list(lst);
 * sequence(llst);        // => [[1:[]]:[2:[]]:[3:[]]:[]]
 */
export function sequence(m) { return Monad(m) ? traverse(id, m) : error.typeError(m, sequence); }
