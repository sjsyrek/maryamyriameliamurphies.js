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

class Type {
  static _type(a) {
    if (a.constructor !== this) { _typeError(this.name, a.constructor.name); }
    return this.name;
  }
}

/**
 * Determine whether two objects are the same type, returning true if they are and false otherwise.
 * This is a limited form of type checking for this library.
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 * @private
 */
function _typeCheck(a, b) {
  if (a instanceof Type && b instanceof Type) { return a.constructor._type(a) === b.constructor._type(b); }
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
 * Compose two functions. In Haskell, f.g = \x -> f(g x), or the composition of two functions,
 * f and g is the same as applying the result of g to f, or f(g(x)) for a given argument x.
 * This pattern can't exactly be reproduced in JavaScript, since the dot operator denotes
 * namespace membership, and custom operators are not available. However, Haskell also provides
 * the $ operator, which simply binds functions right to left, allowing parentheses to be
 * omitted: f $ g $ h x = f (g (h x)). We still can't do this in JavaScript, but why not borrow
 * the $ for semantic consistency? Sorry, jQuery. Note that an argument need not be supplied
 * to the rightmost function, in which case $ returns a new function to which you can bind an
 * argument later. The leftmost function, however, must be a pure function, as its argument is
 * the value returned by the rightmost function. Example:
 * {@code let addTen = x => x + 10;
 *        let multHund = x => x * 100;
 *        let addTwenty = x => addTen(10);
 *        $(addTen)(multHund)(10)           // 1010
 *        $(addTen)(multHund, 10)           // 1010
 *        $(multHund)(addTen)(10)           // 2000
 *        $(multHund)(addTen, 10)           // 2000
 *        $(addTen)(addTwenty)()            // 30
 * }
 * @param {function()} f - The outermost function to compose.
 * @return {function()} - The composed function, called only if a value is bound to f.
 */
function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

/**
 * The identity function.
 * @param {*} a - Any value.
 * @return {*} a - The same value;
 */
function id(a) { return a; }

function isEmpty(a) {
  if (isList(a)) { return a === emptyList; } // a.head === null
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  if (Array.isArray(a)) { return a.length === 0; }
  _typeError(`List, Tuple, or Array`, a);
}

/**
 * Display the value of an object as a string.
 * @param {*} a - The object to show.
 * @return {string} - The value as a string.
 */
 function show(a) { return a.valueOf(); }

/**
 * Return the type of any object as specified by this library or its primitive type.
 * @param {*} a - Any object.
 * @return {string}
 */
function type(a) { return a instanceof Type ? a.typeOf() : typeof a; }

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
class Tuple extends Type {
  constructor(...as) {
    super();
    if (as.length === 0) { this[0] = null; }
    as.forEach((v, i) => this[i + 1] = v );
  }
  static _type(a) {
    if (a.constructor !== this) { _typeError(this.name, a.constructor.name); }
    return a.typeOf();
    }
  }
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
  typeOf() { return `(${Reflect.ownKeys(a).map(key => type(a[key])).join(', ')})`; }
  valueOf() { return `(${Reflect.ownKeys(this).map(key => type(this[key]) === 'string' ? `'${this[key]}'` : this[key]).join(', ')})`; }
}

/**
 * The {@code unit} object: an empty tuple. Note that {@code isTuple(unit) === false}.
 * @const {Tuple}
 */
const unit = new Tuple();

/**
 * Create a new tuple from any number of values. A single value will be returned unaltered,
 * and {@code unit}, the empty tuple, will be returned if no arguments are passed.
 * Usage: tuple(10, 20) -> {"1": 10, "2": 20}
 * @param {...*} values - The values to put into a tuple.
 * @return {Tuple} - A new tuple.
 */
function tuple(...as) {
  let [x, y] = as;
  if (x === undefined) return unit;
  if (y === undefined) return x;
  return new Tuple(...as);
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
function fromArrayToTuple(a) {
  if (Array.isArray(a)) { return Reflect.construct(Tuple, Array.from(a)); }
  _typeError(`Array`, a); }
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
  if (p === undefined) { return p => f.call(f, fst(p)).call(f, snd(p)); }
  return f.call(f, fst(p)).call(f, snd(p));
}

// List (from Data.List)

// Basic functions

class List extends Type {
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    if (head) { this.head = head; }
    if (tail) { this.tail = tail; }
  }
  static eq(a, b) { return fromListToArray(a).every((a, i) => a === fromListToArray(b)[i]); }
  static ord(a, b) {
    if (isEmpty(a) && isEmpty(b)) { return Ordering.EQ; }
    if (isEmpty(a) && isEmpty(b) === false) { return Ordering.LT; }
    if (isEmpty(a) === false && isEmpty(b)) { return Ordering.GT; }
    if (compare(a.head, b.head) === Ordering.EQ) { return compare(a.tail, b.tail)}
    return compare(a.head, b.head);
  }
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(this.head)}]`; }
  valueOf() { return this.head === null ? `[]` : `${this.head}:${this.tail.valueOf()}`; }
}

const emptyList = new List();

function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }

function cons(x, xs) {
  let cons = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return Reflect.construct(List, [x, emptyList]); }
    if (xs instanceof List === false) { _typeError(`List`, xs); }
    if (_typeCheck(x, head(xs))) { return new List(x, xs); }
    _typeError(type(head(xs)), x);
  }
  return xs === undefined ? cons.bind(this, x) : cons.call(this, x, xs);
}

function fromArrayToList(a) {
  if (Array.isArray(a)) { return list(...array); }
  _typeError(`Array`, a);
}

function fromListToArray(as) { return isEmpty(as) ? [] : [as.head].concat(fromListToArray(as.tail)); }

function fromListToString(as) {
  if (isList(as)) { return fromListToArray(as).join(``); }
  _typeError(`List`, as);
}

function fromStringToList(str) {
  if (typeof str === 'string') { return fromArrayToList(str.split(``)); }
  _typeError(`string`, a);
}

function head(as) {
  if (isList(as) && isEmpty(as) === false) { return as.head; }
  _typeError(`List`, as);
}

function init(as) {
  if (isList(as) && isEmpty(as) === false) { return isEmpty(as.tail) ? emptyList : cons(as.head)(init(as.tail)); }
  _typeError(`List`, as);
}

function isList(a) { return a instanceof List ? true : false; }

function last(as) {
  if (isList(as) && isEmpty(as) === false) { return isEmpty(as.tail) ? as.head : last(as.tail); }
  _typeError(`List`, as);
}

function length(as) {
  let lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(xs.tail, n + 1);
  if (isList(as)) { return lenAcc(as, 0); }
  _typeError(`List`, as);
}

function listAppend(as, bs) {
  let append = (as, bs) => {
    if (isList(as) === false ) { _typeError(`List`, as); }
    if (isList(bs) === false ) { _typeError(`List`, bs); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(as.head)(listAppend(as.tail)(bs)); }
    _typeError(`[${type(head(as))}]`, `[${type(head(bs))}]`);
  }
  return bs === undefined ? append.bind(this, as) : append.call(this, as, bs);
}

function tail(as) {
  if (isList(as) && isEmpty(as) === false) { return as.tail; }
  _typeError(`List`, as);
}

//uncons

// List transformations

// this function is in the style I should use for all other functions. Arrow
// functions with bindings and let expressions to make head and tail clear.
function map(f, as) {
  let m = (f, as) => {
    if (isList(as) === false ) { _typeError(`List`, as); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(f(x))(map(f)(xs));
  }
  return as === undefined ? m.bind(this, f) : m.call(this, f, as);
}

// Sublists

function drop(n, as) {
  let d = (n, as) => {
    if (isList(as) === false) { _typeError(`List`, as); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return drop(n - 1)(xs);
  }
  return as === undefined ? d.bind(this, n) : d.call(this, n, as);
}

function take(n, as) {
  let t = (n, as) => {
    if (isList(as) === false) { _typeError(`List`, as); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(x)(take(n - 1)(xs));
  }
  return as === undefined ? t.bind(this, n) : t.call(this, n, as);
}

// Indexing functions

function index(as, n) {
  let i = (as, n) => {
    if (isList(as) === false ) { _typeError(`List`, as); }
    if (n < 0) { throw RangeError(`Negative index given for ${as.name}.`); }
    if (isEmpty(as)) { throw RangeError(`Index too large given for ${as.name}.`); }
    let x = as.head;
    let xs = as.tail;
    if (n === 0) { return x; }
    return index(xs)(n - 1);
  }
  return n === undefined ? i.bind(this, as) : i.call(this, as, n);
}

// Zipping and unzipping lists

function zip(as, bs) {
  let z = (as, bs) => {
    if (isList(as) === false) { _typeError(`List`, as); }
    if (isList(bs) === false) { _typeError(`List`, bs); }
    if (isEmpty(as)) { return emptyList; }
    if (isEmpty(bs)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let y = bs.head;
    let ys = bs.tail;
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return bs === undefined ? z.bind(this, as) : z.call(this, as, bs);
}

// Ordered lists



// API

export default {
  $: $,
  id: id,
  isEmpty: isEmpty,
  show: show,
  type: type,
  isEq: isEq,
  isNotEq: isNotEq,
  compare: compare,
  lessThan: lessThan,
  lessThanOrEqual: lessThanOrEqual,
  greaterThan: greaterThan,
  greaterThanOrEqual: greaterThanOrEqual,
  max: max,
  min: min,
  unit: unit,
  tuple: tuple,
  curry: curry,
  fromArrayToTuple: fromArrayToTuple,
  fromTupleToArray: fromTupleToArray,
  fst: fst,
  isTuple: isTuple,
  snd: snd,
  swap: swap,
  uncurry: uncurry,
  emptyList: emptyList,
  list: list,
  cons: cons,
  fromArrayToList: fromArrayToList,
  fromListToArray: fromListToArray,
  fromListToString: fromListToString,
  fromStringToList: fromStringToList,
  head: head,
  init: init,
  isList: isList,
  last: last,
  length: length,
  listAppend: listAppend,
  tail: tail,
  map: map,
  drop: drop,
  take: take,
  index: index,
  zip: zip
}
