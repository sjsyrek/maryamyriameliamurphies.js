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
 * - [ghcjs](https://github.com/ghcjs/ghcjs)
 * - [purescript](https://github.com/purescript/purescript)
 * - [lazy.js](https://github.com/dtao/lazy.js)
 * - [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
 * - [casualjs](https://github.com/casualjs/f)
 *
 * Reading the code:
 *
 * I implement each Haskell datatype as an ES2015 class, hewing as closely as I can to the
 * Haskell original but with reasonable concessions to JavaScript idiom. Type classes are
 * represented by static class methods. Since the class definitions are not exported, these
 * methods remain private, thus providing a limited amount of type checking that cannot be
 * easily hacked by accident. For example, data types that are equatable (with ===) will work
 * with the isEq() function if they define an isEq() static function or are natively equatable.
 * This is not dissimilar to Haskell's own implementation under the hood, which uses C-style
 * virtual functions (or so I gather), which is also why none of these functions are members
 * of a class. All of them are meant to be, as in Haskell, pure functions that take one value
 * and return one value. Functions that take multiple arguments are curried automatically.
 * For the sake of those interested, the comment for each function includes the type signature
 * of its Haskell original. My hope is that most of the functions are otherwise self-documenting,
 * though the style is admittedly terse and, therefore, potentially bewildering (or Joycean?).
 * The public API for this library is specified, following CommonJS style, in a default object
 * at the bottom of this file. Corrections, modifications, improvements, and additions welcome.
 */

 /** @module maryamyriameliamurphies.js/source/index */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Error handling

/**
 * Whenever the library needs to throw an error, it calls one of the functions defined in this hash table, which calls in
 * turn the `throwError` function with the arguments to the error function applied to the given template string.
 * @const {Object} error - A hash table of error procedures.
 * @private
 * @example
 * error.typeError(0, and); // => *** Error: '0' is not a valid argument to function 'and'.
 */
const error = {
  emptyList: (a, f) => throwError(`'${a}' is an empty list, but '${f.name}' expects a non-empty list.`),
  listError: (a, f) => throwError(`'${a}' is type '${a.constructor.name}' but function '${f.name}' expects a list.`),
  nothing: (a, f) => throwError(`'${f}' returned Nothing from argument '${a}'.`),
  rangeError: (n, f) => throwError(`Index '${n}' is out of range in function '${f.name}'.`),
  returnError: (f1, f2) => throwError(`Unexpected return value from function '${f1.name}' called by function '${f2.name}'.`),
  tupleError: (p, f) => throwError(`'${p}' is type '${p.constructor.name}' but function '${f.name}' expects a tuple.`),
  typeError: (a, f) => throwError(`'${type(a) === 'function' ? `${type(a)} ${a.name}` : a}' is not a valid argument to function '${f.name}'.`),
  typeMismatch: (a, b, f) => throwError(`Arguments '${a}' and '${b}' to function '${f.name}' are not the same type.`)
};

/**
 * Throw an error, outputting the given message. This is one of the only impure functions in this library. I am thinking
 * about getting rid of error handling entirely, since it's such a pain to implement, but it does at least guarantee
 * at least some conformance to Haskell style. The question is whether this library would be more useful without it or
 * if the whole point of it is just to be a thought experiment.
 * @param {string} e - The error message to display.
 * @private
 */
function throwError(e) { throw Error(`*** Error: ${e}`); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Type system

/**
 * The base class for all other types. This class is not meant to be used on its own to instantiate new objects,
 * so it does not provide a constructor function of its own, but it does provide some default functionality for new
 * data types. The examples below apply to all children of this class and are for illustrative purposes only.
 * @private
 */
class Type {
  /**
   * Returns the type of an object if it is an instance of this data type, throws an error otherwise. This function
   * is not meant to be called directly but is used for type checking. To retrieve the data type of an object, use
   * the `type` function instead or `dataType` if performing your own type checking.
   * @abstract
   * @param {Type} a - An instance of this type class.
   * @returns {string} - The type.
   * @example
   * let lst = list(1,2,3);
   * List.type(lst);         // => List
   * let tup = tuple(1,2);
   * Tuple.type(tup);        // => (number,number)
   * let m = just(5);
   * Maybe.type(m);          // => Maybe
   */
  static type(a) { return dataType(a) === this ? this.name : error.typeError(a, this.type); }
  /**
   * Returns the string representation of an object for a given data type. As with most objects,
   * this is fairly useless and is here only for the sake of completeness.
   * @abstract
   * @returns {string} - The data type as a string.
   * @example
   * let tup = tuple(1,2);
   * tup.toString();         // => [Object Tuple]
   * let lst = list(1,2,3);
   * lst.toString();         // => [Object List]
   * let m = just(5);
   * m.toString();           // => Just 5
   */
  toString() { return this.valueOf(); }
  /**
   * Returns the type of an object for a given data type.
   * @abstract
   * @returns {string} - The type of the object.
   * @example
   * let tup = tuple(1,2);
   * tup.typeOf();           // => (number,number)
   * let lst = list(1,2,3);
   * lst.typeOf();           // => [number]
   * let m = just(5);
   * m.typeOf();             // => Maybe number
   */
  typeOf() { return dataType(this).name; }
  /**
   * Returns the value of an object for a given data type.
   * @abstract
   * @returns {string} - The value of the object.
   * @example
   * let tup = tuple(1,2);
   * tup.valueOf();          // => (1,2)
   * let lst = list(1,2,3);
   * lst.valueOf();          // => [1:2:3:[]]
   * let m = just(5);
   * m.valueOf();            // => Just 5
   */
  valueOf() { return this; }
}

/**
 * A utility function for declaring new type classes. Returns a closure that checks whether a given object is a
 * member of a predefined type class. Note that the library only checks for the existence of the required property
 * or properties. Whether or not those properties are functions and whether or not they return the values expected
 * by the type class are not verified.
 * @param {...string} methods
 * @returns {Function} - A closure that returns true if a given object declares all the given methods, false otherwise.
 * @const
 * @example
 * // requires that instances of the `Eq` type class define an `isEq` function
 * const Eq = defines(`isEq`);
 * // requires that instances of `Traversable` define `traverse` and also be instances of `Functor` and `Foldable`
 * const Traversable = defines(`fmap`, `foldr`, `traverse`);
 */
const defines = (...methods) => a => methods.every(m => Reflect.has(dataType(a), m));

/**
 * A utility function for returning the data type of a given object. In JavaScript, this is simply the object's
 * constructor, so this function really just serves as an alias for terminological clarification.
 * @param {*} a - Any object.
 * @returns {Function} - The object's constructor function.
 * @const
 * @example
 * dataType(0);               // function Number() { [native code] }
 * let lst = list(1,2,3);
 * dataType(lst)              // => function List(head, tail) { ... }
 * lst.typeOf();              // => List // more useful if you don't need a function pointer
 */
const dataType = (a) => a.constructor;

/**
 * Return the type of any object as specified by this library or, otherwise, its primitive type.
 * @param {*} a - Any object.
 * @returns {string} - The type of the object.
 * @example
 * type(0);                   // => number
 * let t = tuple(1,2);
 * type(t);                   // => (number,number)
 */
function type(a) { return a instanceof Type ? a.typeOf() : typeof a; }

/**
 * Determine whether two objects are the same type, returning `true` if they are and `false` otherwise.
 * This is a limited form of type checking for this library. It is by no means foolproof but should at least
 * prevent most careless errors.
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - `true` if the two objects are the same type, `false` otherwise.
 * @example
 * typeCheck(0, 1);         // => true
 * typeCheck(0, 'a');       // => false
 */
function typeCheck(a, b) {
  let p = (a, b) => {
    if (a instanceof Type && b instanceof Type) { return dataType(a).type(a) === dataType(b).type(b); }
    if (dataType(a) === dataType(b)) { return true; }
    return false;
  }
  return partial(p, a, b);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Basic functions

/**
 * Partially apply arguments to a given function. Accepts a function and a variable number of arguments.
 * If all the arguments are applied, calls the function and returns its value. Otherwise, returns a new
 * function bound by whichever values have already been applied. In Haskell, all functions technically
 * bind one argument and return one value. Functions that take multiple arguments are actually curried
 * under the hood, therefore such a function actually returns another function with its first argument
 * bound, then another with its second, and so on until all expected arguments have been bound. Likewise,
 * almost every function in this library that accepts multiple arguments is similarly curried, so you
 * can partially apply arguments to almost any function and pass that value around as an argument to
 * another function, if you so desire. Note that `partial` itself cannot be partially applied, but I
 * expose it anyway, because it might be useful to others writing their own functions for this library.
 * @param {Function} f - The function to partially apply.
 * @param {...*) as - The values expected as arguments.
 * @returns {Function|*} - A new function with its arguments partially or fully applied (i.e. its final value).
 * @example
 * function multiply(x, y) {
 *   let p = (x, y) => x * y; // create a closure with the same arguments and "do the math" in this closure
 *   return partial(p, x, y); // return a "curried" version of the function that accepts partial application
 * }
 * multiply(10, 10);          // => 100
 * multiply(10);              // => function () { [native code] } // (with 10 applied to x)
 * multiply(10)(10);          // => 100
 */
function partial(f, ...as) {
  if (isEmpty(as)) { return f.call(); }
  let a = as.shift();
  if (a === undefined) { return f; }
  let p = f.bind(f, a);
  return partial(p, ...as);
}

/**
 * Compose two functions. In Haskell, f.g = \x -> f(g x), or the composition of two functions
 * f and g is the same as applying the result of g to f, or f(g(x)) for a given argument x.
 * This pattern can't exactly be reproduced in JavaScript, since the dot operator denotes
 * namespace membership, and custom operators are not available. However, Haskell also provides
 * the $ operator, which simply binds functions right to left, allowing parentheses to be
 * omitted: f $ g $ h x = f (g (h x)). We still can't do this in JavaScript, but why not borrow
 * the $ for some semantic consistency? Sorry, jQuery. This function takes one function as an
 * argument and returns a new closure that expects another function and a single argument. This
 * function will not work as expected if you pass in two arguments. Note that an argument need
 * not be supplied to the rightmost function, in which case `$` returns a new function to which
 * you can bind an argument later. The leftmost function, however, must be a pure function, as
 * its argument is the value returned by the rightmost function (though you can use for `f` a
 * function with all but one of its arguments partially applied).
 * Haskell> (.) :: (b -> c) -> (a -> b) -> a -> c
 * @param {Function} f - The outermost function to compose.
 * @returns {Function|*} - The composed function or its value, returned only if a value is bound to f.
 * @example
 * let addTen = x => x + 10;
 * let multHund = x => x * 100;
 * let addTwenty = x => addTen(10);
 * let h = (x, y) => {
 *   let p = (x, y) => x / y;
 *   return partial(p, x, y);
 * }
 * let divByTen = h(10);
 * $(addTen)(multHund)(10)            // => 1010
 * $(addTen)(multHund, 10)            // => 1010
 * $(multHund)(addTen)(10)            // => 2000
 * $(multHund)(addTen, 10)            // => 2000
 * $(addTen)(addTwenty)()             // => 30
 * $(divByTen)(multHund)(10)          // => 0.01
 * }
 */
function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

/**
 * Reverse the order in which arguments are applied to a function. Note that flip only works on functions
 * that take two arguments.
 * Haskell> flip :: (a -> b -> c) -> b -> a -> c
 * @param {Function} f - The function to flip.
 * @returns {Function} - The function with its arguments reversed.
 * @example
 * let subtract = (x, y) => x - y;
 * let flipped = flip(subtract);
 * subtract(10, 5);                // => 5
 * flipped(10, 5);                 // => -5
 */
function flip(f) { return (x, y) => y === undefined ? y => f(y, x) : f(y, x); }

/**
 * The identity function. Returns the value of the argument unchanged.
 * Haskell> id :: a -> a
 * @param {*} a - Any object.
 * @returns {*} a - The same object.
 * @example
 * id(1);           // => 1
 * id(list(1,2,3)); // => [1:2:3:[]]
 */
function id(a) { return a; }

/**
 * Return the value of the first argument, throwing away the value of the second argument.
 * Haskell> const :: a -> b -> a
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {*} a - The value of the first object.
 * @example
 * constant(2, 3);                                // => 2
 * let multHund = x => x * 100;
 * let c = (x, y) => $(constant(x))(multHund)(y);
 * c(5, 10);                                      // => 5
 */
function constant(a, b) {
  let p = (a, b) => a;
  return partial(p, a, b);
}

/**
 * Yield the result of applying function `f` to a value `x` until the predicate
 * function `pred` is true. A negative, recursive version of a `while` loop.
 * Haskell> until :: (a -> Bool) -> (a -> a) -> a -> a
 * @param {Function} pred - A predicate function that returns a boolean.
 * @param {Function} f - The function to apply to `x`.
 * @param {*} x - The value to bind to `f`.
 * @returns {*} - The result of applying `f` to `x` until `pred` returns `true`.
 * @example
 * let pred = x => x > 10;
 * let f = x => x + 1;
 * let u = until(pred, f);
 * u(1);                   // => 11
 */
function until(pred, f, x) {
  let p = (pred, f, x) => pred(x) ? x : until(pred, f, f(x));
  return partial(p, pred, f, x);
}

/**
 * Boolean "and". Return `true` if both arguments are true, `false` otherwise.
 * Haskell> (&&) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @returns {boolean} - a && b.
 * @example
 * and(true, true); // => true
 * let a = 5 > 0;
 * let b = 0 > 5;
 * and(a, b);       // => false
 */
function and(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, and); }
    if (type(b) !== `boolean`) { return error.typeError(b, and); }
    return true && b ? b : false;
  }
  return partial(p, a, b);
}

/**
 * Boolean "or". Return `true` if either argument is true, `false` otherwise.
 * Haskell> (||) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @returns {boolean} - a || b.
 * @example
 * or(true, false); // => true
 * let a = 5 > 0;
 * let b = 0 > 5;
 * or(a, b);        // => true
 */
function or(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, or); }
    if (type(b) !== `boolean`) { return error.typeError(b, or); }
    return a ? true : b;
  }
  return partial(p, a, b);
}

/**
 * Boolean "not". Return `true` if the argument is false, `false` otherwise.
 * Example: {@code not(false) // true }
 * Haskell> not :: Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @returns {boolean} - !a.
 * @example
 * not(true);     // => false
 * not(false);    // => true
 * let a = 5 > 0;
 * let b = 0 > 5;
 * not(a);        // => false
 * not(b);        // => true
 */
function not(a) {
  if (a === true) { return false; }
  if (a === false) { return true; }
  return error.typeError(a, not);
}

/**
 * Return `true` if a value is even, `false` otherwise.
 * Haskell> even :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if even, `false` otherwise.
 */
function even(a) { return a % 2 === 0; }

/**
 * Return `true` if a value is odd, `false` otherwise.
 * Haskell> odd :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if odd, `false` otherwise.
 */
function odd(a) { return $(not)(even)(a); }

/**
 * Check whether a value is an empty collection. Returns `true` if the value is an empty list, an empty tuple,
 * or an empty array. Throws a type error, otherwise. This function is somewhat superfluous and probably does
 * too much, but it's useful for the time being.
 * @param {Object} a - Any collection value of type List, Tuple, or Array.
 * @returns {boolean} - `true` if the collection is empty, `false` otherwise.
 * @example
 * isEmpty([]);                // => true
 * isEmpty([[]]);              // => false (warning!)
 * isEmpty(emptyList);         // => true
 * isEmpty(list(emptyList));   // => false (warning!)
 * isEmpty(tuple(1,2));        // => false
 * isEmpty(unit);              // => true
 * isEmpty(tuple(unit, unit)); // => false (warning!)
 */
function isEmpty(a) {
  if (isList(a)) { return a === emptyList; }
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  if (Array.isArray(a)) { return a.length === 0; }
  return error.typeError(a, isEmpty);
}

/**
 * Display the value of an object as a string. Calls the object's `valueOf` function. Useful for custom
 * types that look ugly when displayed as objects.
 * @param {*} a - The object to show.
 * @returns {string} - The value of the object as a string, returned from the object's `valueOf` function.
 * @example
 * let lst = list(1,2,3);
 * let tup = tuple(1,2);
 * lst;                   // => {"head":1,"tail":{"head":2,"tail":{"head":3,"tail":{"head":null,"tail":null}}}}
 * show(lst);             // => [1:2:3:[]]
 * tup;                   // => {"1":1,"2":2}
 * show(tup);             // => (1,2)
 */
function show(a) { return a instanceof Tuple ? `(${Object.values(a).map(e => e.valueOf())})` : a.valueOf(); }

/**
 * A utility function for displaying the results of show on the console. One could imagine a more generalized
 * `printBy` function that redirects the output of `show(a)` elsewhere.
 * @param {*} a - The value to print.
 * @returns {Function} - The `console.log` function applied to the return value of `show(a)`.
 * @example
 * let lst = list(1,2,3);
 * print(lst);            // "[1:2:3:[]]"
 */
function print(a) { return console.log(show(a)); }

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
const EQ = new Ordering(`EQ`);

/**
 * The "less than" Ordering. Equivalent to <.
 * @const {Ordering}
 */
const LT = new Ordering(`LT`);

/**
 * The "greater than" Ordering. Equivalent to >.
 * @const {Ordering}
 */
const GT = new Ordering(`GT`);

/**
 * Compare two objects and return an `Ordering`. Both values must be instances of the `Ord` type class
 * (i.e. they both define a `compare` static method) and must also be the same data type (or the same
 * primitive type). Only a single comparison is required to determine the precise ordering of two objects.
 * Haskell> compare :: a -> a -> Ordering
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {Ordering} - The Ordering value (`EQ` for equality, `LT` for less than, or `GT` for greater than).
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * compare(lst1, lst2);    // => LT
 * compare(lst2, lst1);    // => GT
 * let tup1 = tuple(1,2);
 * let tup2 = tuple(2,1);
 * let tup3 = swap(tup2);
 * compare(tup1, tup2);    // => LT
 * compare(tup2, tup3);    // => GT
 * compare(tup3, tup1);    // => EQ
 */
function compare(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) {
      if (Ord(a)) { return dataType(a).compare(a, b); }
      if (isEq(a, b)) { return EQ; }
      if (a < b) { return LT; }
      if (a > b) { return GT; }
    }
    return error.typeMismatch(a, b, compare);
  }
  return partial(p, a, b);
}

/**
 * Determine whether one value is less than another.
 * Haskell> (<) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a < b.
 */
function lessThan(a, b) {
  let p = (a, b) => compare(a, b) === LT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is less than or equal to another.
 * Haskell> (<=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a <= b.
 */
function lessThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== GT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is greater than another.
 * Haskell> (>) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a > b.
 */
function greaterThan(a, b) {
  let p = (a, b) => compare(a, b) === GT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is greater than or equal to another.
 * Haskell> (>=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {boolean} - a >= b.
 */
function greaterThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== LT;
  return partial(p, a, b);
}

/**
 * Return the higher in value of two objects.
 * Haskell> max :: a -> a -> a
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {*} - `a` or `b`, whichever is greater.
 * @example
 * let tup1 = tuple(1,2);
 * let tup2 = tuple(2,1);
 * let tup3 = swap(tup2);
 * max(tup1, tup2);       // => (2,1)
 * max(tup2, tup1);       // => (2,1)
 * max(tup3, tup1);       // => (1,2)
 */
function max(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? b : a;
  return partial(p, a, b);
}

/**
 * Return the lower in value of two objects.
 * Haskell> min :: a -> a -> a
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @returns {*} - `a` or `b`, whichever is lesser.
 * @example
 * let tup1 = tuple(1,2);
 * let tup2 = tuple(2,1);
 * let tup3 = swap(tup2);
 * min(tup1, tup2);       // => (1,2)
 * min(tup2, tup1);       // => (1,2)
 * min(tup3, tup1);       // => (1,2)
 */
function min(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? a : b;
  return partial(p, a, b);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Monoid

/**
 * A `Monoid` is a type with an associative binary operation that has an identity. In plainer language,
 * a monoid is any type that has an "empty" value that, when "appended" to any other value of that
 * type, equals that same value. For example, an integer is a monoid, because any integer added to 0,
 * the "empty" value, equals that integer. Likewise, a list is a monoid, because any list appended to
 * the empty list equals the original list. Monoids must define `mempty` and `mappend` methods.
 * @const {Function} - Returns `true` if an object is an instance of `Monoid` and `false` otherwise.
 */
const Monoid = defines(`mempty`, `mappend`);

/**
 * Return the identity (or "empty") value for the monoid.
 * Haskell> mempty :: a
 * @param {Object} a - Any monoid.
 * @returns {Object} - Identity of mappend.
 */
function mempty(a) { return Monoid(a) ? dataType(a).mempty(a) : error.typeError(a, mempty); }

/**
 * Perform an associative operation (similar to appending to a list) on two monoids.
 * Haskell> mappend :: a -> a -> a
 * @param {Object} a - Any monoid.
 * @param {Object} b - Any monoid.
 * @returns {Object} - A new monoid of the same type, the result of the associative operation.
 * @example
 * let l1 = list(1,2,3);           // => [1:2:3:[]]
 * let l2 = list(4,5,6);           // => [4:5:6:[]]
 * let l3 = list(7,8,9);           // => [7:8:9:[]]
 * mappend(mempty(l1), l1);        // => [1:2:3:[]]
 * mappend(l1, (mappend(l2, l3))); // => [1:2:3:4:5:6:7:8:9:[]]
 * mappend(mappend(l1, l2), l3);   // => [1:2:3:4:5:6:7:8:9:[]]
 */
function mappend(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) { return Monoid(a) ? dataType(a).mappend(a, b) : error.typeError(a, mappend); }
    return error.typeMismatch(a, b, mappend);
  }
  return partial(p, a, b);
}

/**
 * Fold a list using the monoid. Concatenates a list of monoids into a single list. For example, since
 * lists themselves are monoids, this function will flatten a list of lists into a single list. Example:
 * Haskell> mconcat :: [a] -> a
 * @param {Object} a - Any monoid.
 * @returns {Object} - A new monoid of the same type, the result of the concatenation.
 * @example
 * let l1 = list(1,2,3);    // => [1:2:3:[]]
 * let l2 = list(4,5,6);    // => [4:5:6:[]]
 * let l3 = list(7,8,9);    // => [7:8:9:[]]
 * let ls = list(l1,l2,l3); // => [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 * mconcat(ls);             // => [1:2:3:4:5:6:7:8:9:[]]
 */
function mconcat(a) { return foldr(mappend, mempty(a), a); }

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Applicative

/**
 * `Applicative` functors are functors that support function application within their contexts. They must
 * define `pure` and `ap` methods and also be instances of `Functor`.
 * @const {Function} - Returns `true` if an object is an instance of `Applicative` and `false` otherwise.
 */
const Applicative = defines(`fmap`, `pure`, `ap`);

/**
 * Lift a value into an applicative context.
 * Haskell> pure :: a -> f a
 * @param {Object} f - An applicative functor.
 * @param {*} a - Any object.
 * @returns {Object} - An applicative functor with the value injected.
 * @example
 * let lst = list(1,2,3); // => [1:2:3:[]]
 * let p = pure(lst, 5);  // => [5:[]]
 */
function pure(f, a) {
  let p = (f, a) => Applicative(f) ? dataType(f).pure(a) : error.typeError(f, pure);
  return partial(p, f, a);
}

/**
 * Apply a function within an applicative context to an applicative functor.
 * Haskell> (<*>) :: f (a -> b) -> f a -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - An applicative functor.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 * @example
 * let lst = list(1,2,3);
 * let p = pure(lst, id);       // lift id function into applicative context
 * ap(p, lst);                  // => [1:2:3:[]] // proves identity
 * let f = x => x * 2;
 * let g = x => x * 3;
 * let pf = pure(lst, f);
 * let pg = pure(lst, g);
 * let p$ = pure(lst, $);
 * ap(ap(ap(p$)(pf))(pg))(lst); // => [6:12:18:[]] // not pretty
 * ap(ap(ap(p$, pf), pg), lst); // => [6:12:18:[]] // but
 * ap(pf, ap(pg, lst));         // => [6:12:18:[]] // proves composition
 * ap(pf, pure(lst, 10));       // => [20:[]]
 * pure(lst, f(10));            // => [20:[]] // proves homomorphism
 * ap(pf, pure(lst, 3));        // => [6:[]]
 * let a = pure(lst, 3);
 * ap(pf, a);                   // => [6:[]] // proves interchange (well, not really possible?)
 */
function ap(f, a) {
  let p = (f, a) => {
    if (Applicative(f) === false) { error.typeError(f, ap); }
    if (Applicative(a) === false) { error.typeError(a, ap); }
    return dataType(a).ap(f, a);
  }
  return partial(p, f, a);
}

/**
 * A variant of `ap` with the arguments reversed.
 * Haskell> (<**>) :: Applicative f => f a -> f (a -> b) -> f b
 * @param {Function} f - A function lifted into an applicative context.
 * @param {Object} a - The first argument to f.
 * @param {Object} b - The second argument to f.
 * @returns {Object} - A new applicative functor of the same type, the result of the application.
 */
function apFlip(f, a, b) {
  let p = (f, a, b) => liftA2(flip(f), a, b);
  return partial(p, f, a, b);
}

/**
 * Sequence actions, discarding the value of the first argument.
 * Haskell> (*>) :: f a -> f b -> f b
 * @param {Object} a1 - The action to skip.
 * @param {Object} a2 - The action to perform.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * let l1 = list(1,2,3);
 * let l2 = list(4,5,6);
 * then(l1, l2);         // => [4:5:6:4:5:6:4:5:6:[]]
 */
function then(a1, a2) {
  let p = (a1, a2) => liftA2(constant(id), a1, a2);
  return partial(p, a1, a2);
}

/**
 * Sequence actions, discarding the value of the second argument. Example:
 * Haskell> (<*) :: f a -> f b -> f a
 * @param {Object} a1 - The action to perform.
 * @param {Object} a2 - The action to skip.
 * @returns {Object} - A new applicative functor, the result of sequencing the actions.
 * @example
 * let l1 = list(1,2,3);
 * let l2 = list(4,5,6);
 * skip(l1, l2);         // => [1:1:1:2:2:2:3:3:3:[]]
 */
function skip(a1, a2) {
  let p = (a1, a2) => liftA2(constant, a1, a2);
  return partial(p, a1, a2);
}

/**
 * Lift a function into an applicative context.
 * Haskell> liftA :: Applicative f => (a -> b) -> f a -> f b
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the context to lift the function into.
 * @returns {Object} - The result of applying the lifted function.
 */
function liftA(f, a) {
  let p = (f, a) => ap(dataType(a).pure(f))(a);
  return partial(p, f, a);
}

/**
 * Lift a binary function to actions.
 * Haskell> liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @returns {Object} - The result of applying the lifted function.
 */
function liftA2(f, a, b) {
  let p = (f, a, b) => ap(fmap(f, a))(b);
  return partial(p, f, a, b);
}

/**
 * Lift a ternary function to actions.
 * Haskell> liftA3 :: Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
 * @param {Function} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @param {Object} c - An applicative functor, the third argument to f.
 * @returns {Object} - The result of applying the lifted function.
 */
function liftA3(f, a, b, c) {
  let p = (f, a, b, c) => ap(ap(fmap(f, a))(b))(c);
  return partial(p, f, a, b, c);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Monad

/**
 * A monad is an abstract datatype of actions. Instances of `Monad` must define a `bind` method as well
 * all the required methods for `Functor` and `Applicative`.
 * @const {Function} - Returns `true` if an object is an instance of `Monad` and `false` otherwise.
 */
const Monad = defines(`fmap`, `pure`, `ap`, `bind`);

/**
 * Inject a value into the monadic type.
 * Haskell> return :: a -> m a
 * @param {Object} m - A monad.
 * @param {*} a - The value to inject.
 * @returns {Object} - A new monad of the same type with the value injected.
 */
function inject(m, a) {
  let p = (m, a) => Monad(m) ? dataType(m).pure(a) : error.typeError(m, inject);
  return partial(p, m, a);
}

/**
 * Sequentially compose two actions, passing any value produced by the first as an argument to the second.
 * Haskell> (>>=) :: m a -> (a -> m b) -> m b
 * @param {Object} m - A monad.
 * @param {Function} f - A function to bind to the injected value of the monad. This function must return a monad.
 * @returns {Object} - A new monad of the same type, the result of binding the function to the original injected value.
 */
function bind(m, f) {
  let p = (m, f) => Monad(m) ? dataType(m).bind(m, f) : error.typeError(m, bind);
  return partial(p, m, f);
}

/**
 * Sequentially compose two actions, discarding any value produced by the first, like sequencing operators
 * (such as the semicolon) in imperative languages.
 * @param {Object} m - A monad.
 * @param {Function} f - A function to call that ignores the injected value of the monad.
 * @returns {Object} - A new monad of the same type, the result of calling the function.
 * Haskell> (>>) :: m a -> m b -> m b
 */
function chain(m, f) {
  let p = (m, f) => Monad(m) ? then(m, f) : error.typeError(m, chain);
  return partial(p, m, f);
}

/**
 * The same as `bind` but with the arguments interchanged.
 * Haskell> (=<<) :: Monad m => (a -> m b) -> m a -> m b
 * @param {Function} f - A function to bind to the injected value of the monad.
 * @param {Object} m - A monad.
 * @returns {Object} - A new monad of the same type, the result of binding the function to the original injected value.
 */
function bindFlip(f, m) {
  let p = (f, m) => bind(m, f);
  return partial(p, f, m);
}

/**
 * Remove one level of monadic structure from a monad, projecting its bound argument into the outer level.
 * Haskell> join :: Monad m => m (m a) -> m a
 * @param {Object} m - A monad (wrapping another monad).
 * @returns {Object} - The wrapped monad on its own.
 * @example
 * let m = just(10); // => Just 10
 * let n = just(m);  // => Just Just 10
 * join(n);          // => Just 10
 * join(m);          // => *** Error: 'Just 10' is not a valid argument to function 'join'.
 */
function join(m) {
  if (Monad(m)) { return Monad(bind(m, id)) ? bind(m, id) : error.typeError(m, join); }
  return error.typeError(m, join);
}

/**
 * Promote a function to a monad.
 * Haskell> liftM :: Monad m => (a1 -> r) -> m a1 -> m r
 * @param {Function} f - The function to lift into a monad.
 * @param {Object} m - The monad to lift the function into.
 * @returns {Object} - A new monad containing the result of mapping the function over the monad.
 */
function liftM(f, m) {
  let p = (f, m) => Monad(m) ? dataType(m).fmap(f, m) : error.typeError(m, liftM);
  return partial(p, f, m)
}

/**
 * Since there is no way to exactly replicate Haskell's 'do' notation for monadic chaining, but it
 * would be useful to have a similar affordance, this class provides such a mechanism. See `Do`
 * below for an example of how it works.
 * @private
 */
class DoBlock {
  /**
   * Create a new monadic context for chaining actions.
   * @param {Object} m - A monad, the context for the actions.
   */
  constructor(m) { this.m = () => m; }
  inject(a) { return Do(dataType(this.m()).pure(a)); }
  bind(f) { return Do(bind(this.m(), f)); }
  chain(f) { return Do(chain(this.m(), f)); }
  valueOf() { return `${this.m().typeOf()} >>= ${this.m().valueOf()}`; }
}

/**
 * Wrap a monad in a special container for the purpose of chaining actions, in imitation of the
 * syntactic sugar provided by Haskell's 'do' notation. Example:
 * @param {Object} m - A monad.
 * @returns {DoBlock} - A monadic context in which to chain actions.
 * @example
 * let m = just(10);
 * let f = x => just(x * 2);
 * let g = x => just(x - 1);
 * Do(m).bind(f).bind(g);              // => Maybe >>= Just 19
 * Do(m).bind(f).chain(m).bind(g);     // => Maybe >>= Just 9
 * let lst = list(1,2,3);
 * let m = x => list(x + 1);
 * let n = x => list(x * 2);
 * Do(lst).bind(m).bind(n);            // => List >>= [4:6:8:[]]
 * Do(lst).bind(m).chain(lst).bind(n); // => List >>= [2:4:6:2:4:6:2:4:6:[]]
 * let put = x => {
 *   print(x);
 *   return just(x);
 * }
 * Do(m)
 * .bind(put)                          // => 10
 * .bind(f)
 * .bind(put)                          // => 20
 * .chain(m)
 * .bind(put)                          // => 10
 * .bind(g)
 * .bind(put)                          // => 9
 * .bind(f)
 * .bind(put);                         // => 18
 */
function Do(m) { return Monad(m) ? new DoBlock(m) : error.typeError(Do, m); }

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Traversable

/**
 * A `Traversable` is a functor representing data structures that can be traversed from left to right. They
 * must define a `traverse` method and also be instances of `Functor` and `Foldable`.
 * @const {Function} - Returns `true` if an object is an instance of `Traversable` and `false` otherwise.
 */
const Traversable = defines(`fmap`, `foldr`, `traverse`);

/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect
 * the results.
 * Haskell> traverse :: Applicative f => (a -> f b) -> t a -> f (t b)
 * @param {Function} f - The function to map.
 * @param {Object} a - The traversable structure to traverse.
 * @returns {Object} - A collection of the results of the traversal.
 * @example
 * let lst = list(1,2,3);
 * let f = x => list(x + 7);
 * traverse(f)(lst);         // => [[8:9:10:[]]:[]]
 * let tup = tuple(1,2);
 * traverse(f, tup);         // => [(1,9):[]]
 */
function traverse(f, a) {
  let p = (f, a) => { return Traversable(a) ? dataType(a).traverse(f, a) : error.typeError(a, traverse); }
  return partial(p, f, a);
}

/**
 * Map each element of a structure to a monadic action, evaluate these actions from left to right,
 * and collect the results. This function is essentially the same as `traverse`.
 * Haskell> mapM :: Monad m => (a -> m b) -> t a -> m (t b)
 * @param {Function} f - The function to map.
 * @param {Object} m - The monad to traverse.
 * @returns {Object} - A collection of the results of the traversal.
 */
function mapM(f, m) {
  let p = (f, m) => Monad(m) ? dataType(m).traverse(f, m) : error.typeError(m, mapM);
  return partial(p, f, m);
}

/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 * Haskell> sequence :: Monad m => t (m a) -> m (t a)
 * @param {Object} m - The monadic collection of actions.
 * @returns {Object} - A collection of the results.
 * @example
 * let lst = list(1,2,3);
 * let llst = list(lst);
 * sequence(llst);        // => [[1:[]]:[2:[]]:[3:[]]:[]]
 */
function sequence(m) { return Monad(m) ? traverse(id, m) : error.typeError(m, sequence); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Maybe

/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a` either contains a value of
 * type `a` (represented as `Just a`), or it is empty (represented as `Nothing`). Using Maybe
 * is a good way to deal with errors or exceptional cases without resorting to drastic measures such as
 * throwing an error. That's how the Haskell docs define it, and I don't think I can do a better job.
 * @extends Type
 * @private
 */
class Maybe extends Type {
  /**
   * Create a new `Maybe`, which represents either a value or `Nothing`.
   * @param {*} a - The value to wrap in a `Maybe`.
   */
  constructor(a) {
    super();
    if (a !== undefined) { this.value = () => a; }
  }
  // Eq
  static isEq(a, b) {
    if (isNothing(a) && isNothing(b)) { return true; }
    if (isNothing(a) || isNothing(b)) { return false; }
    return isEq(a.value(), b.value());
  }
  // Ord
  static compare(a, b) {
    if (isEq(a, b)) { return EQ; }
    if (isNothing(a)) { return LT; }
    if (isNothing(b)) { return GT; }
    return compare(a.value(), b.value());
  }
  // Monoid
  static mempty(a) { return Nothing; }
  static mappend(m1, m2) {
    if (isNothing(m1)) { return m2; }
    if (isNothing(m2)) { return m1; }
    return Reflect.construct(Maybe, [mappend(m1.value(), m2.value())]);
  }
  // Foldable
  static foldr(f, z, m) { return isNothing(m) ? z : f(m.value(), z); }
  // Traversable
  static traverse(f, m) { return isNothing(m) ? pure(m, Nothing) : fmap(maybe, f(x)); }
  // Functor
  static fmap(f, m) { return isNothing(m) ? Nothing : Reflect.construct(Maybe, [f(m.value())]); }
  // Applicative
  static pure(m) { return just(m); }
  static ap(f, m) { return isNothing(f) ? Nothing : fmap(f.value(), m); }
  // Monad
  static bind(m, f) { return isNothing(m) ? Nothing : f(m.value()); }
  // Prototype
  typeOf() { return `Maybe ${this.value === undefined ? 'Nothing' : type(this.value())}`; }
  valueOf() { return this.value === undefined ? `Nothing` : `Just ${this.value()}`; }
}

/**
 * `Nothing` is the absence of a value, the opposite of `Just` for a `Maybe` object. Since all
 * nothings are the same nothing, there is only one `Nothing` (c.f. Wallace Stevens).
 * @const {Maybe}
 */
const Nothing = new Maybe();

/**
 * A constructor for a `Maybe` value. Returns `Nothing` if the value is `undefined`, `null`, or `NaN`.
 * @param {*} a - The value to wrap in a `Maybe`.
 * @returns {Maybe} - `Just a` or `Nothing`.
 */
function just(a) { return a === undefined || a === null || a !== a ? Nothing : new Maybe(a); }

/**
 * The `maybe` function takes a default value, a function, and a `Maybe` value. If the `Maybe` value is
 * `Nothing`, the function returns the default value. Otherwise, it applies the function to the value
 * inside the `Just` and returns the result.
 * Haskell> maybe :: b -> (a -> b) -> Maybe a -> b
 * @param {*} n - The default value to return if `m` is `Nothing`.
 * @param {Function} f - The function to apply to the value inside `m` if it is a `Just`.
 * @param {Maybe} m - A `Maybe`.
 * @returns {*} - `f` applied to the value contained in the `Just` or `n` if the `Maybe` is `Nothing`.
 * @example
 * let m1 = just(100);
 * let m2 = just(null);
 * let f = x => x * 10;
 * maybe(0, f, m1);     // => 1000
 * maybe(0, f, m2);     // => 0
 */
function maybe(n, f, m) {
  let p = (n, f, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, maybe); }
    return Nothing(m) ? n : f(fromJust(m));
  }
  return partial(p, n, f, m);
}

/**
 * Determine whether an object is a `Maybe`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `Maybe` and `false` otherwise.
 */
function isMaybe(a) { return a instanceof Maybe ? true : false; }

/**
 * Determine whether an object is a `Just`.
 * Haskell> isJust :: Maybe a -> Bool
 * @param {Maybe} m - Any object.
 * @returns {boolean} - `true` is the object is a `Just` and `false` otherwise.
 */
function isJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isJust); }
  return isNothing(m) ? false : true;
}

/**
 * Determine whether an object is `Nothing`.
 * Haskell> isNothing :: Maybe a -> Bool
 * @param {Maybe} m - Any object.
 * @returns {boolean} - `true` is the object is `Nothing` and `false` otherwise.
 */
function isNothing(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isNothing); }
  return m === Nothing ? true : false;
}

/**
 * Extract the value from a `Just`. Throws an error if the `Maybe` is `Nothing`.
 * Haskell> fromJust :: Maybe a -> a
 * @param {Maybe} m - A `Maybe`.
 * @returns {*} - The value contained in the `Just`.
 */
function fromJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, fromJust); }
  return isNothing(m) ? error.nothing(m, fromJust) : m.value(); // yuck
}

/**
 * Return the value contained in a `Maybe` if it is a `Just` or a default value if
 * the `Maybe` is `Nothing`.
 * Haskell> fromMaybe :: a -> Maybe a -> a
 * @param {*} d - The default value to return if `m` is `Nothing`.
 * @param {Maybe} m - A `Maybe`.
 * @returns {*} - The value contained in the `Maybe` or `d` if it is `Nothing`.
 */
function fromMaybe(d, m) {
  let p = (d, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, fromMaybe); }
    return isNothing(m) ? d : m.value();
  }
  return partial(p, d, m);
}

/**
 * Return `Nothing` on an empty list or `Just a` where `a` is the first element of the list.
 * Haskell> listToMaybe :: [a] -> Maybe a
 * @param {List} as - A list.
 * @returns {Maybe} - A `Just` containing the head of `as` or `Nothing` if `as` is an empty list.
 * @example
 * let lst = list(1,2,3);
 * listToMaybe(lst);         // => Just 1
 * listToMaybe(emptyList);   // => Nothing
 */
function listToMaybe(as) {
  if (isList(as) === false) { return error.listError(as, listToMaybe); }
  return isEmpty(as) ? Nothing : just(head(as));
}

/**
 * Return an empty list when given `Nothing` or a singleton list when not given `Nothing`.
 * Haskell> maybeToList :: Maybe a -> [a]
 * @param {Maybe} m - A `Maybe`.
 * @returns {List} - A new list.
 * @example
 * let l = list(1,2,3);
 * let m = just(10);
 * maybeToList(m);       // => [10:[]]
 * maybeToList(Nothing); // =>  [[]]
 */
function maybeToList(m) {
  if (isMaybe(m) === false) { return error.typeError(m, maybeToList); }
  return isNothing(m) ? emptyList : list(m.value());
}

/**
 * Take a list of `Maybe` objects and return a list of all the `Just` values.
 * Haskell> catMaybes :: [Maybe a] -> [a]
 * @param {List} as - A List.
 * @returns {List} - A list of the `Just` values from `as`.
 * @example
 * let lst = list(just(1), just(2), just(null), just(3), Nothing, just(undefined), just(4), Nothing, just(5));
 * catMaybes(lst); // => [1:2:3:4:5:[]]
 */
function catMaybes(as) {
  if (isList(as) === false) { return error.listError(as, catMaybes); }
  if (isMaybe(head(as)) === false) { return error.typeError(m, catMaybes); }
  let pred = x => isJust(x);
  let f = x => fromJust(x);
  return map(f, filter(pred, as));
}

/**
 * Map a function `f` that returns a `Maybe` over a list. For each element of the list, if the result of
 * applying the function is a `Just`, then the value it contains is included in the result list. If it is
 * `Nothing`, then no element is added to the result list.
 * Haskell> mapMaybe :: (a -> Maybe b) -> [a] -> [b]
 * @param {Function} f - A function that returns a `Maybe`.
 * @param {List} as - A list to map over.
 * @returns {List} - A list of `Just` values returned from `f` mapped over `as`.
 * @example
 * let lst = list(1,2,3);
 * mapMaybe(just, lst);                          // => [1:2:3:[]]
 * let f = x => even(x) ? just(x * 2) : Nothing;
 * let lst = listRange(1, 25);
 * mapMaybe(f, lst);                             // => [4:8:12:16:20:24:28:32:36:40:44:48:[]]
 */
function mapMaybe(f, as) {
  let p = (f, as) => {
    if (isList(as) === false) { return error.listError(as, mapMaybe); }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    let r = f(x);
    let rs = mapMaybe.bind(this, f, xs);
    if (isNothing(r)) { return rs(); }
    if (isJust(r)) { return cons(fromJust(r))(rs()); }
    return error.returnError(f, mapMaybe);
  }
  return partial(p, f, as);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Tuple

/**
 * A data constructor for a `Tuple`. Unlike Haskell, which provides a separate constructor
 * for every possible number of tuple values, this class will construct tuples of any size.
 * Empty tuples, however, are a special type called `unit`, and single values passed to
 * this constructor will be returned unmodified. In order for them be useful, it is recommended
 * that you create tuples with primitive values.
 * @extends Type
 * @private
 */
class Tuple extends Type {
  /**
   * Create a new `Tuple`.
   * @param {...*} values - The values to construct into a `Tuple`.
   */
  constructor(...as) {
    super();
    if (as.length === 0) { this[0] = null; }
    as.forEach((v, i) => this[i + 1] = v );
  }
  static type(a) { return dataType(a) === this ? a.typeOf() : error.typeError(a, this.type); }
  // Eq
  static isEq(a, b) { return fromTupleToArray(a).every((a, i) => a === fromTupleToArray(b)[i]); }
  // Ord
  static compare(a, b) {
    if (this.isEq(a, b)) { return EQ; }
    let i = 1;
    while (Reflect.has(a, i)) {
      if (a[i] < b[i]) { return LT; }
      if (a[i] > b[i]) { return GT; }
      i += 1;
    }
  }
  // Monoid
  static mempty(a) { return unit; }
  static mappend(a, b) { return Reflect.construct(Tuple, [mappend(fst(a), fst(b)), mappend(snd(a), snd(b))]); }
  // Foldable
  static foldr(f, acc, p) { return f(snd(p), acc); }
  // Traversable
  static traverse(f, p) { return fmap(tuple.bind(this, fst(p)), f(snd(p))); }
  // Functor
  static fmap(f, p) { return Reflect.construct(Tuple, [fst(p), f(snd(p))]); }
  // Applicative
  static pure(p) { return Reflect.construct(Tuple, [mempty(p), snd(p)]); }
  static ap(uf, vx) { return Reflect.construct(Tuple, [mappend(fst(uf), fst(vx)), snd(uf)(snd(vx))]); }
  // Prototype
  toString() { return `[Object Tuple]`; }
  typeOf() { return `(${Reflect.ownKeys(this).map(key => type(this[key])).join(',')})`; }
  valueOf() {
    if (this === unit) { return `()`; }
    return `(${Reflect.ownKeys(this).map(key => type(this[key]) === 'string' ? `'${this[key]}'` : this[key].valueOf()).join(',')})`;
  }
}

/**
 * The `unit` object, an empty tuple. Note that `isTuple(unit) === false`.
 * @const {Tuple}
 */
const unit = new Tuple();

/**
 * Create a new `Tuple` from any number of values. A single value will be returned unaltered,
 * and `unit`, the empty tuple, will be returned if no arguments are passed.
 * @param {...*} as - The values to put into a `Tuple`.
 * @returns {Tuple} - A new `Tuple`.
 * @example
 * tuple(10,20); // => (10,20)
 */
function tuple(...as) {
  let [x, y] = as;
  if (x === undefined) return unit;
  if (y === undefined) return x;
  return new Tuple(...as);
}

/**
 * Extract the first value of a tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {*} - The first value of the tuple.
 * @example
 * let tup = tuple(10,20);
 * fst(tup);                // => 10
 */
function fst(p) { return isTuple(p) ? p[1] : error.tupleError(p, fst); }

/**
 * Extract the second value of a tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {*} - The second value of the tuple.
 * let tup = tuple(10,20);
 * snd(tup);                // => 20
 */
function snd(p) { return isTuple(p) ? p[2] : error.tupleError(p, snd); }

/**
 * Convert an uncurried function to a curried function. For example, a function that expects
 * a tuple as an argument can be curried into a function that binds one value and returns another
 * function that binds the other value. This function can then be called with or without arguments
 * bound, or with arguments partially applied. Currying and uncurrying are transitive.
 * @param {Function} f - The function to curry.
 * @param {*} x - Any value, the first value of the new tuple argument.
 * @param {*} y - Any value, the second value of the new tuple argument.
 * @returns {Function} - The curried function.
 * @example
 * let f = function(p) { return fst(p) - snd(p); };
 * let a = curry(f);       // a === f()()
 * let b = a(100);         // b === f(100)()
 * let c = b(15);          // c === f(100)(15) === 85
 * let p = tuple(100,15);
 * let A = curry(f);       // A(100)(15) === 85
 * let B = uncurry(A);     // B(p) === 85
 * let C = curry(B);       // A(100)(15) === C(100)(15) === 85
 */
function curry(f, x, y) {
  if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
  if (y === undefined) { return curry(f)(x); }
  return curry(f)(x)(y);
}

/**
 * Convert a curried function to a single function that takes a tuple as an argument.
 * Mostly useful for uncurrying functions previously curried with the `curry` function.
 * This will not work if any arguments are bound to the curried function (it would
 * result in a type error in Haskell). Currying and uncurrying are transitive.
 * @param {Function} f - The function to uncurry.
 * @param {Tuple} p - The tuple from which to extract argument values for the function.
 * @returns {Function} - The uncurried function.
 * @example
 * let f = function(p) { return fst(p) - snd(p); };
 * let p = tuple(100,15);
 * let a = curry(f);       // a === f()()
 * let b = uncurry(a);     // b === f()
 * let c = b(p);           // c === f({`1`:100,`2`:15}) === 85
 * let d = uncurry(a, p)   // d === 85
 */
function uncurry(f, p) {
  if (p === undefined) { return p => isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry); }
  return isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
}

/**
 * Swap the values of a tuple. This function does not modify the original tuple.
 * @param {Tuple} p - A `Tuple`.
 * @returns {Tuple} - A new `Tuple`, with the values of the first tuple swapped.
 * @example
 * let tup = tuple(10,20);
 * swap(tup);               // => (20,10)
 */
function swap(p) { return isTuple(p) ? Reflect.construct(Tuple, [snd(p), fst(p)]) : error.tupleError(p, swap); }

/**
 * Determine whether an object is a `Tuple`. The empty tuple, `unit`, returns `false`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `Tuple` and `false` otherwise.
 */
function isTuple(a) { return a instanceof Tuple && a !== unit ? true : false; }

/**
 * Convert an array into a `Tuple`. Returns `unit`, the empty tuple, if no arguments or
 * arguments other than an array are passed. This function will not work on array-like objects.
 * @param {Array<*>} array - The array to convert.
 * @returns {Tuple} - The new `Tuple`.
 * @example
 * let arr = [10,20];
 * fromArrayToTuple(arr); // => (10,20)
 */
function fromArrayToTuple(a) {
  return Array.isArray(a) ? Reflect.construct(Tuple, Array.from(a)) : error.typeError(a, fromArrayToTuple);
}

/**
 * Convert a `Tuple` into an array.
 * @param {Tuple} p - The `Tuple` to convert.
 * @returns {Array<*>} - The new array.
 * @example
 * let tup = tuple(10,20);
 * fromTupleToArray(tup);  // => [10,20]
 */
function fromTupleToArray(p) {
  return isTuple(p) ? Reflect.ownKeys(p).map(key => p[key]) : error.tupleError(p, fromTupleToArray);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// List

/**
 * A data constructor for a `List`. In Haskell, unlike in JavaScript, the default collection type is a
 * linked list, not an array. Obviously, there are benefits and drawbacks to both, and native Arrays
 * in JavaScript have certain performance advantages that a custom linked list implementation may not
 * be able to outperform, even when performing operations for which linked lists, all other things
 * being equal, have an advantage. Lists may only contain values of a single type.
 * @extends Type
 * @private
 */
class List extends Type {
  /**
   * Create a new `List`.
   * @param {*} head - The value to put at the head of the list, which will also determine the list's type.
   * @param {List} tail - The tail of the list, which is also a list (possibly the empty list).
   */
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    this.head = () => head;
    this.tail = () => tail;
  }
  // Eq
  static isEq(as, bs) {
    return typeCheck(head(as), head(bs)) ? fromListToArray(as).every((a, i) =>
    a === fromListToArray(bs)[i]) : error.typeMismatch(head(as), head(bs), this.isEq);
  }
  // Ord
  static compare(as, bs) {
    if (isEmpty(as) && isEmpty(bs)) { return EQ; }
    if (isEmpty(as) && isEmpty(bs) === false) { return LT; }
    if (isEmpty(as) === false && isEmpty(bs)) { return GT; }
    if (compare(head(as), head(bs)) === EQ) { return compare(tail(as), tail(bs)); }
    return compare(head(as), head(bs));
  }
  // Monoid
  static mempty(as) { return emptyList; }
  static mappend(as, bs) { return listAppend(as, bs); }
  // Foldable
  static foldr(f, acc, as) {
    if (isList(as) === false ) { return error.listError(as, foldr); }
    if (isEmpty(as)) { return acc; }
    //if (typeCheck(acc, head(as)) === false) { return error.typeMismatch(acc, head(as), foldr); }
    let x = head(as);
    let xs = tail(as);
    return f(x, foldr(f, acc, xs));
  }
  // Traversable
  static traverse(f, as) { return isEmpty(as) ? pure(as, emptyList) : ap(fmap(cons)(f(head(as))))(traverse(f, tail(as))); }
  // Functor
  static fmap(f, as) { return map(f, as); }
  // Applicative
  static pure(a) { return list(a); }
  static ap(fs, as) { return isEmpty(fs) ? emptyList : listAppend(fmap(head(fs), as))(ap(tail(fs), as)); }
  // Monad
  static bind(xs, f) { return concat(map(f, xs)); }
  // Prototype
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(head(this))}]`; }
  valueOf() { //return head(this) === null ? `[]` : `${head(this)}:${tail(this).valueOf()}`;
    let value = list => isEmpty(list) ? `[]` : `${head(list)}:${value(tail(list))}`;
    return `[${type(this) === `[string]` ? fromListToString(this) : value(this)}]`;
  }
}

/**
 * The empty list, or [] in Haskell (represented as [[]] in this library).
 * @const
 */
const emptyList = new List();

/**
 * Create a new `List` from a series of zero or more values.
 * @param {...*} as - Values to put into a new `List`.
 * @returns {List} - The new `List`.
 * @example
 * list(1,2,3); // => [1:2:3:[]]
 */
function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }

/**
 * Build a finite list from a range of values. Currently, this only works with numbers. The
 * equivalent is achieved in Haskell using list comprehensions.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [f=(x => x + 1)] - The function to apply iteratively to each value.
 * @param {Function} [filter] - An optional filter (returning `boolean`) to test whether to add each value to the list.
 * @returns {List} - The new list.
 * @example
 * let f = x => x + 5;
 * let filt = x => even(x);
 * listRange(0, 100, f);        // => [0:5:10:15:20:25:30:35:40:45:50:55:60:65:70:75:80:85:90:95:[]]
 * listRange(0, 100, f, filt);  // => [0:10:20:30:40:50:60:70:80:90:[]]
 */
function listRange(start, end, f, filter) {
 let p = (start, end) => {
   if (f === undefined) { f = x => x + 1; }
   let lst = emptyList;
   let pred = x => x >= end;
   let go = x => {
     if (filter === undefined) { lst = listAppend(lst)(list(x)); }
     if (filter !== undefined && filter(x)) { lst = listAppend(lst)(list(x)); }
     x = f(x);
     return x;
   }
   until(pred, go, start);
   return lst;
 }
 return partial(p, start, end);
}

/**
 * Build a finite list from a range of enumerated values, and apply a filter to each one. This
 * function is a shortcut for `listRange` that simply applies a filter with the default function
 * x = x + 1.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [filter] - An optional filter (returning `boolean`) to test whether to add each value to the list.
 * @returns {List} - The new list.
 * @example
 * let f = x => x + 5;
 * let filt = x => even(x);
 * listFilter(1, 50, filt)  // => [2:4:6:8:10:12:14:16:18:20:22:24:26:28:30:32:34:36:38:40:42:44:46:48:[]]
 */
function listFilter(start, end, filter) {
 let f = x => x + 1;
 let p = (start, end, filter) => listRange(start, end, f, filter);
 return partial(p, start, end, filter);
}

/**
 * Append one `List` to another.
 * Haskell> (++) :: [a] -> [a] -> [a]
 * @param {List} as - A `List`.
 * @param {List} bs - A `List`.
 * @returns {List} - The new list, the result of the append.
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * listAppend(lst1, lst2); // => [1:2:3:4:5:6:[]]
 */
function listAppend(as, bs) {
  let p = (as, bs) => {
    if (isList(as) === false ) { return error.listError(as, listAppend); }
    if (isList(bs) === false ) { return error.listError(bs, listAppend); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(head(as))(listAppend(tail(as))(bs)); }
    return error.typeMismatch(type(head(as)), type(head(bs)), listAppend);
  }
  return partial(p, as, bs);
}

/**
 * Create a new `List` from a head and tail. As in Haskell, `cons` is based on the classic Lisp function.
 * Haskell> (:) :: a -> [a] -> [a]
 * @param {*} x - Any value, the head of the new list.
 * @param {List} xs - A `List`, the tail of the new list.
 * @returns {List} - The new `List`, constructed from `x` and `xs`.
 * @example
 * let lst = list(4,5,6);
 * cons(3)(lst);          // => [3:4:5:6:[]]
 */
function cons(x, xs) {
  let p = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return Reflect.construct(List, [x, emptyList]); }
    if (xs instanceof List === false) { return error.listError(xs, cons); }
    if (typeCheck(x, head(xs))) { return new List(x, xs); }
    return error.typeError(head(xs), cons);
  }
  return partial(p, x, xs);
}

/**
 * Extract the first element of a `List`.
 * Haskell> head :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The head of the list.
 * @example
 * let lst = list(1,2,3);
 * head(lst);             // => 1
 */
function head(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head(); }
  return error.listError(as, head);
}

/**
 * Extract the last element of a `List`.
 * Haskell> last :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The last element of the list.
 * @example
 * let lst = list(1,2,3);
 * last(lst);             // => 3
 */
function last(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, last); }
    return isEmpty(tail(as)) ? head(as) : last(tail(as));
  }
  return error.listError(as, last);
}

/**
 * Extract the elements after the head of a `List`.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The tail of the list.
 * @example
 * let lst = list(1,2,3);
 * tail(lst);             // => [2:3:[]]
 */
function tail(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, tail) : as.tail(); }
  return error.listError(as, tail);
}

/**
 * Return all the elements of a `List` except the last one.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - A new list, without the original list's last element.
 * @example
 * let lst = list(1,2,3);
 * init(lst);             // => [1:2:[]]
 */
function init(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, init); }
    return isEmpty(tail(as)) ? emptyList : cons(head(as))(init(tail(as)));
  }
  return error.listError(as, init);
}

/**
 * Decompose a `List` into its head and tail. If the list is empty, returns `Nothing`.
 * If the list is non-empty, returns `Just (x, xs)`, where `x` is the head of
 * the list and `xs` its tail.
 * Haskell> uncons :: [a] -> Maybe (a, [a])
 * @param {List} as - The `List` to decompose.
 * @returns {Maybe} - The decomposed `List` wrapped in a `Just`, or `Nothing` if the list is empty.
 * @example
 * let lst = list(1,2,3);
 * uncons(lst);           // => Just (1,[2:3:[]])
 */
function uncons(as) { return isEmpty(as) ? Nothing : just(tuple(head(as), tail(as))); }

/**
 * Test whether a `Foldable` structure (such as a `List`) is empty.
 * Haskell> null :: t a -> Bool
 * @param {Object} t - The `Foldable` structure to test.
 * @returns {boolean} - `true` if the structure is empty, `false` otherwise.
 * @example
 * empty(list(1,2,3)); // => false
 * empty(emptyList);   // => true
 */
function empty(t) { return foldr(x => x === undefined, true, t); }

/**
 * Return the length of a `List`. In the future, this function should work on all
 * `Foldable` structures.
 * Haskell> length :: Foldable t => t a -> Int
 * @param {List} as - A `List`.
 * @returns {number} - The length of the list.
 * @example
 * let lst = list(1,2,3);
 * length(lst);           // => 3
 */
function length(as) {
  let lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(tail(xs), n + 1);
  return isList(as) ? lenAcc(as, 0) : error.listError(as, length);
}

/**
 * Determine whether a given object is a `List`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `List` and `false` otherwise.
 */
function isList(a) { return a instanceof List ? true : false; }

/**
 * Convert an array into a `List`.
 * @param {Array<*>} a - An array to convert into a `List`.
 * @returns {List} - A new `List`, the converted array.
 * @example
 * let arr = [1,2,3];
 * fromArrayToList(arr); // => [1:2:3:[]]
 */
function fromArrayToList(a) { return Array.isArray(a) ? list(...a) : error.typeError(a, fromArrayToList); }

/**
 * Convert a `List` into an array.
 * @param {List} as - A `List` to convert into an array.
 * @returns {Array} - A new array, the converted list.
 * @example
 * let lst = list(1,2,3);
 * fromListToArray(lst);  // => [1,2,3]
 */
function fromListToArray(as) {
  if (isList(as)) { return isEmpty(as) ? [] : [head(as)].concat(fromListToArray(tail(as))); }
  return error.listError(as, fromListToArray);
}

/**
 * Convert a `List` into a string.
 * @param {List} as - A `List` to convert into a string.
 * @returns {string} - A new string, the converted list.
 * @example
 * let str = list('a','b','c');
 * fromListToString(str);       // => "abc"
 */
function fromListToString(as) {
  if (isList(as)) { return fromListToArray(as).join(``); }
  return error.listError(as, fromListToString);
}

/**
 * Convert a string into a `List`.
 * @param {string} str - A string to convert into a `List`.
 * @returns {List} - A new `List`, the converted string.
 * @example
 * let str = `abc`;
 * fromStringToList(str);       // => [abc]
 */
function fromStringToList(str) {
  if (typeof str === 'string') { return fromArrayToList(str.split(``)); }
  return error.typeError(as, fromStringToList);
}

// List transformations

/**
 * Map a function over a `List` and put the results into a new list.
 * Haskell> map :: (a -> b) -> [a] -> [b]
 * @param {Function} f - The function to map.
 * @param {List} as - The `List` to map over.
 * @returns {List} - The list of results.
 * @example
 * let lst = list(1,2,3,4,5);
 * let f = x => x * 3;
 * map(f, lst));              // => [3:6:9:12:15:[]]
 */
function map(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return emptyList; }
    let x = f(head(as)) === undefined ? f.bind(f, head(as)) : f(head(as));
    let xs = tail(as);
    return cons(x)(map(f)(xs));
  }
  return partial(p, f, as);
}

/**
 * Return a new `List` with its elements reversed.
 * Haskell> reverse :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The reversed list.
 * @example
 * let lst = list(1,2,3,4,5);
 * reverse(lst);              // => [5:4:3:2:1:[]]
 */
function reverse(as) {
  let rev = (as, a) => isEmpty(as) ? a : rev(tail(as), cons(head(as))(a));
  return rev(as, emptyList);
}

/**
 * Take a separator and a `List` and intersperse the separator between the elements of the list.
 * Haskell> reverse :: [a] -> [a]
 * @param {*} sep - The seperator value.
 * @param {List} as - The `List` into which to intersperse the `sep` value.
 * @returns {List} - A new `List` in which the elements of `as` are interspersed with `sep`.
 * @example
 * let lst = list(1,2,3,4,5);
 * intersperse(0, lst);        // => [1:0:2:0:3:0:4:0:5:[]]
 * let str = fromStringToList(`abcdefghijklmnopqrstuvwxyz`);
 * intersperse(`|`, str)       // => [a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z]
 */
function intersperse(sep, as) {
  let p = (sep, as) => {
    if (isList(as) === false) { return error.listError(as, intersperse); }
    if (typeCheck(sep, head(as)) === false) { return error.typeMismatch(sep, head(as), intersperse); }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    return cons(x)(prependToAll(sep, xs));
  }
  function prependToAll(sep, xs) { return isEmpty(xs) ? emptyList : cons(sep)(cons(head(xs))(prependToAll(sep, tail(xs)))); }
  return partial(p, sep, as);
}

/**
 * Insert a `List` in between the lists in a `List` of lists. Equivalent to `(concat (intersperse xs xss)).`
 * Haskell> intercalate :: [a] -> [[a]] -> [a
 * @param {List} xs - The `List` to intercalate.
 * @param {List} xss - A `List` of lists.
 * @returns {List} - The intercalated `List`.
 * @example
 * let lst1 = list(1,1,1,1,1);
 * let lst2 = list(2,2,2,2,2);
 * let lst3 = list(3,3,3,3,3);
 * let lst4 = list(4,4,4,4,4);
 * let lst5 = list(5,5,5,5,5);
 * let xss = list(lst1, lst2, lst3, lst4, lst5); // [[1:1:1:1:1:[]]:[2:2:2:2:2:[]]:[3:3:3:3:3:[]]:[4:4:4:4:4:[]]:[5:5:5:5:5:[]]:[]]
 * let xs = list(0,0,0);
 * intercalate(xs, xss); // => [1:1:1:1:1:0:0:0:2:2:2:2:2:0:0:0:3:3:3:3:3:0:0:0:4:4:4:4:4:0:0:0:5:5:5:5:5:[]]
 */
function intercalate(xs, xss) {
  let p = (xs, xss) => concat(intersperse(xs, xss));
  return partial(p, xs, xss);
}

/**
 * Transpose the "rows" and "columns" of a `List` of lists. If some of the rows are shorter than the following rows,
 * their elements are skipped.
 * Haskell> transpose :: [[a]] -> [[a]]
 * @param {List} xss - A `List` of lists.
 * @returns {List} - A new `List` of lists, with the rows and columns transposed.
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * let xss1 = list(lst1, lst2);
 * transpose(xss1);             // => [[1:4:[]]:[2:5:[]]:[3:6:[]]:[]]
 * let xss2 = list(list(10,11), list(20), list(), list(30,31,32));
 * transpose(xss2);             // => [[10:20:30:[]]:[11:31:[]]:[32:[]]:[]]
 */
function transpose(lss) {
  if (isList(lss) === false) { return error.listError(lss, transpose); }
  if (isEmpty(lss)) { return emptyList; }
  let ls = head(lss);
  let xss = tail(lss);
  if (isList(ls) === false) { return error.listError(ls, transpose); }
  if (isEmpty(ls)) { return transpose(xss); }
  let x = head(ls);
  let xs = tail(ls);
  let hComp = map(h => head(h), filter(xs => !isEmpty(xs), xss));
  let tComp = map(t => tail(t), filter(xs => !isEmpty(xs), xss));
  return cons(cons(x)(hComp))(transpose(cons(xs)(tComp)));
}

// Reducing lists

/**
 * Left-associative fold of a structure (i.e. fold from the end to the beginning,
 * rather than from the beginning to the end, as with `foldr`). This function
 * currently only works with `List` objects but should be generalized to work with
 * all `Foldable` types, as in Haskell.
 * Haskell> foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 * @param {Function} f - The function to map over the list.
 * @param {*} z - An accumulator value.
 * @param {List} as - The `List` to fold.
 * @example
 * let lst = list(1,2,3);
 * let f = (x ,y) => x - y;
 * foldl(f, 0, lst);        // => -6
 */
function foldl(f, z, as) {
  let p = (f, z, as) => last(scanl(f, z, as));
  return partial(p, f, z, as);
}

// Special folds

/**
 * Concatenate the elements in a container of lists. Currently, this function only
 * works on `List` objects, though it should in the future work on all `Foldable` types.
 * Haskell> concat :: Foldable t => t [a] -> [a]
 * @param {List} xss - A `List` of lists.
 * @returns {List} - The concatenated `List`.
 * @example
 * let lst1 = list(1,2,3);
 * let lst2 = list(4,5,6);
 * let lst3 = list(7,8,9);
 * let xss = list(lst1, lst2, lst3); // [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 * concat(xss);                      // => [1:2:3:4:5:6:7:8:9:[]]
 */
function concat(xss) {
  if (isList(xss)) {
    if (isEmpty(xss)) { return emptyList; }
    let x = head(xss);
    let xs = tail(xss);
    return isList(x) ? listAppend(x, concat(xs)) : error.listError(x, concat);
  }
  return error.listError(xss, concat);
}

/**
 * Map a function that takes a value and returns a `List` over a `List` of values and
 * concatenate the resulting list. In the future, should work on all `Foldable` types.
 * Haskell> concatMap :: Foldable t => (a -> [b]) -> t a -> [b]
 * @param {Function} f - The function to map.
 * @param {List} as - The `List` to map over.
 * @returns {List} - The `List` of results of mapping `f` over `as`, concatenated.
 * @example
 * let f = x => list(x * 3);
 * let lst = list(1,2,3);    // [1:2:3:[]]
 * map(f, lst);              // => [[3:[]]:[6:[]]:[9:[]]:[]]
 * concatMap(f, lst);        // => [3:6:9:[]]
 */
function concatMap(f, as) {
  let p = (f, as) => concat(map(f, as));
  return partial(p, f, as);
}

// Building lists

/**
 * Scan a `List` from the right to left and return a `List` of successive reduced values.
 * Haskell> scanl :: (b -> a -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q - An accumulator value.
 * @param {List} ls - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * let lst = list(1,2,3)
 * let f = (x, y) => x - y;
 * scanl(f, 0, lst);        // => [0:-1:-3:-6:[]]
 */
function scanl(f, q, ls) {
  let p = (f, q, ls) => {
    if (isList(ls) === false) { return error.listError(ls, scanl); }
    if (isEmpty(ls)) { return cons(q)(emptyList); }
    let x = head(ls);
    let xs = tail(ls);
    return cons(q)(p(f, f(q, x), xs));
  }
  return partial(p, f, q, ls);
}

/**
 * Like `scanl` but scans left to right instead of right to left.
 * Haskell> scanr :: (a -> b -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q0 - An accumulator value.
 * @param {List} as - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * let lst = list(1,2,3);
 * let f = (x ,y) => x - y;
 * scanr(f, 0, lst);        // => [2:-1:3:0:[]]
 */
function scanr(f, q0, as) {
  let p = (f, q0, as) => {
    if (isList(as) === false) { return error.listError(ls, scanr); }
    if (isEmpty(as)) { return list(q0); }
    let x = head(as);
    let xs = tail(as);
    let qs = scanr(f, q0, xs);
    let q = head(qs);
    return cons(f(x, q))(qs);
  }
  return partial(p, f, q0, as);
}

// Sublists

/**
 * Return the prefix of a `List` of a given length.
 * Haskell> take :: Int -> [a] -> [a]
 * @param {number} n - The length of the prefix to take.
 * @param {List} as - The `List` to take from.
 * @returns {List} - A new `List`, the desired prefix of the original list.
 * @example
 * let lst = list(1,2,3);
 * take(2, lst);          // => [1:2:[]]
 */
function take(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, take); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    return cons(x)(take(n - 1)(xs));
  }
  return partial(p, n, as);
}

/**
 * Return the suffix of a `List` after discarding a specified number of values.
 * Haskell> drop :: Int -> [a] -> [a]
 * @param {number} n - The number of values to drop.
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - A new `List`, the desired suffix of the original list.
 * @example
 * let lst = list(1,2,3);
 * drop(2, lst);          // => [3:[]]
 */
function drop(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, drop); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    return drop(n - 1)(xs);
  }
  return partial(p, n, as);
}

/**
 * Return a `Tuple` in which the first element is the prefix of a `List` of a given
 * length and the second element is the remainder of the list.
 * Haskell> splitAt :: Int -> [a] -> ([a], [a])
 * @param {number} n - The length of the prefix.
 * @param {List} as - The `List` to split.
 * @returns {Tuple} - The split list.
 * @example
 * let lst = list(1,2,3);
 * splitAt(2, lst);       // => ([1:2:[]],[3:[]])
 */
function splitAt(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, splitAt); }
    return tuple(take(n, as), drop(n, as));
  }
  return partial(p, n, as);
}

/**
 * Return the longest prefix (possibly empty) of a `List` of values that satisfy a
 * predicate function.
 * Haskell> takeWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} pred - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to take from.
 * @returns {List} - The `List` of values that satisfy the predicate function.
 * @example
 * let lst = list(1,2,3,4,1,2,3,4);
 * let f = x => x < 3;
 * takeWhile(f, lst);               // => [1:2:[]]
 */
function takeWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, takeWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    let test = pred(x);
    if (test === true) { return cons(x)(takeWhile(pred, xs)); }
    if (test === false) { return emptyList; }
    return error.listError(as, takeWhile);
  }
  return partial(p, pred, as);
}

/**
 * Drop values from a `List` while a given predicate function returns `true` for
 * each value.
 * Haskell> dropWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} pred - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - The `List` of values that do not satisfy the predicate function.
 * @example
 * let lst = list(1,2,3,4,5,1,2,3);
 * let f = x => x < 3;
 * dropWhile(f, lst);               // => [3:4:5:1:2:3:[]]
 */
function dropWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, dropWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    let test = pred(x);
    if (test === true) { return dropWhile(pred, xs); }
    if (test === false) { return as; }
    return error.listError(as, dropWhile);
  }
  return partial(p, pred, as);
}

/**
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that satisfy a predicate function and the second element is
 * the rest of the list.
 * Haskell> span :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} pred - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @return {Tuple} - The `Tuple` of results.
 * @example
 * let lst = list(1,2,3,4,1,2,3,4);
 * let f = x => x < 3;
 * span(f, lst);                    // => ([1:2:[]],[3:4:1:2:3:4:[]])
 */
function span(pred, as) {
  let p = (pred, as) => tuple(takeWhile(pred, as), dropWhile(pred, as));
  return partial(p, pred, as);
}

/**
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that do not satisfy a predicate function and the second element
 * is the rest of the list.
 * Haskell> break :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} pred - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @return {Tuple} - The `Tuple` of results.
 * @example
 * let lst = list(1,2,3,4,1,2,3,4);
 * let f = x => x > 3;
 * spanNot(f, lst);                 // => ([1:2:3:[]],[4:1:2:3:4:[]])
 */
function spanNot(pred, as) {
  let p = (pred, as) => span($(not)(pred), as);
  return partial(p, pred, as);
}

// Searching

function filter(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, filter); }
    if (isEmpty(as)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    if (f(x) === true) { return cons(x)(filter(f, xs)); }
    if (f(x) === false) { return filter(f, xs); }
    return error.returnError(f, filter);
  }
  return partial(p, f, as);
}

// Indexing

function index(as, n) {
  let p = (as, n) => {
    if (isList(as) === false ) { return error.listError(as, index); }
    if (n < 0) { return error.rangeError(n, index); }
    if (isEmpty(as)) { return error.rangeError(n, index); }
    let x = head(as);
    let xs = tail(as);
    if (n === 0) { return x; }
    return index(xs)(n - 1);
  }
  return partial(p, as, n);
}

// Zipping and unzipping lists

function zip(as, bs) {
  let p = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, zip); }
    if (isList(bs) === false) { return error.listError(bs, zip); }
    if (isEmpty(as)) { return emptyList; }
    if (isEmpty(bs)) { return emptyList; }
    let x = head(as);
    let xs = tail(as);
    let y = head(bs);
    let ys = tail(bs);
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return partial(p, as, bs);
}

// Ordered lists

/**
 * Sort a list using regular value comparison. Use `sortBy` to supply your own
 * comparison function.
 * Haskell> sort :: Ord a => [a] -> [a]
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list.
 * @example
 * lst = list(9,8,7,6,5,4,3,10,13,11,14,23,24,26,25,2,1);
 * sort(lst) // => [1:2:3:4:5:6:7:8:9:10:11:13:14:23:24:25:26:[]]
 */
function sort(as) { return sortBy(compare, as); }

/**
 * Sort a list using a comparison function of your choice.
 * Haskell> sortBy :: (a -> a -> Ordering) -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list.
 */
function sortBy(cmp, as) {
  let p = (cmp, as) => foldr(insertBy(cmp), emptyList, as);
  return partial(p, cmp, as);
}

/**
 * The `insert` function takes an element and a `List` and inserts the element into the
 * list at the first position where it is less than or equal to the next element.
 * In particular, if the list is sorted before the call, the result will also be sorted.
 * Haskell> insert :: Ord a => a -> [a] -> [a]
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 * @example
 * let lst = list(1,2,3,4,5,6,8,9,10);
 * insert(7, lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
function insert(e, ls) {
  let p = (e, ls) => insertBy(compare, e, ls);
  return partial(p, e, ls);
}

/**
 * Insert an element into a list using a comparison function of your choice.
 * Haskell> insertBy :: (a -> a -> Ordering) -> a -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 */
function insertBy(cmp, e, ls) {
  let p = (cmp, e, ls) => {
    if (isEmpty(ls)) { return list(e); }
    let y = head(ls);
    let ys = tail(ls);
    if (cmp(e, y) === GT) { return cons(y)(insertBy(cmp, e, ys)); }
    return cons(e)(ls);
  }
  return partial(p, cmp, e, ls);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// API

export default {
  throwError: throwError,
  defines: defines,
  dataType: dataType,
  type: type,
  typeCheck: typeCheck,
  partial: partial,
  $: $,
  flip: flip,
  id: id,
  constant: constant,
  until: until,
  and: and,
  or: or,
  not: not,
  even: even,
  odd: odd,
  isEmpty: isEmpty,
  show: show,
  print: print,
  isEq: isEq,
  isNotEq: isNotEq,
  EQ: EQ,
  LT: LT,
  GT: GT,
  compare: compare,
  lessThan: lessThan,
  lessThanOrEqual: lessThanOrEqual,
  greaterThan: greaterThan,
  greaterThanOrEqual: greaterThanOrEqual,
  max: max,
  min: min,
  mempty: mempty,
  mappend: mappend,
  mconcat: mconcat,
  fmap: fmap,
  fmapReplaceBy: fmapReplaceBy,
  pure: pure,
  ap: ap,
  apFlip: apFlip,
  then: then,
  skip: skip,
  liftA: liftA,
  liftA2: liftA2,
  liftA3: liftA3,
  inject: inject,
  bind: bind,
  chain: chain,
  bindFlip: bindFlip,
  join: join,
  liftM: liftM,
  Do: Do,
  fold: fold,
  foldMap: foldMap,
  foldr: foldr,
  traverse: traverse,
  mapM: mapM,
  sequence: sequence,
  Nothing: Nothing,
  just: just,
  maybe: maybe,
  isMaybe: isMaybe,
  isJust: isJust,
  isNothing: isNothing,
  fromJust: fromJust,
  fromMaybe: fromMaybe,
  maybeToList: maybeToList,
  listToMaybe: listToMaybe,
  catMaybes: catMaybes,
  mapMaybe, mapMaybe,
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
  listRange: listRange,
  listFilter: listFilter,
  listAppend: listAppend,
  cons: cons,
  head: head,
  last: last,
  tail: tail,
  init: init,
  uncons: uncons,
  empty: empty,
  length: length,
  isList: isList,
  fromArrayToList: fromArrayToList,
  fromListToArray: fromListToArray,
  fromListToString: fromListToString,
  fromStringToList: fromStringToList,
  map: map,
  reverse: reverse,
  intersperse: intersperse,
  intercalate: intercalate,
  transpose: transpose,
  foldl: foldl,
  concat: concat,
  concatMap: concatMap,
  scanl: scanl,
  scanr: scanr,
  take: take,
  drop: drop,
  splitAt: splitAt,
  takeWhile: takeWhile,
  dropWhile: dropWhile,
  span: span,
  spanNot: spanNot,
  filter: filter,
  index: index,
  zip: zip,
  sort: sort,
  sortBy: sortBy,
  insert: insert,
  insertBy: insertBy
}

function listGenerator(f = (x => x += 1), a = 1) {
  function* as() { yield cons(f(a))(listGenerator(this, f, f(a))); }
  return cons(a)(as);
}

function* listGenerator(f = (x => x += 1), start = 1, end = Infinity) {
  let i = start;
  let lst = emptyList;
  do {
    let newList = listAppend(lst)(list(i));
    lst = newList;
    yield lst.tail;
    i = f(i);
  } while (i < end)
}
