/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/misc.js
 *
 * @file Miscellaneous functions.
 * @license ISC
 */

/** @module base/misc */

/** @function partial
 * Partially apply arguments to a given function. Accepts a function and a variable number of
 * arguments. If all the arguments are applied, call the function and return its value. Otherwise,
 * return a new function bound by whichever values have already been applied. In Haskell, all
 * functions technically bind one argument and return one value. Functions that take multiple
 * arguments are actually "curried" under the hood, therefore such a function actually returns
 * another function with its first argument bound, then another with its second, and so on until all
 * expected arguments have been bound. Likewise, almost every function in this library that accepts
 * multiple arguments is similarly curried, so you can partially apply arguments to almost any
 * function and pass that value around as an argument to another function. Note that `partial`
 * itself cannot be partially applied.
 * @param {Function} f - The function to partially apply.
 * @param {...*) as - The values expected as arguments.
 * @returns {Function|*} - A new function with its arguments partially or fully applied.
 * @example
 * function multiply(x, y) {
 *   // create a closure with the same arguments and "do the math" in this closure
 *   const multiply_ = (x, y) => x * y;
 *   // return a "curried" version of the function that accepts partial application
 *   return partial(multiply_, x, y);
 * }
 * multiply(10, 10); // => 100
 * multiply(10);     // => function () { [native code] } // (with 10 applied to x)
 * multiply(10)(10); // => 100
 */
export const partial = (f, ...as) => {
  if (as.length === 0) { return f.call(); }
  const a = as.shift();
  if (a === undefined) { return f; }
  const p = f.bind(f, a);
  return partial(p, ...as);
}

/** @function $
 * Compose two functions. In Haskell, f.g = \x -> f(g x), or the composition of two functions
 * f and g is the same as applying the result of g to f, or f(g(x)) for a given argument x.
 * This pattern can't exactly be reproduced in JavaScript, since the dot operator denotes
 * namespace membership, and custom operators are not available. However, Haskell also provides
 * the $ operator, which simply binds functions right to left, allowing parentheses to be
 * omitted: f $ g $ h x = f (g (h x)). We still can't do this in JavaScript, but why not borrow
 * the $ for some semantic consistency? Sorry, jQuery. This function takes one function f as an
 * argument and returns a new closure that expects another function g and a single argument x.
 * This function will not work as expected if you pass in two arguments. Note that an argument need
 * not be supplied to the rightmost function g, in which case `$` returns a new function to which
 * you can bind an argument later. The leftmost function f, however, must be a pure function, as
 * its argument is the value returned by the rightmost function (though, for f, you can use a
 * function with all but one of its arguments partially applied).
 * Haskell> (.) :: (b -> c) -> (a -> b) -> a -> c
 * @param {Function} f - The outermost function to compose.
 * @returns {Function|*} - The composed function or its final value if a value is bound to f.
 * @example
 * const addTen = x => x + 10;
 * const multHund = x => x * 100;
 * const addTwenty = x => addTen(10);
 * const h = (x, y) => {
 *   const p = (x, y) => x / y;
 *   return partial(p, x, y);
 * }
 * const divByTen = h(10);
 * $(addTen)(multHund)(10)   // => 1010
 * $(addTen)(multHund, 10)   // => 1010
 * $(multHund)(addTen)(10)   // => 2000
 * $(multHund)(addTen, 10)   // => 2000
 * $(addTen)(addTwenty)()    // => 30
 * $(divByTen)(multHund)(10) // => 0.01
 * }
 */
export const $ = f => (g, x) => x === undefined ? x => f(g(x)) : f(g(x));

/** @function flip
 * Reverse the order in which arguments are applied to a function. Note that `flip` only works on
 * binary functions, which take exactly two arguments, but the function it returns is curried.
 * Haskell> flip :: (a -> b -> c) -> b -> a -> c
 * @param {Function} f - The function to flip.
 * @returns {Function} - The function with its arguments reversed.
 * @example
 * const subtract = (x, y) => x - y;
 * const flipped = flip(subtract);
 * subtract(10, 5);                  // => 5
 * flipped(10, 5);                   // => -5
 */
export const flip = f => (x, y) => y === undefined ? y => f(y, x) : f(y, x);

/** @function id
 * Return an argument value unchanged. This is the identity function.
 * Haskell> id :: a -> a
 * @param {*} a - Any object.
 * @returns {*} a - The same object.
 * @example
 * id(1);           // => 1
 * id(list(1,2,3)); // => [1:2:3:[]]
 */
export const id = a => a;

/** @function constant
 * Return the value of the first argument, throwing away any other arguments.
 * Haskell> const :: a -> b -> a
 * @param {...*} as - Any objects.
 * @returns {*} - The value of the first object.
 * @example
 * constant(2, 3);                                  // => 2
 * const multHund = x => x * 100;
 * const c = (x, y) => $(constant(x))(multHund)(y);
 * c(5, 10);                                        // => 5
 */
export const constant = (...as) => {
  const constant_ = (...as) => as.shift();
  return partial(constant_, ...as);
}

/** @function until
 * Yield the result of applying function `f` to a value `x` until the predicate
 * function `p` is true. A negative, recursive version of a `while` loop.
 * Haskell> until :: (a -> Bool) -> (a -> a) -> a -> a
 * @param {Function} p - A predicate function that returns a boolean.
 * @param {Function} f - The function to apply to `x`.
 * @param {*} x - The value to bind to `f`.
 * @returns {*} - The result of applying `f` to `x` until `p` returns `true`.
 * @example
 * const p = x => x > 10;
 * const f = x => x + 1;
 * const u = until(p, f);
 * u(1);                  // => 11
 */
export const until = (p, f, x) => {
  const until_ = (p, f, x) => p(x) ? x : until(p, f, f(x));
  return partial(until_, p, f, x);
}
