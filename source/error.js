/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * error.js
 *
 * @file Error handling functions.
 * @license ISC
 */

/** @module error */

/** @const {Object} error
 * When a function from this library throws an error, it calls one of the methods defined on this
 * object, which constructs and then passes an error message to the `throwError` function with the
 * arguments to the original method call applied to the appropriate error template string.
 * @example
 * error.typeError(0, and); // => *** Error: '0' is not a valid argument to function 'and'.
 */
export const error = {
  emptyList: (a, f) =>
    throwError(`'${a}' is an empty list, but '${f.name}' expects a non-empty list.`),
  listError: (a, f) =>
    throwError(`'${a}' is type '${a.constructor.name}' but function '${f.name}' expects a list.`),
  nothing: (a, f) =>
    throwError(`'${f}' returned Nothing from argument '${a}'.`),
  rangeError: (n, f) =>
    throwError(`Index '${n}' is out of range in function '${f.name}'.`),
  returnError: (f1, f2) =>
    throwError(`Unexpected return value from function '${f1.name}' called from '${f2.name}'.`),
  tupleError: (p, f) =>
    throwError(`'${p}' is type '${p.constructor.name}' but function '${f.name}' expects a tuple.`),
  typeError: (a, f) =>
    throwError(`'${type(a) === 'function' ? `${type(a)} ${a.name}` : a}' \
    is not a valid argument to function '${f.name}'.`),
  typeMismatch: (a, b, f) =>
    throwError(`Arguments '${a}' and '${b}' to function '${f.name}' are not the same type.`)
};

/** @function throwError
 * Throw an error, outputting the given message. This is one of the only impure functions in this
 * library and reflects the (some would say unfortunate) inclusion of numerous partial functions in
 * the Haskell Prelude. Whereas a total function will always return a predictable output for a given
 * input, a partial function fails to take into account all possible inputs. One way to address this
 * situation would be to wrap potentially undefined values (such as the head of an empty list) in a
 * Maybe or Either abstraction in order to account for error states.
 * @param {string} e - The error message to display.
 */
export function throwError(e) { throw Error(`*** Error: ${e}`); }
