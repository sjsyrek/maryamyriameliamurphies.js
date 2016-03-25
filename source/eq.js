/**
 * maryamyriameliamurphies.js
 *
 * @name eq.js
 * @fileOverview
 * Eq type class
 */

 /** @module maryamyriameliamurphies.js/source/eq */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Eq

/**
 * The `Eq` type class defines equality and inequality. Instances of `Eq` must define an `isEq` method.
 * @const {Function} - Returns `true` if an object is an instance of `Eq` and `false` otherwise.
 */
const Eq = defines(`isEq`);

/**
 * Compare two objects for equality. Both objects must be instances of the `Eq` type class (i.e. they
 * both define an `isEq` static method) and must also be the same data type (or the same primitive type).
 * Haskell> (==) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a === b
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * isEq(lst1, lst2);        // => false
 * isEq(lst1, list(1,2,3)); // => true
 * isEq(0, 1);              // => false
 * isEq(0, 0);              // => true
 */
function isEq(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) { return Eq(a) ? dataType(a).isEq(a, b) : a === b; }
    return error.typeMismatch(a, b, isEq);
  }
  return partial(p, a, b);
}

/**
 * Compare two objects for inequality. Both objects must be instances of the `Eq` type class (i.e. they
 * both define an `isEq` static method) and must be also be the same data type (or the same primitive type).
 * Haskell> (/=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a !== b
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * isNotEq(lst1, lst2);        // => true
 * isNotEq(lst1, list(1,2,3)); // => false
 * isNotEq(0, 1);              // => true
 * isNotEq(0, 0);              // => false
 */
function isNotEq(a, b) {
  let p = (a, b) => !isEq(a, b);
  return partial(p, a, b);
}
