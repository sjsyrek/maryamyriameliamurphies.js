/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * tuple/tuple.js
 *
 * @file Tuple data type.
 * @license ISC
 */

/** @module tuple/tuple */

import {
  EQ,
  GT,
  LT
} from '../ord';

import {
  mempty,
  mappend
} from '../monoid';

import {fmap} from '../functor';

import {
  unit,
  tuple,
  fst,
  snd,
  fromTupleToArray
} from '../tuple';

import {
  Type,
  dataType
} from '../type';

import {error} from '../error';

/** @class Tuple
 * A data constructor for a `Tuple`. Unlike Haskell, which provides a separate constructor for every
 * possible number of tuple values, this class will construct tuples of any size. Empty tuples,
 * however, are a special type called `unit`, and single values passed to this constructor will be
 * returned unmodified. In order for them be useful, it is recommended that you create tuples with
 * primitive values only.
 * @extends Type
 */
export class Tuple extends Type {
  /** @constructor
   * Create a new `Tuple`.
   * @param {...*} values - The values to construct into a `Tuple`.
   */
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
    while (i in a) {
      if (a[i] < b[i]) { return LT; }
      if (a[i] > b[i]) { return GT; }
      i += 1;
    }
  }
  // Monoid
  static mempty(a) { return unit; }
  static mappend(a, b) { return new Tuple(mappend(fst(a), fst(b)), mappend(snd(a), snd(b))); }
  // Foldable
  static foldr(f, acc, p) { return f(snd(p), acc); }
  // Traversable
  static traverse(f, p) { return fmap(tuple.bind(this, fst(p)), f(snd(p))); }
  // Functor
  static fmap(f, p) { return new Tuple(fst(p), f(snd(p))); }
  // Applicative
  static pure(p) { return new Tuple(mempty(p), snd(p)); }
  static ap(uf, vx) { return new Tuple(mappend(fst(uf), fst(vx)), snd(uf)(snd(vx))); }
  // Prototype
  toString() { return `[Object Tuple]`; }
  typeOf() { return `(${Object.getOwnPropertyNames(this)
    .map(key => type(this[key]))
    .join(',')})`; }
  valueOf() {
    if (this === unit) { return `()`; }
    return `(${Object.getOwnPropertyNames(this)
      .map(key => type(this[key]) === 'string' ? `'${this[key]}'` : this[key].valueOf())
      .join(',')})`;
  }
}
