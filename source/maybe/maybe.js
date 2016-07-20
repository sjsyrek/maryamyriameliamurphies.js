/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * maybe/maybe.js
 *
 * Maybe data type.
 * @license ISC
 */

import {isEq} from '../eq';

import {
  compare,
  EQ,
  GT,
  LT
} from '../ord';

import {mappend} from '../monoid';

import {fmap} from '../functor';

import {pure} from '../applicative';

import {
  Nothing,
  just,
  isNothing
} from '../maybe';

import {
  Type,
  type
} from '../type';

/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a` either contains a
 * value of type `a` (represented as `Just a`), or it is empty (represented as `Nothing`). Using
 * Maybe is a good way to deal with errors or exceptional cases without resorting to drastic
 * measures such as throwing an error. If finer-grained control is necessary, however, use `Either`.
 * @alias module:maybe.Maybe
 * @kind class
 * @extends Type
 * @private
 */
export class Maybe extends Type {
  /**
   * Create a new `Maybe`, which represents either a value or `Nothing`
   * @param {*} a - The value to wrap in a `Maybe`
   * @private
   */
  constructor(a) {
    super();
    if (a !== undefined) { this.value = () => a; }
  }
  // Eq
  static isEq(a, b) {
    if (isNothing(a) && isNothing(b)) { return true; }
    if (isNothing(a) || isNothing(b)) { return false; }
    return isEq(a.value(), b.value());
  }
  // Ord
  static compare(a, b) {
    if (isEq(a, b)) { return EQ; }
    if (isNothing(a)) { return LT; }
    if (isNothing(b)) { return GT; }
    return compare(a.value(), b.value());
  }
  // Monoid
  static mempty() { return Nothing; }
  static mappend(m1, m2) {
    if (isNothing(m1)) { return m2; }
    if (isNothing(m2)) { return m1; }
    return new Maybe(mappend(m1.value(), m2.value()));
  }
  // Foldable
  static foldr(f, z, m) { return isNothing(m) ? z : f(m.value(), z); }
  // Traversable
  static traverse(f, m) { return isNothing(m) ? pure(m, Nothing) : fmap(just, f(m.value())); }
  // Functor
  static fmap(f, m) { return isNothing(m) ? Nothing : new Maybe(f(m.value())); }
  // Applicative
  static pure(m) { return just(m); }
  static ap(f, m) { return isNothing(f) ? Nothing : fmap(f.value(), m); }
  // Monad
  static flatMap(m, f) { return isNothing(m) ? Nothing : f(m.value()); }
  // Prototype
  typeOf() { return `Maybe ${this.value === undefined ? 'Nothing' : type(this.value())}`; }
  valueOf() { return this.value === undefined ? `Nothing` : `Just ${this.value()}`; }
}
