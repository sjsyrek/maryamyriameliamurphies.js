/**
 * maryamyriameliamurphies.js
 *
 * @name monoid.js
 * @author Steven J. Syrek
 * @file Monoid type class.
 * @license ISC
 */

 /** @module maryamyriameliamurphies.js/source/monoid */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Monoid

 /**
  * A `Monoid` is a type with an associative binary operation that has an identity. In plainer language,
  * a monoid is any type that has an "empty" value that, when "appended" to any other value of that
  * type, equals that same value. For example, an integer is a monoid, because any integer added to 0,
  * the "empty" value, equals that integer. Likewise, a list is a monoid, because any list appended to
  * the empty list equals the original list. Monoids must define `mempty` and `mappend` methods.
  * @const {export function } - Returns `true` if an object is an instance of `Monoid` and `false` otherwise.
  */
 const Monoid = defines(`mempty`, `mappend`);

 /**
  * Return the identity (or "empty") value for the monoid.
  * Haskell> mempty :: a
  * @param {Object} a - Any monoid.
  * @returns {Object} - Identity of mappend.
  */
 export function mempty(a) { return Monoid(a) ? dataType(a).mempty(a) : error.typeError(a, mempty); }

 /**
  * Perform an associative operation (similar to appending to a list) on two monoids.
  * Haskell> mappend :: a -> a -> a
  * @param {Object} a - Any monoid.
  * @param {Object} b - Any monoid.
  * @returns {Object} - A new monoid of the same type, the result of the associative operation.
  * @example
  * const l1 = list(1,2,3);           // => [1:2:3:[]]
  * const l2 = list(4,5,6);           // => [4:5:6:[]]
  * const l3 = list(7,8,9);           // => [7:8:9:[]]
  * mappend(mempty(l1), l1);        // => [1:2:3:[]]
  * mappend(l1, (mappend(l2, l3))); // => [1:2:3:4:5:6:7:8:9:[]]
  * mappend(mappend(l1, l2), l3);   // => [1:2:3:4:5:6:7:8:9:[]]
  */
 export function mappend(a, b) {
   const mappendP = (a, b) => {
     if (typeCheck(a, b)) { return Monoid(a) ? dataType(a).mappend(a, b) : error.typeError(a, mappend); }
     return error.typeMismatch(a, b, mappend);
   }
   return partial(mappendP, a, b);
 }

 /**
  * Fold a list using the monoid. Concatenates a list of monoids into a single list. For example, since
  * lists themselves are monoids, this export function  will flatten a list of lists into a single list. Example:
  * Haskell> mconcat :: [a] -> a
  * @param {Object} a - Any monoid.
  * @returns {Object} - A new monoid of the same type, the result of the concatenation.
  * @example
  * const l1 = list(1,2,3);    // => [1:2:3:[]]
  * const l2 = list(4,5,6);    // => [4:5:6:[]]
  * const l3 = list(7,8,9);    // => [7:8:9:[]]
  * const ls = list(l1,l2,l3); // => [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
  * mconcat(ls);             // => [1:2:3:4:5:6:7:8:9:[]]
  */
 export function mconcat(a) { return foldr(mappend, mempty(a), a); }
