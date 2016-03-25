/**
 * maryamyriameliamurphies.js
 *
 * @name foldable.js
 * @fileOverview
 * Foldable type class
 */

 /** @module maryamyriameliamurphies.js/source/foldable */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Foldable

 /**
  * A `Foldable` is a data structure that can be folded into a summary value. Lists are a common form of foldable.
  * Instances of Foldable must define a `foldr` method.
  * @const {Function} - Returns `true` if an object is an instance of `Foldable` and `false` otherwise.
  */
 const Foldable = defines(`foldr`);

 /**
  * Combine the elements of a structure using a monoid. For example, fold a list of lists into a single list.
  * Haskell> fold :: Monoid m => t m -> m
  * @param {Object} a - The monoid to fold.
  * @returns {Object} - The folded monoid.
  * @example
  * let lst = list(1,2,3);  // => [1:2:3:[]]
  * let llst = list(lst);   // => [[1:2:3:[]]:[]]
  * fold(llst);             // => [1:2:3:[]]
  */
 function fold(a) { return foldMap(id, a); }

 /**
  * Map each element of the structure to a monoid, and combine the results.
  * Haskell> foldMap :: Monoid m => (a -> m) -> t a -> m
  * @param {Function} f - The function to map.
  * @param {Object} a - The monoid to map over.
  * @returns {Object} - A new monoid of the same type, the result of the mapping.
  * @example
  * let lst = list(1,2,3);
  * let f = x => list(x * 3);
  * foldMap(f, lst);          // => [3:6:9:[]]
  */
 function foldMap(f, a) {
   let p = (f, a) => Monoid(a) ? $(mconcat)(fmap(f))(a) : error.typeError(a, foldMap);
   return partial(p, f, a);
 }

 /**
  * Right-associative fold of a structure. This is the work horse function of `Foldable`.
  * Haskell> foldr :: (a -> b -> b) -> b -> t a -> b
  * @param {Function} f - A binary function.
  * @param {*} z - A base accumulator value.
  * @param {Object} t - A `Foldable` type.
  * @returns {*} - The result of applying the function to the foldable and the accumulator.
  * @example
  * let lst = list(1,2,3);
  * let f = (x, y) => x + y;
  * foldr(f, 0, lst);        // => 6
  */
 function foldr(f, z, t) {
   let p = (f, z, t) => { return Foldable(t) ? dataType(t).foldr(f, z, t) : error.typeError(t, foldr); }
   return partial(p, f, z, t);
 }
