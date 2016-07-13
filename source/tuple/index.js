/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * tuple/index.js
 *
 * @file Top level index for Tuple data type.
 * @license ISC
 */

/** @module tuple */

export {Tuple} from './tuple';

export {
  unit,
  tuple,
  fst,
  snd,
  curry,
  uncurry,
  swap,
  isTuple,
  isUnit,
  fromArrayToTuple,
  fromTupleToArray
} from './func';
