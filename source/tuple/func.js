/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * tuple/func.js
 *
 * @file Tuple functions.
 * @license ISC
 */

/** @module tuple/func */

import {Tuple} from '../tuple';

import {error} from '../error';

/** @const {Tuple} unit
 * The `unit` object, an empty tuple. Note that `isTuple(unit) === false`.
 */
export const unit = new Tuple();

/** @function tuple
 * Create a new `Tuple` from any number of values. A single value will be returned unaltered,
 * and `unit`, the empty tuple, will be returned if no arguments are passed.
 * @param {...*} as - The values to put into a `Tuple`.
 * @returns {Tuple} - A new `Tuple`.
 * @example
 * tuple(10,20); // => (10,20)
 */
export const tuple = (...as) => {
  const [x, y] = as;
  if (x === undefined) return unit;
  if (y === undefined) return x;
  return new Tuple(...as);
}

/** @function fst
 * Extract the first value of a tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {*} - The first value of the tuple.
 * @example
 * const tup = tuple(10,20);
 * fst(tup);                 // => 10
 */
export const fst = p => isTuple(p) ? p[1] : error.tupleError(p, fst);

/** @function snd
 * Extract the second value of a tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {*} - The second value of the tuple.
 * const tup = tuple(10,20);
 * snd(tup);                 // => 20
 */
export const snd = p => isTuple(p) ? p[2] : error.tupleError(p, snd);

/** @function curry
 * Convert an uncurried function to a curried function. For example, a function that expects a tuple
 * as an argument can be curried into a function that binds one value and returns another function
 * that binds the other value. This function can then be called with or without arguments bound, or
 * with arguments partially applied. Currying and uncurrying are transitive.
 * @param {Function} f - The function to curry.
 * @param {*} x - Any value, the first value of the new tuple argument.
 * @param {*} y - Any value, the second value of the new tuple argument.
 * @returns {Function} - The curried function.
 * @example
 * const f = p => fst(p) - snd(p);
 * const a = curry(f);             // a === f()()
 * const b = a(100);               // b === f(100)()
 * const c = b(15);                // c === f(100)(15) === 85
 * const p = tuple(100, 15);
 * const A = curry(f);             // A(100)(15) === 85
 * const B = uncurry(A);           // B(p) === 85
 * const C = curry(B);             // A(100)(15) === C(100)(15) === 85
 */
export const curry = (f, x, y) => {
  if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
  if (y === undefined) { return curry(f)(x); }
  return curry(f)(x)(y);
}

/** @function uncurry
 * Convert a curried function to a single function that takes a tuple as an argument—mostly useful
 * for uncurrying functions previously curried with the `curry` function. This function will not
 * work if any arguments are bound to the curried function (it would result in a type error in
 * Haskell). Currying and uncurrying are transitive.
 * @param {Function} f - The function to uncurry.
 * @param {Tuple} p - The tuple from which to extract argument values for the function.
 * @returns {Function} - The uncurried function.
 * @example
 * const f = p => fst(p) - snd(p);
 * const p = tuple(100, 15);
 * const a = curry(f);             // a === f()()
 * const b = uncurry(a);           // b === f()
 * const c = b(p);                 // c === f({`1`:100,`2`:15}) === 85
 * const d = uncurry(a, p)         // d === 85
 */
export const uncurry = (f, p) => {
  if (p === undefined) {
    return p => isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
  }
  return isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
}

/** @function swap
 * Swap the values of a tuple. This function does not modify the original tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {Tuple} - A new `Tuple`, with the values of the first tuple swapped.
 * @example
 * const tup = tuple(10,20);
 * swap(tup);                // => (20,10)
 */
export const swap = p => isTuple(p) ? tuple(snd(p), fst(p)) : error.tupleError(p, swap);

/** @function isTuple
 * Determine whether an object is a `Tuple`. The empty tuple, `unit`, returns `false`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `Tuple` and `false` otherwise.
 */
export const isTuple = a => a instanceof Tuple && a !== unit ? true : false;

/** @function isUnit
 * Check whether a value is an empty tuple, or `unit`. Returns `true` if the value is unit. Throws a
 * type error, otherwise.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the collection is unit.
 * @example
 * isUnit(tuple(1,2));        // => false
 * isUnit(unit);              // => true
 * isUnit(tuple(unit, unit)); // => false
 */
export const isUnit = a => {
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  return error.typeError(a, isUnit);
}

/** @function fromArrayToTuple
 * Convert an array into a `Tuple`. Returns `unit`, the empty tuple, if no arguments or arguments
 * other than an array are passed. This function will not work on array-like objects.
 * @param {Array<*>} array - The array to convert.
 * @returns {Tuple} - The new `Tuple`.
 * @example
 * const arr = [10,20];
 * fromArrayToTuple(arr); // => (10,20)
 */
export const fromArrayToTuple = a =>
  Array.isArray(a) ? Reflect.construct(Tuple, Array.from(a)) : error.typeError(a, fromArrayToTuple);

/** @function fromTupleToArray
 * Convert a `Tuple` into an array.
 * @param {Tuple} p - The `Tuple` to convert.
 * @returns {Array<*>} - The new array.
 * @example
 * const tup = tuple(10,20);
 * fromTupleToArray(tup);    // => [10,20]
 */
export const fromTupleToArray = p =>
  isTuple(p) ? Object.getOwnPropertyNames(p).map(k => p[k]) : error.tupleError(p, fromTupleToArray);
