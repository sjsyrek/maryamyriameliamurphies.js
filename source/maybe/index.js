/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * maybe/index.js
 *
 * @file Top level index for Maybe data type.
 * @license ISC
 */

/** @module maybe */

export {Maybe} from './maybe';

export {
  Nothing,
  just,
  maybe,
  isMaybe,
  isJust,
  isNothing,
  fromJust,
  fromMaybe,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe
} from './func';
