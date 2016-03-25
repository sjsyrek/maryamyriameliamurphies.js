/**
 * maryamyriameliamurphies.js
 *
 * @name functor.js
 * @fileOverview
 * Functor type class
 */

 /** @module maryamyriameliamurphies.js/source/functor */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Functor

 /**
  * A `Functor` is a type that can be mapped over. This includes lists and other collections, but functions
  * themselves as well as other sorts of values can also be mapped over, so no one metaphor is likely to
  * cover all possible cases. Functors must define an `fmap` method.
  * @const {Function} - Returns `true` if an object is an instance of `Functor` and `false` otherwise.
  */
 const Functor = defines(`fmap`);

 /**
  * Map a function over a functor, which is a type that specifies how functions may be mapped over it.
  * Haskell> fmap :: (a -> b) -> f a -> f b
  * @param {Function} f - The function to map.
  * @param {Object} a - The functor to map over.
  * @returns {Object} - A new functor of the same type, the result of the mapping.
  * @example
  * let lst = list(1,2,3);   // => [1:2:3:[]]
  * fmap(id, lst);           // => [1:2:3:[]]
  * let f = x => x * 11;
  * let g = x => x * 100;
  * $(fmap(f))(fmap(g))(lst) // => [1100:2200:3300:[]]
  * fmap($(f)(g))(lst)       // => [1100:2200:3300:[]]
  */
 function fmap(f, a) {
   let p = (f, a) => Functor(a) ? dataType(a).fmap(f, a) : error.typeError(a, fmap);
   return partial(p, f, a);
 }

 /**
  * Replace all locations in a functor with the same value.
  * Haskell> (<$) :: a -> f b -> f a
  * @param {*} a - The value to inject into the functor.
  * @param {Object} b - The functor to map over.
  * @returns {Object} - A new functor of the same type, with the values of the original replaced by the new value.
  * @example
  * let lst = list(1,2,3); // => [1:2:3:[]]
  * fmapReplaceBy(5, lst)  // => [5:5:5:[]]
  */
 function fmapReplaceBy(a, b) {
   let p = (a, b) => fmap(constant(a), b);
   return partial(p, a, b);
 }
