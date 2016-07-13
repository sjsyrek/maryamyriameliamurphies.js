/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/io.js
 *
 * @file I/O functions.
 * @license ISC
 */

/** @module base/io */

import {isTuple} from '../tuple';

/** @function show
 * Get the value of an object as a string. Calls the object's `valueOf` method.
 * @param {*} a - The object to show.
 * @returns {string} - The stringified value of the object.
 * const lst = list(1,2,3);
 * const tup = tuple(1,2);
 * show(lst);               // => [1:2:3:[]]
 * show(tup);               // => (1,2)
 */
export const show = a => isTuple(a) ? `(${Object.values(a).map(e => e.valueOf())})` : a.valueOf();

/** @function print
 * Display the results of `show` on the console. One could imagine a more generalized
 * `printBy` function that redirects the output of `show(a)` elsewhere.
 * @param {*} a - The value to print.
 * @returns {Function} - The `console.log` function applied to the return value of `show(a)`.
 * @example
 * const lst = list(1,2,3);
 * print(lst);              // "[1:2:3:[]]"
 */
/*global console*/
/*eslint no-console: ["error", { allow: ["log"] }] */
export const print = a => console.log(show(a));
