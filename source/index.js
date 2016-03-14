// TODO: reimplement Ordering as a Monoid
// TODO: replace (where possible) class property values with closures
// TODO: replace pseudo-list comprehensions with maps and filters
// TODO: implement error checking for lazy functions that don't do it, because it's hard to track down errors otherwise

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Error handling

/**
 * Whenever the library needs to throw an error, it calls one of the functions defined in this hash table, which calls in
 * turn the {@code throwError} function with the arguments to the error function applied to the given template string.
 * Example: {@code error.typeError(0, and); // *** Error: '0' is not a valid argument to function 'and'.}
 * @const {Object} error - A hash table of error procedures.
 * @private
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
 * Throw an error, outputting the given message. This is one of the only impure functions in this library.
 * @param {string} e - The error message to display.
 * @private
 */
function throwError(e) { throw Error(`*** Error: ${e}`); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Type system

/**
 * The base class for all other types. This class is not meant to be used on its own to instantiate new objects,
 * so it does not provide a constructor function of its own, but it does provide some default functionality for new
 * data types.
 * @class
 * @private
 */
class Type {
  static type(a) { return dataType(a) === this ? this.name : error.typeError(a, this.type); }
  toString() { return this.valueOf(); }
  typeOf() { return dataType(this).name; }
  valueOf() { return this; }
}

/**
 * A utility function for declaring new type classes. Returns a closure that checks whether a given object is a
 * member of a predefined type class. Note that the library only checks for the existence of the required property
 * or properties. Whether or not those properties are functions and whether or not they return the values expected
 * by the type class are not verified.
 * Example: {@code let Eq = defines(`isEq`); // instances of the Eq type class must define an isEq function}
 * @param {...string} methods
 * @return {function()} - A closure that returns true if a given object declares all the given methods, false otherwise.
 * @const
 */
const defines = (...methods) => a => methods.every(m => Reflect.has(dataType(a), m));

/**
 * A utility function for returning the data type of a given object. In JavaScript, this is simply the object's
 * constructor, so this function really just serves as an alias for terminological clarification. Example:
 * {@code dataType(0); // function Number() { [native code] }
 *        let lst = list(1,2,3);
 *        dataType(lst).name // List
 * }
 * @param {*} a - Any object.
 * @return {function()} - The object's constructor function.
 * @const
 */
const dataType = (a) => a.constructor;

/**
 * Return the type of any object as specified by this library or, otherwise, its primitive type. Example:
 * {@code type(0); // number
 *        let t = tuple(1,2);
 *        type(t); // (number,number)
 * }
 * @param {*} a - Any object.
 * @return {string} - The type of the object.
 */
function type(a) { return a instanceof Type ? a.typeOf() : typeof a; }

/**
 * Determine whether two objects are the same type, returning true if they are and false otherwise.
 * This is a limited form of type checking for this library. It is by no means foolproof but should at least
 * prevent most careless errors. Example:
 * {@code typeCheck(0, 1);   // true
 *        typeCheck(0, 'a'); // false
 * }
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean} - True if the two objects are the same type, false otherwise.
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
 * If all the arguments are applied, calls the function and returns its value. Otherwise, returns a
 * function bound by whichever values have already been applied. In Haskell, all functions technically
 * bind one argument and return one value. Functions that take multiple arguments are actually curried
 * under the hood, therefore such a function actually returns another function with its first argument
 * bound, then another with its second, and so on until all expected arguments have been bound. Likewise,
 * almost every function in this library that accepts multiple arguments is similarly curried. Example:
 * {@code function multiply(x, y) {
 *          let p = (x, y) => x * y; // same arguments to original function
 *          return partial(p, x, y); // return the function in "curried" form
 *        }
 *        multiply(10, 10); // 100
 *        multiply(10);     // function () { [native code] } (with 10 applied to x)
 *        multiply(10)(10); // 100
 * }
 * @param {function()} f - Any function.
 * @param {...*) as - Any values expected as arguments.
 * @return {function()} - The function with its arguments partially or fully applied.
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
 * the $ for some semantic consistency? Sorry, jQuery. Note that an argument need not be supplied
 * to the rightmost function, in which case $ returns a new function to which you can bind an
 * argument later. The leftmost function, however, must be a pure function, as its argument is
 * the value returned by the rightmost function. Example:
 * {@code let addTen = x => x + 10;
 *        let multHund = x => x * 100;
 *        let addTwenty = x => addTen(10);
 *        $(addTen)(multHund)(10) // 1010
 *        $(addTen)(multHund, 10) // 1010
 *        $(multHund)(addTen)(10) // 2000
 *        $(multHund)(addTen, 10) // 2000
 *        $(addTen)(addTwenty)()  // 30
 * }
 * Haskell> (.) :: (b -> c) -> (a -> b) -> a -> c
 * @param {function()} f - The outermost function to compose.
 * @return {function()} - The composed function, called only if a value is bound to f.
 */
function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

/**
 * Reverse the order in which arguments are applied to a function. Note that flip only works on functions
 * that take two arguments. Example:
 * {@code function subtract(x, y) { return x - y; }
 *        let flipped = flip(subtract);
 *        subtract(10, 5); // 5
 *        flipped(10, 5);  // -5
 * }
 * Haskell> flip :: (a -> b -> c) -> b -> a -> c
 * @param {function()} f - Any function.
 * @return {function()} - The function with its arguments reversed.
 */
function flip(f) { return (x, y) => y === undefined ? y => f(y, x) : f(y, x); }

/**
 * The identity function.
 * Example: {@code id(1); // 1 }
 * Haskell> id :: a -> a
 * @param {*} a - Any value.
 * @return {*} a - The same value.
 */
function id(a) { return a; }

/**
 * Return the value of the first argument, throwing away the value of the second argument.
 * Example: {@code constant(2, 3); // 2 }
 * Haskell> const :: a -> b -> a
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {*} a - The first value.
 */
function constant(a, b) {
  let p = (a, b) => a;
  return partial(p, a, b);
}

/**
 * Yield the result of applying function f to a value until the predicate function pred is true. Example:
 * {@code let pred = x => x > 10;
 *        let f = x => x + 1;
 *        let u = until(pred, f);
 *        u(1); // 11
 * }
 * Haskell> until :: (a -> Bool) -> (a -> a) -> a -> a
 * @param {function()} pred - A predicate function that returns a boolean.
 * @param {function()} f - The function to apply.
 * @param {*} x - The value to apply to f.
 * @return
 */
function until(pred, f, x) {
  let p = (pred, f, x) => pred(x) ? x : until(pred, f, f(x));
  return partial(p, pred, f, x);
}

/**
 * Boolean and. Return true if both arguments are true, false otherwise.
 * Example: {@code and(true, true) // true }
 * Haskell> (&&) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @return {boolean} - a && b.
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
 * Boolean or. Return true if either argument is true, false otherwise.
 * Example: {@code or(true, false) // true }
 * Haskell> (||) :: Bool -> Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @param {boolean} b - A boolean value.
 * @return {boolean} - a || b.
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
 * Boolean not. Return true if the argument is false, false otherwise.
 * Example: {@code not(false) // true }
 * Haskell> not :: Bool -> Bool
 * @param {boolean} a - A boolean value.
 * @return {boolean} - !a.
 */
function not(a) {
  if (a === true) { return false; }
  if (a === false) { return true; }
  return error.typeError(a, not);
}

/**
 * Check whether a value is an empty collection. Returns true if the value is an empty list, an empty tuple,
 * or an empty array. Throws a type error, otherwise. This function is somewhat superfluous.
 * Example: {@code isEmpty([]); // true }
 * @param {Object} a - Any collection value of type List, Tuple, or Array.
 * @return {boolean} - True if the collection is empty, false otherwise.
 */
function isEmpty(a) {
  if (isList(a)) { return a === emptyList; } // a.head === null
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  if (Array.isArray(a)) { return a.length === 0; }
  return error.typeError(a, isEmpty);
}

/**
 * Display the value of an object as a string. Calls the object's {@code valueOf} function. Useful for custom
 * types that look ugly when displayed as objects. Example:
 * {@code let lst = list(1,2,3);
 *        let tup = tuple(1,2);
 *        lst;       // {"head":1,"tail":{"head":2,"tail":{"head":3,"tail":{"head":null,"tail":null}}}}
 *        show(lst); // [1:2:3:[]]
 *        tup;       // {"1":1,"2":2}
 *        show(tup); // (1,2)
 * }
 * @param {*} a - The object to show.
 * @return {string} - The value of the object as a string, returned from the object's valueOf function.
 */
function show(a) { return a instanceof Tuple ? `(${Object.values(a).map(e => e.valueOf())})` : a.valueOf(); }

/**
 * A utility function for displaying the results of show on the console.
 * @param {*} a - The value to print.
 */
function print(a) { return console.log(show(a)); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Eq

// The Eq type class defines equality and inequality. Instances of Eq must provide an {@code isEq} function.
const Eq = defines(`isEq`);

/**
 * Compare two objects for equality. Both objects must be instances of the Eq type class (i.e. they
 * both define an {@code isEq} static method).
 * Haskell> (==) :: a -> a -> Bool
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a === b
 */
function isEq(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) { return Eq(a) ? dataType(a).isEq(a, b) : a === b; }
    return error.typeMismatch(a, b, isEq);
  }
  return partial(p, a, b);
}

/**
 * Compare two objects for inequality. Both objects must be instances of the Eq type class (i.e. they
 * both define an isEq static method).
 * Haskell> (/=) :: a -> a -> Bool
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a !== b
 */
function isNotEq(a, b) {
  let p = (a, b) => !isEq(a, b);
  return partial(p, a, b);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Ord

// The Ord type class is used for totally ordered datatypes. Instances of Ord must provide a {@code compare}
// function and must also be instances of Eq.
const Ord = defines(`isEq`, `compare`);

/**
 * A data constructor for orderings implemented as a class, because {@code Ordering} in Haskell is a monoid.
 * There is no reason to ever create any other new objects from this class.
 * @param {string} ord - A string representing the type of ordering.
 * @class
 * @private
 */
class Ordering extends Type {
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
 * The equals ordering. Equivalent to ===.
 * @const {Ordering}
 */
const EQ = new Ordering(`EQ`);

/**
 * The less than ordering. Equivalent to <.
 * @const {Ordering}
 */
const LT = new Ordering(`LT`);

/**
 * The greater than ordering. Equivalent to >.
 * @const {Ordering}
 */
const GT = new Ordering(`GT`);

/**
 * Compare two objects and return an ordering. Both values must be instances of the Ord type class (i.e. they
 * both define a {@code compare} static method). Only a single comparison is required to determine the precise
 * ordering of two objects.
 * Haskell> compare :: a -> a -> Ordering
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {Ordering} - The Ordering value (EQ for equality, LT for less than, and GT for greater than).
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
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a < b.
 */
function lessThan(a, b) {
  let p = (a, b) => compare(a, b) === LT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is less than or equal to another.
 * Haskell> (<=) :: a -> a -> Bool
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a <= b.
 */
function lessThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== GT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is greater than another.
 * Haskell> (>) :: a -> a -> Bool
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a > b.
 */
function greaterThan(a, b) {
  let p = (a, b) => compare(a, b) === GT;
  return partial(p, a, b);
}

/**
 * Determine whether one value is greater than or equal to another.
 * Haskell> (>=) :: a -> a -> Bool
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {boolean} - a >= b.
 */
function greaterThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== LT;
  return partial(p, a, b);
}

/**
 * Return the higher in value of two objects.
 * Haskell> max :: a -> a -> a
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {*} - a or b, whichever is greater.
 */
function max(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? b : a;
  return partial(p, a, b);
}

/**
 * Return the lower in value of two objects.
 * Haskell> min :: a -> a -> a
 * @param {*} a - Any value.
 * @param {*} b - Any value.
 * @return {*} - a or b, whichever is lesser.
 */
function min(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? a : b;
  return partial(p, a, b);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Monoid

// A monoid is a type with an associative binary operation that has an identity. In plainer language,
// a monoid is any type that has an "empty" value that, when "appended" to any other value of that
// type, equals that same value. For example, an integer is a monoid, because any integer added to 0,
// the "empty" value, equals that integer. Likewise, a list is a monoid, because any list appended to
// the empty list equals the original list. Monoids must define {@code mempty} and {@code mappend}.
const Monoid = defines(`mempty`, `mappend`);

/**
 * Return the identity (or "empty") value for the monoid.
 * Haskell> mempty :: a
 * @param {Object} a - Any monoid.
 * @return {Object} - Identity of mappend.
 */
function mempty(a) { return Monoid(a) ? dataType(a).mempty(a) : error.typeError(a, mempty); }

/**
 * Perform an associative operation (similar to appending to a list) on two monoids.
 * Example:
 * {@code let l1 = list(1,2,3);           // [1:2:3:[]]
 *        let l2 = list(4,5,6);           // [4:5:6:[]]
 *        let l3 = list(7,8,9);           // [7:8:9:[]]
 *        mappend(mempty(l1), l1);        // [1:2:3:[]]
 *        mappend(l1, (mappend(l2, l3))); // [1:2:3:4:5:6:7:8:9:[]]
 *        mappend(mappend(l1, l2), l3);   // [1:2:3:4:5:6:7:8:9:[]]
 * }
 * Haskell> mappend :: a -> a -> a
 * @param {Object} a - Any monoid.
 * @param {Object} b - Any monoid.
 * @return {Object} - A new monoid of the same type, the result of the associative operation.
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
 * {@code let l1 = list(1,2,3);    // [1:2:3:[]]
 *        let l2 = list(4,5,6);    // [4:5:6:[]]
 *        let l3 = list(7,8,9);    // [7:8:9:[]]
 *        let ls = list(l1,l2,l3); // [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 *        mconcat(ls);             // [1:2:3:4:5:6:7:8:9:[]]
 * }
 * Haskell> mconcat :: [a] -> a
 * @param {Object} - Any monoid.
 * @return {Object} - A new monoid of the same type.
 */
function mconcat(a) { return foldr(mappend, mempty(a), a); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functor

// A functor is a type that can be mapped over. This includes lists and other collections, but functions
// themselves as well as other sorts of values can also be mapped over, so no one metaphor is likely to
// cover all possible cases. Functors must define an {@code fmap} function.
const Functor = defines(`fmap`);

/**
 * Map a function over a functor, which is a type that specifies how functions may be mapped over it. Example:
 * {@code let lst = list(1,2,3);   // [1:2:3:[]]
 *        fmap(id, lst);           // [1:2:3:[]]
 *        let f = x => x * 11;
 *        let g = x => x * 100;
 *        $(fmap(f))(fmap(g))(lst) // [1100:2200:3300:[]]
 *        fmap($(f)(g))(lst)       // [1100:2200:3300:[]]
 * }
 * Haskell> fmap :: (a -> b) -> f a -> f b
 * @param {function()} f - The function to map.
 * @param {Object} - The functor to map over.
 * @return {Object} - A new functor of the same type, the result of the mapping.
 */
function fmap(f, a) {
  let p = (f, a) => Functor(a) ? dataType(a).fmap(f, a) : error.typeError(a, fmap);
  return partial(p, f, a);
}

/**
 * Replace all locations in a functor with the same value. Example:
 * {@code let lst = list(1,2,3); // [1:2:3:[]]
 *        fmapReplaceBy(5, lst)  // [5:5:5:[]]
 * }
 * Haskell> (<$) :: a -> f b -> f a
 * @param {*} a - The value to inject into the functor.
 * @param {Object} b - The functor to map over.
 * @return {Object} - A new functor of the same type, with the values of the original replaced by the new value.
 */
function fmapReplaceBy(a, b) {
  let p = (a, b) => fmap(constant(a), b);
  return partial(p, a, b);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Applicative

// Applicative functors are functors that support function application within their contexts. They must
// define {@code pure} and {@code ap} functions and also be instances of Functor.
const Applicative = defines(`fmap`, `pure`, `ap`);

/**
 * Lift a value into an applicative context. Example:
 * {@code let lst = list(1,2,3); // [1:2:3:[]]
 *        let p = pure(lst, 5);  // [5:[]]
 * }
 * Haskell> pure :: a -> f a
 * @param {Object} f - An applicative functor.
 * @param {*} a - Any value.
 * @return {Object} - An applicative functor with the value injected.
 */
function pure(f, a) {
  let p = (f, a) => Applicative(f) ? dataType(f).pure(a) : error.typeError(f, pure);
  return partial(p, f, a);
}

/**
 * Apply a function within an applicative context to an applicative functor. Example:
 * {@code let lst = list(1,2,3);
 *        let p = pure(lst, id); // lift id function into applicative context
 *        ap(p, lst);            // [1:2:3:[]] proves identity
 *        let f = x => x * 2;
 *        let g = x => x * 3;
 *        let pf = pure(lst, f);
 *        let pg = pure(lst, g);
 *        let p$ = pure(lst, $);
 *        ap(ap(ap(p$)(pf))(pg))(lst); // [6:12:18:[]] not pretty
 *        ap(ap(ap(p$, pf), pg), lst); // [6:12:18:[]] but
 *        ap(pf, ap(pg, lst));         // [6:12:18:[]] proves composition
 *        ap(pf, pure(lst, 10));       // [20:[]]
 *        pure(lst, f(10));            // [20:[]] proves homomorphism
 *        ap(pf, pure(lst, 3));        // [6:[]]
 *        let a = pure(lst, 3);
 *        ap(pf, a);                   // [6:[]] proves interchange (not really possible?)
 * }
 * Haskell> (<*>) :: f (a -> b) -> f a -> f b
 * @param {function()} f - A function lifted into an applicative context.
 * @param {Object} a - An applicative functor.
 * @return {Object} - A new applicative functor of the same type, the result of the application.
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
 * A variant of {@code ap} with the arguments reversed.
 * Haskell> (<**>) :: Applicative f => f a -> f (a -> b) -> f b
 * @param {function()} f - A function lifted into an applicative context.
 * @param {Object} a - The first argument to f.
 * @param {Object} b - The second argument to f.
 */
function apFlip(f, a, b) {
  let p = (f, a, b) => liftA2(flip(f), a, b);
  return partial(p, f, a, b);
}

/**
 * Sequence actions, discarding the value of the first argument. Example:
 * {@code let l1 = list(1,2,3);
 *        let l2 = list(4,5,6);
 *        then(l1, l2); // [4:5:6:4:5:6:4:5:6:[]]
 * }
 * Haskell> (*>) :: f a -> f b -> f b
 * @param {Object} a1 - The action to skip.
 * @param {Object} a2 - The action to perform.
 */
function then(a1, a2) {
  let p = (a1, a2) => liftA2(constant(id), a1, a2);
  return partial(p, a1, a2);
}

/**
 * Sequence actions, discarding the value of the second argument. Example:
 * {@code let l1 = list(1,2,3);
 *        let l2 = list(4,5,6);
 *        skip(l1, l2); // [1:1:1:2:2:2:3:3:3:[]]
 * }
 * Haskell> (<*) :: f a -> f b -> f a
 * @param {Object} a1 - The action to perform.
 * @param {Object} a2 - The action to skip.
 */
function skip(a1, a2) {
  let p = (a1, a2) => liftA2(constant, a1, a2);
  return partial(p, a1, a2);
}

/**
 * Lift a function to actions.
 * Haskell> liftA :: Applicative f => (a -> b) -> f a -> f b
 * @param {function()} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the context to lift the function into.
 */
function liftA(f, a) {
  let p = (f, a) => ap(dataType(a).pure(f))(a);
  return partial(p, f, a);
}

/**
 * Lift a binary function to actions.
 * Haskell> liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
 * @param {function()} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 */
function liftA2(f, a, b) {
  let p = (f, a, b) => ap(fmap(f, a))(b);
  return partial(p, f, a, b);
}

/**
 * Lift a ternary function to actions.
 * Haskell> liftA3 :: Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
 * @param {function()} f - The function to lift into an applicative context.
 * @param {Object} a - An applicative functor, the first argument to f.
 * @param {Object} b - An applicative functor, the second argument to f.
 * @param {Object} c - An applicative functor, the third argument to f.
 */
function liftA3(f, a, b, c) {
  let p = (f, a, b, c) => ap(ap(fmap(f, a))(b))(c);
  return partial(p, f, a, b, c);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Monad

// A monad is an abstract datatype of actions. Instances of Monad must define a {@code bind} function
// as well as all the required functions for Functor and Applicative.
const Monad = defines(`fmap`, `pure`, `ap`, `bind`);

/**
 * Inject a value into the monadic type.
 * Haskell> return :: a -> m a
 * @param {Object} m - A monad.
 * @param {*} a - The value to inject.
 * @return {Object} - A new monad of the same type with the value injected.
 */
function inject(m, a) {
  let p = (m, a) => Monad(m) ? dataType(m).pure(a) : error.typeError(m, inject);
  return partial(p, m, a);
}

/**
 * Sequentially compose two actions, passing any value produced by the first as an argument to the second.
 * Haskell> (>>=) :: m a -> (a -> m b) -> m b
 * @param {Object} m - A monad.
 * @param {function()} f - A function to bind to the injected value of the monad. This function must return a monad.
 * @return {Object} - A new monad of the same type, the result of binding the function to the original injected value.
 */
function bind(m, f) {
  let p = (m, f) => Monad(m) ? dataType(m).bind(m, f) : error.typeError(m, bind);
  return partial(p, m, f);
}

/**
 * Sequentially compose two actions, discarding any value produced by the first, like sequencing operators
 * (such as the semicolon) in imperative languages.
 * @param {Object} m - A monad.
 * @param {function()} f - A function to call that ignores the injected value of the monad.
 * @return {Object} - A new monad of the same type, the result of calling the function.
 * Haskell> (>>) :: m a -> m b -> m b
 */
function chain(m, f) {
  let p = (m, f) => Monad(m) ? then(m, f) : error.typeError(m, chain);
  return partial(p, m, f);
}

/**
 * Same as {@code bind} but with the arguments interchanged.
 * Haskell> (=<<) :: Monad m => (a -> m b) -> m a -> m b
 * @param {function()} f - A function to bind to the injected value of the monad.
 * @param {Object} m - A monad.
 * @return {Object} - A new monad of the same type, the result of binding the function to the original injected value.
 */
function bindFlip(f, m) {
  let p = (f, m) => bind(m, f);
  return partial(p, f, m);
}

/**
 * Remove one level of monadic structure, projecting its bound argument into the outer level. Example:
 * {@code let m = just(10); // Just 10
 *        let n = just(m);  // Just Just 10
 *        join(n);          // Just 10
 *        join(m);          // 10 (is this a bug?)
 * }
 * Haskell> join :: Monad m => m (m a) -> m a
 * @param {Object} m - A monad (wrapping another monad).
 * @return {Object} - The wrapped monad on its own.
 */
function join(m) { return Monad(m) ? bind(m, id) : error.typeError(m, join); }

/**
 * Promote a function to a monad.
 * Haskell> liftM :: Monad m => (a1 -> r) -> m a1 -> m r
 * @param {function()} f - The function to lift into a monad.
 * @param {Object} m - The monad to lift the function into.
 * @return {Object} - A new monad containing the result of mapping the function over the monad.
 */
function liftM(f, m) {
  let p = (f, m) => Monad(m) ? dataType(m).fmap(f, m) : error.typeError(m, liftM);
  return partial(p, f, m)
}

/**
 * Since there is no way to exactly replicate Haskell's 'do' notation for monadic chaining, but it
 * would be useful to have a similar affordance, this class provides such a mechanism. See {@code Do}
 * below for an example of how it works.
 * @param {Object} m - A monad.
 * @class
 * @private
 */
class DoBlock {
  constructor(m) { this.m = () => m; }
  inject(a) { return Do(dataType(this.m()).pure(a)); }
  bind(f) { return Do(bind(this.m(), f)); }
  chain(f) { return Do(chain(this.m(), f)); }
  valueOf() { return `${dataType(this.m()).name} >>= ${this.m().valueOf()}`; }
}

/**
 * Wrap a monad in a special container for the purpose of chaining actions, in imitation of the
 * syntactic sugar provided by Haskell's 'do' notation. Example:
 * {@code let m = just(10);
 *        let f = x => just(x * 2);
 *        let g = x => just(x - 1);
 *        Do(m).bind(f).bind(g);              // Maybe >>= Just 19
 *        Do(m).bind(f).chain(m).bind(g);     // Maybe >>= Just 9
 *        let lst = list(1,2,3);
 *        let m = x => list(x + 1);
 *        let n = x => list(x * 2);
 *        Do(lst).bind(m).bind(n);            // List >>= [4:6:8:[]]
 *        Do(lst).bind(m).chain(lst).bind(n); // List >>= [2:4:6:2:4:6:2:4:6:[]]
 *        let put = x => {
 *          print(x);
 *          return just(x);
 *        }
 *        Do(m)
 *        .bind(put)  // 10
 *        .bind(f)
 *        .bind(put)  // 20
 *        .chain(m)
 *        .bind(put)  // 10
 *        .bind(g)
 *        .bind(put)  // 9
 *        .bind(f)
 *        .bind(put); // 18
 * }
 * @param {Object} m - A monad.
 * @return {DoBlock} - A monadic context in which to chain actions.
 */
function Do(m) { return Monad(m) ? new DoBlock(m) : error.typeError(Do, m); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Foldable

// A foldable is a data structure that can be folded to a summary value. Lists are a common form of foldable.
// Instances of Foldable must define a {@code foldr} function.
const Foldable = defines(`foldr`);

/**
 * Combine the elements of a structure using a monoid. For example, fold a list of lists into a list:
 * {@code let lst = list(1,2,3);  // [1:2:3:[]]
 *        let llst = list(lst);   // [[1:2:3:[]]:[]]
 *        fold(llst);             // [1:2:3:[]]
 * }
 * Haskell> fold :: Monoid m => t m -> m
 * @param {*} a - The monoid to fold.
 * @return {*} - The folded monoid.
 */
function fold(a) { return foldMap(id, a); }

/**
 * Map each element of the structure to a monoid, and combine the results. Example:
 * {@code let lst = list(1,2,3);
 *        let f = x => list(x * 3);
 *        foldMap(f, lst); // [3:6:9:[]]
 * }
 * Haskell> foldMap :: Monoid m => (a -> m) -> t a -> m
 * @param {function()} f - The function to map.
 * @param {*} a - The monoid to map over.
 * @return {*} - A new monoid of the same type, the result of the mapping.
 */
function foldMap(f, a) {
  let p = (f, a) => Monoid(a) ? $(mconcat)(fmap(f))(a) : error.typeError(a, foldMap);
  return partial(p, f, a);
}

/**
 * Right-associative fold of a structure. This is the work horse function of Foldable. Example:
 * {@code let lst = list(1,2,3);
 *        let f = (x, y) => x + y;
 *        foldr(f, 0, lst); // 6
 * }
 * Haskell> foldr :: (a -> b -> b) -> b -> t a -> b
 * @param {function()} f - A binary function.
 * @param {*} z - A base accumulator value.
 * @param {*} t - A foldable value.
 * @return {*} - The result of applying the function to the foldable and the accumulator.
 */
function foldr(f, z, t) {
  let p = (f, z, t) => { return Foldable(t) ? dataType(t).foldr(f, z, t) : error.typeError(t, foldr); }
  return partial(p, f, z, t);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Traversable

// Traversables are functors representing data structures that can be traversed from left to right. They
// must define a {@code traverse} function and also be instances of Functor and Foldable.
const Traversable = defines(`fmap`, `foldr`, `traverse`);


function traverse(f, a) {
  let p = (f, a) => { return Traversable(a) ? dataType(a).traverse(f, a) : error.typeError(a, traverse); }
  return partial(p, f, a);
}

// I think these are wrong, because the functions should take traversable types that contain monads, not just monads?:

function mapM(f, m) {
  let p = (f, m) => Monad(m) ? traverse(f, dataType(m).bind(f)) : error.typeError(m, mapM);
  return partial(p, f, m);
}

function mapM_(f, m) {
  let p = (f, m) => Monad(m) ? foldr(chain(m, f), inject(m, unit), m) : error.typeError(m, mapM_);
  return partial(p, f, m);
}

function sequence(m) { return Monad(m) ? traverse(id, a) : error.typeError(a, sequence); }

function sequence_(m) { return Monad(m) ? foldr(chain(m, f), inject(m, unit), m) : error.typeError(m, sequence_); }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Maybe

class Maybe extends Type {
  constructor(a) {
    super();
    if (a !== undefined) { this.value = a; }
  }
  // Eq
  static isEq(a, b) {
    if (isNothing(a) && isNothing(b)) { return true; }
    if (isNothing(a) || isNothing(b)) { return false; }
    return isEq(a.value, b.value);
  }
  // Ord
  static compare(a, b) {
    if (isEq(a, b)) { return EQ; }
    if (isNothing(a)) { return LT; }
    if (isNothing(b)) { return GT; }
    return compare(a.value, b.value);
  }
  // Monoid
  static mempty(a) { return Nothing; }
  static mappend(m1, m2) {
    if (isNothing(m1)) { return m2; }
    if (isNothing(m2)) { return m1; }
    return Reflect.construct(Maybe, [mappend(m1.value, m2.value)]);
  }
  // Foldable
  static foldr(f, z, m) { return isNothing(m) ? z : f(m.value, z); }
  // Traversable
  static traverse(f, m) { return isNothing(m) ? pure(this, Nothing) : fmap(maybe, f(x)); }
  // Functor
  static fmap(f, m) { return isNothing(m) ? Nothing : Reflect.construct(Maybe, [f(m.value)]); }
  // Applicative
  static pure(m) { return just(m); }
  static ap(f, m) { return isNothing(f) ? Nothing : fmap(f.value, m); }
  // Monad
  static bind(m, f) { return isNothing(m) ? Nothing : f(m.value); }
  // Prototype
  toString() { return this.toString(); }
  typeOf() { return `Maybe ${this.value === undefined ? 'Nothing' : type(this.value)}`; }
  valueOf() { return this.value === undefined ? `Nothing` : `Just ${this.value}`; }
}

const Nothing = new Maybe();

function just(a) { return new Maybe(a); }

function maybe(n, f, m) {
  let p = (n, f, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, maybe); }
    isNothing(m) ? n : f(x.value);
  }
  return partial(p, n, f, m);
}

function isMaybe(a) { return dataType(m) === Maybe; }

function isJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isJust); }
  return isNothing(m) ? false : true;
}

function isNothing(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isNothing); }
  return m === Nothing ? true : false;
}

function fromJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, fromJust); }
  return isNothing(m) ? error.nothing(m, fromJust) : m.value; // yuck
}

function fromMaybe(d, m) {
  let p = (d, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, fromMaybe); }
    return isNothing(m) ? d : m.value;
  }
  return partial(p, d, m);
}

function maybeToList(m) {
  if (isMaybe(m) === false) { return error.typeError(m, maybeToList); }
  return isNothing(m) ? emptyList : list(m.value);
}

function listToMaybe(as) {
  if (isList(as) === false) { return error.listError(as, listToMaybe); }
  return isEmpty(as) ? Nothing : just(as.head);
}

function catMaybes(as) {
  if (isList(as) === false) { return error.listError(as, catMaybes); }
  if (isMaybe(as.head) === false) { return error.typeError(m, catMaybes); }
  let pred = as => isJust(x);
  return filter(pred, as);
}

function mapMaybe(f, as) {
  let p = (f, as) => {
    if (isList(as) === false) { return error.listError(as, mapMaybe); }
    if (isEmpty(as)) { return emptyList; }
    if (isMaybe(as.head) === false) { return error.typeError(m, mapMaybe); }
    let x = as.head;
    let xs = as.tail;
    let r = f(x);
    let rs = mapMaybe.bind(this, f, xs);
    if (isNothing(r)) { return rs(); }
    if (isJust(r)) { return cons(r)(rs); }
    return error.returnError(f, mapMaybe);
  }
  return partial(p, f, as);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Tuple

/**
 * A data constructor for a tuple. Unlike Haskell, which provides a separate constructor
 * for every possible number of tuple values, this class will construct tuples of any size.
 * Empty Tuples, however, are a special type called {@code unit}, and single values passed to
 * this constructor will be returned unmodified. In order for them be useful, it is recommended
 * that you create Tuples with primitive values.
 * @class
 * @param {*} values - The values to put into the tuple.
 */
class Tuple extends Type {
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
  return Array.isArray(a) ? Reflect.construct(Tuple, Array.from(a)) : error.typeError(a, fromArrayToTuple);
}

/**
 * Convert a tuple into an array.
 * @param {Tuple} p - The tuple to convert.
 * @return {Array<*>} - The new array.
 */
function fromTupleToArray(p) {
  return isTuple(p) ? Reflect.ownKeys(p).map(key => p[key]) : error.tupleError(p, fromTupleToArray);
}

/**
 * Extract the first value of a tuple.
 * @param {Tuple} p - A tuple.
 * @return {*} - The first value of the tuple.
 */
function fst(p) { return isTuple(p) ? p[1] : error.tupleError(p, fst); }

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
function snd(p) { return isTuple(p) ? p[2] : error.tupleError(p, snd); }

/**
 * Swap the values of a tuple. This function does not modify the original tuple.
 * @param {Tuple} p - A tuple.
 * @return {Tuple} - A new tuple, with the values of the first tuple swapped.
 */
function swap(p) { return isTuple(p) ? Reflect.construct(Tuple, [snd(p), fst(p)]) : error.tupleError(p, swap); }

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
  if (p === undefined) { return p => isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry); }
  return isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// List

// Basic functions

// need to type check lists in static functions

class List extends Type {
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    if (head !== undefined) { this.head = head; }
    if (tail !== undefined) { this.tail = tail; }
  }
  // Eq
  static isEq(a, b) {
    return typeCheck(a.head, b.head) ? fromListToArray(a).every((a, i) =>
    a === fromListToArray(b)[i]) : error.typeMismatch(a.head, b.head, this.isEq);
  }
  // Ord
  static compare(a, b) {
    if (isEmpty(a) && isEmpty(b)) { return EQ; }
    if (isEmpty(a) && isEmpty(b) === false) { return LT; }
    if (isEmpty(a) === false && isEmpty(b)) { return GT; }
    if (compare(a.head, b.head) === EQ) { return compare(a.tail, b.tail)}
    return compare(a.head, b.head);
  }
  // Monoid
  static mempty(a) { return emptyList; }
  static mappend(a, b) { return listAppend(a, b); }
  // Foldable
  static foldr(f, acc, as) {
    if (isList(as) === false ) { return error.listError(as, foldr); }
    if (isEmpty(as)) { return acc; }
    //if (typeCheck(acc, as.head) === false) { return error.typeMismatch(acc, as.head, foldr); }
    let x = as.head;
    let xs = as.tail;
    return f(x, foldr(f, acc, xs));
  }
  // Traversable
  static traverse(f, as) { return isEmpty(as) ? pure(as, emptyList) : ap(fmap(cons)(f(as.head)))(traverse(f, as.tail)); }
  // Functor
  static fmap(f, as) { return map(f, as); }
  // Applicative
  static pure(a) { return list(a); }
  static ap(fs, as) { return isEmpty(fs) ? emptyList : listAppend(fmap(fs.head, as))(ap(fs.tail, as)); }
  // Monad
  static bind(xs, f) { return concat(map(f, xs)); }
  // Prototype
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(this.head)}]`; }
  valueOf() { //return this.head === null ? `[]` : `${this.head}:${this.tail.valueOf()}`;
    let value = list => isEmpty(list) ? `[]` : `${list.head}:${value(list.tail)}`;
    return `[${type(this) === `[string]` ? fromListToString(this) : value(this)}]`;
  }
}

const emptyList = new List();

function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }

function concat(xss) {
  if (isList(xss)) {
    if (isEmpty(xss)) { return emptyList; }
    let x = xss.head;
    let xs = xss.tail;
    return isList(x) ? listAppend(x, concat(xs)) : error.listError(x, concat);
  }
  return error.listError(xss, concat);
}

function cons(x, xs) {
  let p = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return Reflect.construct(List, [x, emptyList]); }
    if (xs instanceof List === false) { return error.listError(xs, cons); }
    if (typeCheck(x, head(xs))) { return new List(x, xs); }
    return error.typeError(head(xs), cons);
  }
  return partial(p, x, xs);
}

function fromArrayToList(a) { return Array.isArray(a) ? list(...a) : error.typeError(a, fromArrayToList); }

function fromListToArray(as) {
  if (isList(as)) { return isEmpty(as) ? [] : [as.head].concat(fromListToArray(as.tail)); }
  return error.listError(as, fromListToArray);
}

function fromListToString(as) {
  if (isList(as)) { return fromListToArray(as).join(``); }
  return error.listError(as, fromListToString);
}

function fromStringToList(str) {
  if (typeof str === 'string') { return fromArrayToList(str.split(``)); }
  return error.typeError(as, fromStringToList);
}

function head(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head; }
  return error.listError(as, head);
}

function init(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, init); }
    return isEmpty(as.tail) ? emptyList : cons(as.head)(init(as.tail));
  }
  return error.listError(as, init);
}

function isList(a) { return a instanceof List ? true : false; }

function last(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, last); }
    return isEmpty(as.tail) ? as.head : last(as.tail);
  }
  return error.listError(as, last);
}

function length(as) {
  let lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(xs.tail, n + 1);
  return isList(as) ? lenAcc(as, 0) : error.listError(as, length);
}

function listAppend(as, bs) {
  let p = (as, bs) => {
    if (isList(as) === false ) { return error.listError(as, listAppend); }
    if (isList(bs) === false ) { return error.listError(bs, listAppend); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(as.head)(listAppend(as.tail)(bs)); }
    return error.typeMismatch(type(head(as)), type(head(bs)), listAppend);
  }
  return partial(p, as, bs);
}

function tail(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, tail) : as.tail; }
  return error.listError(as, tail);
}

function reverse(as) {
  let rev = (as, a) => isEmpty(as) ? a : rev(as.tail, cons(as.head)(a));
  return rev(as, emptyList);
}

function splitAt(n, as) {
  let p = (n, as) => tuple(take(n, as), drop(n, as));
  return partial(p, n, as);
}

function takeWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, takeWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let test = pred(x);
    if (test === true) { return cons(x)(takeWhile(pred, xs)); }
    if (test === false) { return emptyList; }
    return error.listError(as, takeWhile);
  }
  return partial(p, pred, as);
}

function dropWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, dropWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let test = pred(x);
    if (test === true) { return dropWhile(pred, xs); }
    if (test === false) { return as; }
    return error.listError(as, dropWhile);
  }
  return partial(p, pred, as);
}

function span(pred, as) {
  let p = (pred, as) => tuple(takeWhile(pred, as), dropWhile(pred, as));
  return partial(p, pred, as);
}

function spanNot(pred, as) {
  let p = (pred, as) => span($(not)(pred), as);
  return partial(p, pred, as);
}

//uncons

// List transformations

function map(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return emptyList; }
    let x = f(as.head) === undefined ? f.bind(f, as.head) : f(as.head);
    let xs = as.tail;
    return cons(x)(map(f)(xs));
  }
  return partial(p, f, as);
}

// use this in places where I'm mimicking list comprehensions
function filter(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, filter); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    if (f(x) === true) { return cons(x)(filter(f, xs)); }
    if (f(x) === false) { return filter(f, xs); }
    return error.returnError(f, filter);
  }
  return partial(p, f, as);
}

function intersperse(sep, as) {
  let p = (sep, as) => {
    if (isList(as) === false) { return error.listError(as, intersperse); }
    if (typeCheck(sep, as.head) === false) { return error.typeMismatch(sep, as.head, intersperse); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(x)(prependToAll(sep, xs));
  }
  function prependToAll(sep, xs) { return isEmpty(xs) ? emptyList : cons(sep)(cons(xs.head)(prependToAll(sep, xs.tail))); }
  return partial(p, sep, as);
}

function intercalate(xs, xss) { return concat(intersperse(xs, xss)); }

function transpose(xss) {
  if (isList(xss) === false) { return error.listError(xss, transpose); }
  if (isEmpty(xss)) { return emptyList; }
  let head = xss.head;
  let tail = xss.tail;
  if (isList(head) === false) { return error.listError(head, transpose); }
  if (isEmpty(head)) { return transpose(tail); }
  let x = head.head;
  let xs = head.tail;
  let headComp = fromArrayToList(fromListToArray(tail).map(xs => xs.head));
  let tailComp = fromArrayToList(fromListToArray(tail).map(xs => xs.tail));
  return cons(cons(x)(headComp))(transpose(cons(xs)(tailComp)));
}

// Sublists

function drop(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, drop); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return drop(n - 1)(xs);
  }
  return partial(p, n, as);
}

function take(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, take); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(x)(take(n - 1)(xs));
  }
  return partial(p, n, as);
}

// Indexing functions

function index(as, n) {
  let p = (as, n) => {
    if (isList(as) === false ) { return error.listError(as, index); }
    if (n < 0) { return error.rangeError(n, index); }
    if (isEmpty(as)) { return error.rangeError(n, index); }
    let x = as.head;
    let xs = as.tail;
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
    let x = as.head;
    let xs = as.tail;
    let y = bs.head;
    let ys = bs.tail;
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return partial(p, as, bs);
}

// Ordered lists



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
  mapM_: mapM_,
  sequence: sequence,
  sequence_, sequence_,
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
  concat: concat,
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
  reverse: reverse,
  splitAt: splitAt,
  takeWhile: takeWhile,
  dropWhile: dropWhile,
  span: span,
  spanNot: spanNot,
  map: map,
  filter: filter,
  intersperse: intersperse,
  intercalate: intercalate,
  transpose: transpose,
  drop: drop,
  take: take,
  index: index,
  zip: zip
}
