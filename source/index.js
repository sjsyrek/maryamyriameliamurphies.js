/*
 * maryamyriameliamurphies.js
 *
 * @name index.js
 * @fileOverview
 * maryamyriameliamurphies.js is a library of Haskell-style morphisms ported to JavaScript
 * using ECMAScript 2015 syntax.
 *
 * See also:
 *
 * - [casualjs](https://github.com/casualjs/f)
 * - [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
 *
 * Reading the code:
 *
 * I implement each Haskell data type as an ES2015 class, hewing as closely as I can to the
 * Haskell original but with reasonable concessions to JavaScript idiom. Type classes are
 * represented by static class methods. Since the class definitions are not exported, these
 * methods remain private, thus providing a limited amount of type checking that cannot be
 * easily hacked by accident. For example, data types that are equatable (with ===) will work
 * with the isEq() function if they define an eq() static function or are natively equatable.
 * For the sake of those interested, I introduce each function with the syntax of its Haskell
 * original. My hope is that most of the functions are otherwise self-documenting. The public
 * API for this library is specified, following CommonJS style, in a default object at the
 * bottom of this file.
 */

`use strict`;

// Base

/**
 * Determine whether two objects are the same type, returning true if they are and false otherwise.
 * This is a limited form of type checking for this library.
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 * @private
 */
function _typeCheck(a, b) {
  if (a.constructor.type !== undefined && b.constructor.type !== undefined) { return a.constructor.type(a) === b.constructor.type(b); }
  if (a.constructor === b.constructor) { return true; }
  return false;
}

/**
 * Throw an exception in the event of a type error.
 * @param {string} exp - The type the calling function was expecting.
 * @param {*} got - The value that it got instead.
 * @private
 */
function _typeError(exp, got) { throw TypeError(`I expected a value of type '${exp}' but I got ${got}.`); }

/**
 * Return the type of any object as specified by this library or its primitive type.
 * @param {*} a - Any object.
 * @return {string}
 */
function typeOf(a) { return a.constructor.type !== undefined ? a.constructor.type(a) : typeof a; }

// Eq (from Prelude)

/**
 * Compare two objects for equality. Both objects must be instances of a class that implements
 * an eq() static method.
 * (==), (/=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 */
function isEq(a, b) {
  if (_typeCheck(a, b)) { return a.constructor.eq !== undefined && b.constructor.eq !== undefined ? a.constructor.eq(a, b) : a === b; }
  _typeError(typeOf(a), b);
}
function isNotEq(a, b) { return !isEq(a, b); }

// Ord (from Prelude)

/**
 * Compare two objects for ordering. Both values must be instances of a class that implements
 * an ord() static method. Only a single comparison is required to determine the precise
 * ordering of two objects.
 * compare :: a -> a -> Ordering
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {string} - Ordering.
 */
function compare(a, b) {
  if (_typeCheck(a, b)) {
    if (a.constructor.ord !== undefined && b.constructor.ord !== undefined) { return a.constructor.ord(a, b); }
    if (isEq(a, b)) { return Ordering.EQ; }
    if (a < b) { return Ordering.LT; }
    if (a > b) { return Ordering.GT; }
  }
  _typeError(typeOf(a), b);
}

/**
 * (<), (<=), (>), (>=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 */
function lessThan(a, b) { return compare(a, b) === Ordering.LT; }
function lessThanOrEqual(a, b) { return compare(a, b) !== Ordering.GT; }
function greaterThan(a, b) { return compare(a, b) === Ordering.GT; }
function greaterThanOrEqual(a, b) { return compare(a, b) !== Ordering.LT; }

/**
 * Return the higher or lower in value of two objects.
 * max, min :: a -> a -> a
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {Object} - a or b.
 */
function max(a, b) { return lessThanOrEqual(a, b) ? b : a; }
function min(a, b) { return lessThanOrEqual(a, b) ? a : b; }

/**
 * A data type for representing the relationship of two values.
 * @const {Object}
 */
const Ordering = {
  EQ: 'EQ', // a === b
  LT: 'LT', // a < b
  GT: 'GT'  // a > b
}
Object.freeze(Ordering);

// Tuple (from Data.Tuple)

/**
 * A data constructor for a tuple. Unlike Haskell, which provides a separate constructor
 * for every possible number of tuple values, this class will construct tuples of any size.
 * Empty Tuples, however, are a special type called {@code unit}, and single values passed to this
 * constructor will be returned unmodified. In order for them be useful, it is recommended
 * that you create Tuples with primitive values. Note that this class is not exposed as part
 * of the maryamyriameliamurphies.js API, as new Tuples should be instantiated with the
 * {@code tuple()} function and not by using {@code new Tuple()} directly.
 * @class
 * @param {*} values - The values to put into the tuple.
 */
class Tuple {
  constructor(...values) {
    if (values.length === 0) { this[0] = null; }
    values.forEach((v, i) => this[i + 1] = v );
  }
  static type(a) { return `(${Reflect.ownKeys(a).map(key => typeof a[key]).join(', ')})`; }
  static eq(a, b) { return fromTupleToArray(a).every((a, i) => a === fromTupleToArray(b)[i]); }
  static ord(a, b) {
    if (this.eq(a, b)) { return Ordering.EQ; }
    let i = 1;
    while (Reflect.has(a, i)) {
      if (a[i] < b[i]) { return Ordering.LT; }
      if (a[i] > b[i]) { return Ordering.GT; }
      i += 1;
    }
  }
  toString() { return `[Object Tuple]`; }
  valueOf() { return `(${Reflect.ownKeys(this).map(key => typeof this[key] === 'string' ? `'${this[key]}'` : this[key]).join(', ')})`; }
}

/**
 * Convert an uncurried function to a curried function. For example, a function that expects
 * a tuple as an argument can be curried into a function that binds one value and returns another
 * function that binds the other value. This function can then be called with or without arguments
 * bound, or with arguments partially applied. Currying and uncurrying are transitive. Example:
 * {@code let f = function(p) { return fst(p) - snd(p); };
 *        let a = curry(f);       // a === f()()
 *        let b = a(100);         // b === f(100)()
 *        let c = b(15);          // c === f(100)(15) === 85
 *        let p = tuple(100, 15);
 *        let A = curry(f);       // A(100)(15) === 85
 *        let B = uncurry(A);     // B(p) === 85
 *        let C = curry(B);       // A(100)(15) === C(100)(15) === 85
 * }
 * @param {function()} f - The function to curry.
 * @param {*} x - Any value, the first value of the new tuple argument.
 * @param {*} y - Any value, the second value of the new tuple argument.
 * @return {function()} - The curried function.
 */
 function curry(f, x, y) {
   if (f === undefined) { return curry; }
   if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
   if (y === undefined) { return curry(f)(x); }
   return curry(f)(x)(y);
 }

/**
 * Convert an array into a tuple. Returns {@code unit}, the empty tuple, if no arguments or
 * arguments other than an array are passed. This function will not work on array-like objects.
 * @param {Array<*>} array - The array to convert.
 * @return {Tuple} - The new tuple.
 */
function fromArrayToTuple(array) {
  if (array === undefined || Array.isArray(array) === false) { return unit; }
  return Reflect.construct(Tuple, Array.from(array));
}

/**
 * Convert a tuple into an array.
 * @param {Tuple} p - The tuple to convert.
 * @return {Array<*>} - The new array.
 */
function fromTupleToArray(p) {
  if (isTuple(p)) { return Reflect.ownKeys(p).map(key => p[key]); }
  _typeError(`Tuple`, p);
}

/**
 * Extract the first value of a tuple.
 * @param {Tuple} p - A tuple.
 * @return {*} - The first value of the tuple.
 */
function fst(p) {
  if (isTuple(p)) { return p[1]; }
  _typeError(`Tuple`, p);
}

/**
 * Determine whether an object is a tuple. The {@code unit}, or empty tuple, returns false.
 * @param {*} a - Any object.
 * @return {boolean} - True if the object is a tuple.
 */
function isTuple(a) { return a instanceof Tuple && a !== unit ? true : false; }

/**
 * Extract the second value of a tuple.
 * @param {Tuple} p - A tuple.
 * @return {*} - The second value of the tuple.
 */
function snd(p) {
  if (isTuple(p)) { return p[2]; }
  _typeError(`Tuple`, p);
}

/**
 * Swap the values of a tuple. This function does not modify the original tuple.
 * @param {Tuple} p - A tuple.
 * @return {Tuple} - A new tuple, with the values of the first tuple swapped.
 */
function swap(p) {
  if (isTuple(p)) { return Reflect.construct(Tuple, [snd(p), fst(p)]); }
  _typeError(`Tuple`, p);
}

/**
 * Create a new tuple from any number of values. A single value will be returned unaltered,
 * and {@code unit}, the empty tuple, will be returned if no arguments are passed.
 * @param {...*} values - The values to put into a tuple.
 * @return {Tuple} - A new tuple.
 */
function tuple(...values) {
  let [a, b] = values;
  if (a === undefined) return unit;
  if (b === undefined) return a;
  return new Tuple(...values);
}

/**
 * Convert a curried function to a single function that takes a tuple as an argument.
 * Mostly useful for uncurrying functions previously curried with the {@code curry()}
 * function from this library. This will not work if any arguments are bound to the
 * curried function (it would resulted in a type error in Haskell). Currying and
 * uncurrying are transitive. Example:
 * {@code let f = function(p) { return fst(p) - snd(p); };
 *        let p = tuple(100, 15); //
 *        let a = curry(f);       // a === f()()
 *        let b = uncurry(a);     // b === f()
 *        let c = b(p);           // c === f({`1`: 100, `2`: 15}) === 85
 *        let d = uncurry(a, p)   // d === 85
 * }
 * @param {function()} f - The function to uncurry.
 * @param {Tuple} p - The tuple from which to extract argument values for the function.
 * @return {function()} - The uncurried function.
 */
function uncurry(f, p) {
  if (f === undefined) { return uncurry; }
  if (p === undefined) { return p => f.call(f, fst(p)).call(f, snd(p)); }
  return f.call(f, fst(p)).call(f, snd(p));
}

/**
 * The {@code unit} object: an empty tuple. Note that {@code isTuple(unit) === false}.
 * @const {Tuple}
 */
const unit = new Tuple();

// List (from Data.List)

class List {
  constructor() {

  }
}

// API

export default {
  compare: compare,
  curry: curry,
  fromArrayToTuple: fromArrayToTuple,
  fromTupleToArray: fromTupleToArray,
  fst: fst,
  greaterThan: greaterThan,
  greaterThanOrEqual: greaterThanOrEqual,
  isEq: isEq,
  isNotEq: isNotEq,
  isTuple: isTuple,
  lessThan: lessThan,
  lessThanOrEqual: lessThanOrEqual,
  max: max,
  min: min,
  snd: snd,
  swap: swap,
  tuple: tuple,
  typeOf: typeOf,
  uncurry: uncurry,
  unit: unit
}
