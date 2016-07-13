/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * type.js
 *
 * @file Type system foundation.
 * @license ISC
 */

/** @module type */

import {partial} from './base';

import {error} from './error';

/** @class Type
 * The base class for all other types. This class is not meant to be used on its own to instantiate
 * new objects, so it does not provide a constructor function of its own, but it does provide some
 * default functionality for new data types. The method examples below apply to all children of this
 * class and are for illustrative purposes only.
 */
export class Type {
  /** @method type
   * Return the type signature of an object if it is an instance of this data type. Throw an error
   * otherwise. This method is used for type checking and is not meant to be called directly. To
   * get the data type of an object, use the `type` function instead or `dataType` if performing
   * your own type checking.
   * @param {Type} a - An instance of this type class.
   * @returns {string} - The type.
   * @abstract
   * @static
   * @example
   * const lst = list(1,2,3);
   * List.type(lst);          // => List
   * const tup = tuple(1,2);
   * Tuple.type(tup);         // => (number,number)
   * const m = just(5);
   * Maybe.type(m);           // => Maybe
   */
  static type(a) { return dataType(a) === this ? this.name : error.typeError(a, this.type); }
  /** @method toString
   * Return the string representation of an object for a given data type.
   * @returns {string} - The data type as a string.
   * @abstract
   * @example
   * const tup = tuple(1,2);
   * tup.toString();          // => [Object Tuple]
   * const lst = list(1,2,3);
   * lst.toString();          // => [Object List]
   * const m = just(5);
   * m.toString();            // => Just 5
   */
  toString() { return this.valueOf(); }
  /** @method typeOf
   * Return the type of an object for a given data type.
   * @returns {string} - The type of the object.
   * @abstract
   * @example
   * const tup = tuple(1,2);
   * tup.typeOf();           // => (number,number)
   * const lst = list(1,2,3);
   * lst.typeOf();           // => [number]
   * const m = just(5);
   * m.typeOf();             // => Maybe number
   */
  typeOf() { return dataType(this).name; }
  /** @method valueOf
   * Return the value of an object for a given data type.
   * @returns {string} - The value of the object.
   * @abstract
   * @example
   * const tup = tuple(1,2);
   * tup.valueOf();          // => (1,2)
   * const lst = list(1,2,3);
   * lst.valueOf();          // => [1:2:3:[]]
   * const m = just(5);
   * m.valueOf();            // => Just 5
   */
  valueOf() { return this; }
}

/** @function defines
 * Return a closure that checks whether a given object is a member of a predefined type class.
 * Note that the library only checks for the existence of the required property or properties.
 * Whether or not those properties are functions and whether or not they return the values expected
 * by the type class are not verified. This is a utility function for defining new type classes.
 * @param {...string} methods - A comma separated list of functions that a data type must define in
 * order to be members of the type class defined by this function.
 * @returns {Function} - A closure that returns true if a given object declares all the given
 * methods, false otherwise.
 * @example
 * // require that instances of the `Eq` type class define an `isEq` function:
 * const Eq = defines(`isEq`);
 *
 * // require that instances of `Traversable` define `traverse` and also be instances of `Functor`
 * // and `Foldable`:
 * const Traversable = defines(`fmap`, `foldr`, `traverse`);
 */
export const defines = (...methods) => a => methods.every(m => m in dataType(a));

/** @function dataType
 * Return the data type of a given object. In JavaScript, this is simply the object's
 * constructor, so this function serves as an alias for terminological clarification.
 * @param {*} a - Any object.
 * @returns {Function} - The object's constructor function.
 * @example
 * dataType(0);               // function Number() { [native code] }
 * const lst = list(1,2,3);
 * dataType(lst)              // => function List(head, tail) { ... }
 * lst.typeOf();              // => List // more useful if you don't need a function pointer
 */
export const dataType = a => a.constructor;

/** @function type
 * Return the type of any object as specified by this library or, otherwise, its primitive type.
 * @param {*} a - Any object.
 * @returns {string} - The type of the object.
 * @example
 * type(0);                   // => number
 * const t = tuple(1,2);
 * type(t);                   // => (number,number)
 */
export const type = a => a instanceof Type ? a.typeOf() : typeof a;

/** @function typeCheck
 * Determine whether two objects are the same type. Return `true` if they are and `false` otherwise.
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - `true` if the two objects are the same type, `false` otherwise.
 * @example
 * typeCheck(0, 1);         // => true
 * typeCheck(0, 'a');       // => false
 */
export const typeCheck = (a, b) => {
  const typeCheck_ = (a, b) => {
    if (a instanceof Type && b instanceof Type) {
      return dataType(a).type(a) === dataType(b).type(b);
    }
    if (dataType(a) === dataType(b)) { return true; }
    return false;
  }
  return partial(typeCheck_, a, b);
}
