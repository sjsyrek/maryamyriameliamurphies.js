/**
 * maryamyriameliamurphies.js
 *
 * @name index.js
 * @author Steven J. Syrek
 * @file Error handling, type system, and basic functions.
 * @license ISC
 */

 /** @module maryamyriameliamurphies.js/source/base */

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
export function throwError(e) { throw Error(`*** Error: ${e}`); }

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
 * @example
 * // requires that instances of the `Eq` type class define an `isEq` function
 * const Eq = defines(`isEq`);
 * // requires that instances of `Traversable` define `traverse` and also be instances of `Functor` and `Foldable`
 * const Traversable = defines(`fmap`, `foldr`, `traverse`);
 */
export function defines = (...methods) => a => methods.every(m => Reflect.has(dataType(a), m));

/**
 * A utility function for returning the data type of a given object. In JavaScript, this is simply the object's
 * constructor, so this function really just serves as an alias for terminological clarification.
 * @param {*} a - Any object.
 * @returns {Function} - The object's constructor function.
 * @example
 * dataType(0);               // function Number() { [native code] }
 * let lst = list(1,2,3);
 * dataType(lst)              // => function List(head, tail) { ... }
 * lst.typeOf();              // => List // more useful if you don't need a function pointer
 */
export function dataType = (a) => a.constructor;

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
export function typeCheck(a, b) {
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
export function partial(f, ...as) {
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
export function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

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
export function flip(f) { return (x, y) => y === undefined ? y => f(y, x) : f(y, x); }

/**
 * The identity function. Returns the value of the argument unchanged.
 * Haskell> id :: a -> a
 * @param {*} a - Any object.
 * @returns {*} a - The same object.
 * @example
 * id(1);           // => 1
 * id(list(1,2,3)); // => [1:2:3:[]]
 */
export function id(a) { return a; }

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
export function constant(a, b) {
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
export function until(pred, f, x) {
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
export function and(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, and); }
    if (type(b) !== `boolean`) { return error.typeError(b, and); }
    if (a) { return b; }
    return false;
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
export function or(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, or); }
    if (type(b) !== `boolean`) { return error.typeError(b, or); }
    if (a)  { return true; }
    return b;
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
export function not(a) {
  if (type(a) !== `boolean`) { return error.typeError(a, not); }
  if (a) { return false; }
  return true;
}

/**
 * Return `true` if a value is even, `false` otherwise.
 * Haskell> even :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if even, `false` otherwise.
 */
export function even(a) { return a % 2 === 0; }

/**
 * Return `true` if a value is odd, `false` otherwise.
 * Haskell> odd :: (Integral a) => a -> Bool
 * @param {*} a - Any value.
 * @returns {boolean} - `true` if odd, `false` otherwise.
 */
export function odd(a) { return $(not)(even)(a); }

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
export function isEmpty(a) {
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
 * show(lst);             // => [1:2:3:[]]
 * show(tup);             // => (1,2)
 */
export function show(a) { return a instanceof Tuple ? `(${Object.values(a).map(e => e.valueOf())})` : a.valueOf(); }

/**
 * A utility function for displaying the results of show on the console. One could imagine a more generalized
 * `printBy` function that redirects the output of `show(a)` elsewhere.
 * @param {*} a - The value to print.
 * @returns {Function} - The `console.log` function applied to the return value of `show(a)`.
 * @example
 * let lst = list(1,2,3);
 * print(lst);            // "[1:2:3:[]]"
 */
export function print(a) { return console.log(show(a)); }
