/**
 * maryamyriameliamurphies.js
 *
 * @name ord.js
 * @author Steven J. Syrek
 * @file Ord type class.
 * @license ISC
 */

 /** @module maryamyriameliamurphies.js/source/ord */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Ord

 /**
  * The `Ord` type class is used for totally ordered datatypes. Instances of `Ord` must define a `compare`
  * method and must also be instances of `Eq`.
  * @const {Function} - Returns `true` if an object is an instance of `Ord` and `false` otherwise.
  */
 const Ord = defines(`isEq`, `compare`);

 /**
  * A data constructor for orderings of objects that can be compared, implemented as a class because
  * Ordering in Haskell is a monoid. There is no reason to ever create any other new objects from this class.
  * @extends Type
  * @private
  */
 class Ordering extends Type {
   /**
    * Create a new ordering.
    * @param {string} ord - A string representing the type of ordering.
    */
   constructor(ord) {
     super();
     this.ord = () => ord;
   }
   static mempty(a) { return EQ; }
   static mappend(a, b) {
     if (a === LT) { return LT; }
     if (a === EQ) { return b; }
     if (a === GT) { return GT; }
   }
   valueOf() { return this.ord(); }
 }

 /**
  * The "equals" Ordering. Equivalent to ===.
  * @const {Ordering}
  */
 export const EQ = new Ordering(`EQ`);

 /**
  * The "less than" Ordering. Equivalent to <.
  * @const {Ordering}
  */
 export const LT = new Ordering(`LT`);

 /**
  * The "greater than" Ordering. Equivalent to >.
  * @const {Ordering}
  */
 export const GT = new Ordering(`GT`);

 /**
  * Compare two objects and return an `Ordering`. Both values must be instances of the `Ord` type class
  * (i.e. they both define a `compare` static method) and must also be the same data type (or the same
  * primitive type). Only a single comparison is required to determine the precise ordering of two objects.
  * Haskell> compare :: a -> a -> Ordering
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {Ordering} - The Ordering value (`EQ` for equality, `LT` for less than, or `GT` for greater than).
  * @example
  * const lst1 = list(1,2,3);
  * const lst2 = list(4,5,6);
  * compare(lst1, lst2);    // => LT
  * compare(lst2, lst1);    // => GT
  * const tup1 = tuple(1,2);
  * const tup2 = tuple(2,1);
  * const tup3 = swap(tup2);
  * compare(tup1, tup2);    // => LT
  * compare(tup2, tup3);    // => GT
  * compare(tup3, tup1);    // => EQ
  */
 export function compare(a, b) {
   const compareP = (a, b) => {
     if (a === Infinity) { return GT; }
     if (b === Infinity) { return LT; }
     if (typeCheck(a, b)) {
       if (Ord(a)) { return dataType(a).compare(a, b); }
       if (isEq(a, b)) { return EQ; }
       if (a < b) { return LT; }
       if (a > b) { return GT; }
     }
     return error.typeMismatch(a, b, compare);
   }
   return partial(compareP, a, b);
 }

 /**
  * Determine whether one value is less than another.
  * Haskell> (<) :: a -> a -> Bool
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {boolean} - a < b.
  */
 export function lessThan(a, b) {
   const lessThanP = (a, b) => compare(a, b) === LT;
   return partial(p, a, b);
 }

 /**
  * Determine whether one value is less than or equal to another.
  * Haskell> (<=) :: a -> a -> Bool
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {boolean} - a <= b.
  */
 export function lessThanOrEqual(a, b) {
   const lessThanOrEqualP = (a, b) => compare(a, b) !== GT;
   return partial(lessThanOrEqualP, a, b);
 }

 /**
  * Determine whether one value is greater than another.
  * Haskell> (>) :: a -> a -> Bool
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {boolean} - a > b.
  */
 export function greaterThan(a, b) {
   const greaterThanP = (a, b) => compare(a, b) === GT;
   return partial(greaterThan, a, b);
 }

 /**
  * Determine whether one value is greater than or equal to another.
  * Haskell> (>=) :: a -> a -> Bool
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {boolean} - a >= b.
  */
 export function greaterThanOrEqual(a, b) {
   const greaterThanOrEqualP = (a, b) => compare(a, b) !== LT;
   return partial(greaterThanOrEqualP, a, b);
 }

 /**
  * Return the higher in value of two objects.
  * Haskell> max :: a -> a -> a
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {*} - `a` or `b`, whichever is greater.
  * @example
  * const tup1 = tuple(1,2);
  * const tup2 = tuple(2,1);
  * const tup3 = swap(tup2);
  * max(tup1, tup2);       // => (2,1)
  * max(tup2, tup1);       // => (2,1)
  * max(tup3, tup1);       // => (1,2)
  */
 export function max(a, b) {
   const maxP = (a, b) => lessThanOrEqual(a, b) ? b : a;
   return partial(maxP, a, b);
 }

 /**
  * Return the lower in value of two objects.
  * Haskell> min :: a -> a -> a
  * @param {*} a - Any object.
  * @param {*} b - Any object.
  * @returns {*} - `a` or `b`, whichever is lesser.
  * @example
  * const tup1 = tuple(1,2);
  * const tup2 = tuple(2,1);
  * const tup3 = swap(tup2);
  * min(tup1, tup2);       // => (1,2)
  * min(tup2, tup1);       // => (1,2)
  * min(tup3, tup1);       // => (1,2)
  */
 export function min(a, b) {
   const minP = (a, b) => lessThanOrEqual(a, b) ? a : b;
   return partial(minP, a, b);
 }
