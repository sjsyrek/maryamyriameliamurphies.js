/**
 * maryamyriameliamurphies.js
 *
 * @name index.js
 * @author Steven J. Syrek
 * @file A library of Haskell-style morphisms ported to ES2015 JavaScript using Babel.
 * @license ISC
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
 * Corrections, modifications, improvements, and additions welcome.
 */

/** @module maryamyriameliamurphies.js/source/index */

export * from './source/base';
export * from './source/eq';
export * from './source/ord';
export * from './source/monoid';
export * from './source/functor';
export * from './source/applicative';
export * from './source/monad';
export * from './source/foldable';
export * from './source/traversable';
export * from './source/maybe';
export * from './source/tuple';
export * from './source/list';
