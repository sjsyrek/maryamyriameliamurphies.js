`use strict`;

// Base

class Type {
  static typeCheck(a) {
    if (a.constructor !== this) {
      _typeError(this.name, a.constructor.name);
    }
    return this.name;
  }
  typeOf() { return this.constructor.name; }
}

class Demo extends Type {
  constructor(a) {
    super();
    this.id = a;
  }
  typeOf() { return this.id; }
}


/**
 * The identity function.
 * @param {*}
 * @return {*}
 */
function id(a) { return a; }

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
   //if (f === undefined) { return curry; }
   if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
   if (y === undefined) { return curry(f)(x); }
   return curry(f)(x)(y);
 }
let ff = function(p) { return fst(p) - snd(p); };
let aa = curry(ff);       // a === f()()
let bb = aa(100);         // b === f(100)()
let ccc = bb(15);          // c === f(100)(15) === 85
let pp = tuple(100, 15);
let A = curry(ff);       // A(100)(15) === 85
let B = uncurry(A);     // B(p) === 85
let C = curry(B);       // A(100)(15) === C(100)(15) === 85
//console.log(ccc)

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
  constructor(head, tail) {
    this.head = null;
    this.tail = null;
    if (head) { this.head = head; }
    if (tail) { this.tail = tail; }
  }
  static type(a) { return `[List]`; }
  static eq(a, b) { return fromListToArray(a).every((a, i) => a === fromListToArray(b)[i]); }
  static ord(a, b) {
    if (isEmpty(a) && isEmpty(b)) { return Ordering.EQ; }
    if (isEmpty(a) && isEmpty(b) === false) { return Ordering.LT; }
    if (isEmpty(a) === false && isEmpty(b)) { return Ordering.GT; }
    if (compare(a.head, b.head) === Ordering.EQ) { return compare(a.tail, b.tail)}
    return compare(a.head, b.head);
  }
  toString() { return `[Object List]`; }
  valueOf() { return this.head === null ? `[]` : `${this.head}:${this.tail.valueOf()}`; }
}

let y = list(5,5,10,11,3);
let yy = list(5,5,10,11,3);
let zz = list(100,2)


//console.log(compare(zz, yy))

// function list(...as) {
//   if (isEmpty(as)) { return new List(); }
//   return new List(as.shift(), list(...as));
// }

function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }


const emptyList = new List();


function type(a) { return a instanceof Type ? a.typeOf() : typeof a; }

function cons(x, xs) {
  let cons = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return Reflect.construct(List, [x, emptyList]); }
    if (xs instanceof List === false) { _typeError(`List`, xs); }
    if (_typeCheck(x, head(xs))) { return new List(x, xs); }
    _typeError(type(head(xs)), x);
  }
  return xs === undefined ? cons.bind(this, x) : cons.call(this, x, xs);
}


function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

let addTen = x =>  x + 10;
let multHund = x => x * 100;
let addTwenty = x => addTen(10);

let a = $(addTen)(multHund)(10)         // 1010
let b = $(addTen)(multHund, 10)         // 1010
let c = $(multHund)(addTen)(10)         // 2000
let d = $(multHund)(addTen, 10)         // 2000
let f = $(addTen)(addTwenty)()             //

function fromArrayToList(array) {
  if (array === undefined || Array.isArray(array) === false) { return new List(); }
  return list(...array);
}

function fromStringToList(str) { return fromArrayToList(str.split(``)); }

function fromListToString(a) {
  if (isList(a)) { return fromListToArray(a).join(``); }
  _typeError(`List`, a);
}

function head(a) {
  if (isList(a) && isEmpty(a) === false) { return a.head; }
  _typeError(`List`, a);
}

function isEmpty(a) {
  if (isList(a)) { return a === emptyList; }
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  if (Array.isArray(a)) { return a.length === 0; }
  _typeError(`List, Tuple, or Array`, a);
}

function isList(a) { return a instanceof List ? true : false; }

function fromListToArray(a) { return isEmpty(a) ? [] : [a.head].concat(fromListToArray(a.tail)); }

function tail(a) {
  if (isList(a) && isEmpty(a) === false) { return a.tail; }
  _typeError(`List`, a);
}

function show(a) { return a.valueOf(); }

function append(a) {
  if (a === undefined) { return append; }
  return function(a, b) {
    if (isList(a) === false ) { _typeError(`List`, a); }
    if (isList(b) === false ) { _typeError(`List`, b); }
    if (isEmpty(a)) { return b; }
    if (isEmpty(b)) { return a; }
    if (typeof head(a) !== typeof head(b)) { _typeError(`[${typeof head(a)}]`, `[${typeof head(b)}]`); }
    return cons(a.head)(append(a.tail)(b));
  }.bind(this, a);
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



// (++) []     ys = ys
// (++) (x:xs) ys = x : xs ++ ys

function init(a) {
  if (isList(a) && isEmpty(a) === false) { return isEmpty(a.tail) ? list() : cons(a.head)(init(a.tail)); }
  _typeError(`List`, a);
}

function length(a) {
  let lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(xs.tail, n + 1);
  if (isList(a)) { return lenAcc(a, 0); }
  _typeError(`List`, a);
}



function last(a) {
  if (isList(a) && isEmpty(a) === false) { return isEmpty(a.tail) ? a.head : last(a.tail); }
  _typeError(`List`, a);
}

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

let lst10 = list(1, 2, 3, 4, 5, 6, 7);
console.log(index(lst10)(2))

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

//console.log(show(z))

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

let lst1 = list(10, 20, 30, 40);
let lst2 = list(50, 60, 70, 80);
let lst3 = list(5, 7, 9);
let lst4 = list();
let z = zip(lst2)(lst1);
console.log(show(z))


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

let t = drop(1)(lst1);
let tt = drop(1, lst2);
console.log(show(tt))
console.log(show(t))

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


let func = function(x) { return x * 15; }


// let m = map(func)(lst4)
// console.log(show(m));

let s = map(func)(take(2)(drop(1)(lst1)));
console.log(show(s))

let cc = $(show)(take(2))(lst1);
console.log(cc)

// function intersperse(sep) {
//   if (sep === undefined) { return intersperse; }
//   return (sep, a) => {
//     if (isList(a) === false ) { _typeError(`List`, a); }
//     if (isEmpty(a)) { return list(); }
//     let x = a.head;
//     let xs = a.tail;
//     return cons(x)(prependToAll(sep)(xs));
//   }.bind(this, sep);
// }

// function prependToAll(sep) {
//   return (sep, xs) => {
//     isEmpty(xs) ? list() : cons(sep)(cons(xs.head)(prependToAll(sep)(xs.tail)));
//   }.bind(this, sep);
// }

// let ss = $(show)(intersperse(7))(lst1);

// let ccc = curry();
// console.log(ccc)

// intersperse             :: a -> [a] -> [a]
// intersperse _   []      = []
// intersperse sep (x:xs)  = x : prependToAll sep xs


// -- Not exported:
// -- We want to make every element in the 'intersperse'd list available
// -- as soon as possible to avoid space leaks. Experiments suggested that
// -- a separate top-level helper is more efficient than a local worker.
// prependToAll            :: a -> [a] -> [a]
// prependToAll _   []     = []
// prependToAll sep (x:xs) = sep : x : prependToAll sep xs