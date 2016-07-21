/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * base/index.js
 *
 * Top level index for basic functions.
 */

// Miscellaneous functions

export {
  partial,
  $,
  flip,
  id,
  constant,
  until
} from './misc';

// Boolean functions

export {
  and,
  or,
  not
} from './bool';

// Numeric functions

export {
  even,
  odd
} from './num';

// I/O functions

export {
  show,
  print
} from './io';
