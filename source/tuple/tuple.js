/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * tuple/tuple.js
 *
 * Tuple data type.
 * @license ISC
 */

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
  type,
  dataType
} from '../type';

import {error} from '../error';

/**
 * A data constructor for a `Tuple`. Unlike Haskell, which provides a separate constructor for every
 * possible number of tuple values, this class supports tuples of any size, two values and above.
 * Empty tuples, however, are a special type called `unit`, and single values passed to the
 * constructor of this class will be returned unmodified.
 * @alias module:tuple.Tuple
 * @kind class
 * @extends Type
 * @private
 */
export class Tuple extends Type {
  /**
   * Create a new `Tuple`.
   * @param {...*} values - The values to construct into a `Tuple`
   * @private
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
  static mempty() { return unit; }
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
