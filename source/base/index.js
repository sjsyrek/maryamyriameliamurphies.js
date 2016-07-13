/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/index.js
 *
 * @file Top level index for basic functions.
 * @license ISC
 */

/** @module base */

export {
  partial,
  $,
  flip,
  id,
  constant,
  until
} from './misc';

export {
  and,
  or,
  not
} from './bool';

export {
  even,
  odd
} from './num';

export {
  show,
  print
} from './io';
