/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/list.js
 *
 * @file List data type.
 * @license ISC
 */

/** @module list/list */

import {
  compare,
  EQ,
  GT,
  LT
} from '../ord';

import {fmap} from '../functor';

import {
  pure,
  ap
} from '../applicative';

import {foldr} from '../foldable';

import {traverse} from '../traversable';

import {
  emptyList,
  list,
  cons,
  head,
  tail,
  listAppend,
  isList,
  isEmpty,
  fromListToArray,
  fromListToString,
  map,
  concat
} from '../list';

import {
  type,
  typeCheck
} from '../type';

import {error} from '../error';

/** @class List
 * A data constructor for a `List`. In Haskell, unlike in JavaScript, the default collection type is
 * a linked list, not an array. Obviously, there are benefits and drawbacks to both, and native
 * Arrays in JavaScript have certain performance advantages that a custom linked list implementation
 * may not be able to outperform, even when performing operations for which linked lists, all other
 * things being equal, have an advantage. Lists may only contain values of a single type.
 * @extends Type
 */
class List extends Type {
  /** @constructor
   * Create a new `List`.
   * @param {*} head - The value to put at the head of the list (also determines the list's type).
   * @param {List} tail - The tail of the list, which is also a list (possibly the empty list).
   */
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    this.head = () => head;
    this.tail = () => tail;
  }
  // Eq
  static isEq(as, bs) {
    return typeCheck(head(as), head(bs)) ? fromListToArray(as).every((a, i) =>
    a === fromListToArray(bs)[i]) : error.typeMismatch(head(as), head(bs), this.isEq);
  }
  // Ord
  static compare(as, bs) {
    if (isEmpty(as) && isEmpty(bs)) { return EQ; }
    if (isEmpty(as) && isEmpty(bs) === false) { return LT; }
    if (isEmpty(as) === false && isEmpty(bs)) { return GT; }
    if (compare(head(as), head(bs)) === EQ) { return compare(tail(as), tail(bs)); }
    return compare(head(as), head(bs));
  }
  // Monoid
  static mempty(as) { return emptyList; }
  static mappend(as, bs) { return listAppend(as, bs); }
  // Foldable
  static foldr(f, acc, as) {
    if (isList(as) === false ) { return error.listError(as, this.foldr); }
    if (isEmpty(as)) { return acc; }
    //if (typeCheck(acc, head(as)) === false) { return error.typeMismatch(acc, head(as), foldr); }
    const x = head(as);
    const xs = tail(as);
    return f(x, foldr(f, acc, xs));
  }
  // Traversable
  static traverse(f, as) {
    return isEmpty(as) ? pure(as, emptyList) : ap(fmap(cons)(f(head(as))))(traverse(f, tail(as)));
  }
  // Functor
  static fmap(f, as) { return map(f, as); }
  // Applicative
  static pure(a) { return list(a); }
  static ap(fs, as) {
    return isEmpty(fs) ? emptyList : listAppend(fmap(head(fs), as))(ap(tail(fs), as));
  }
  // Monad
  static bind(xs, f) { return concat(map(f, xs)); }
  // Prototype
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(head(this))}]`; }
  valueOf() {
    //return head(this) === null ? `[]` : `${head(this)}:${tail(this).valueOf()}`;
    const value = list => isEmpty(list) ? `[]` : `${head(list)}:${value(tail(list))}`;
    return `[${type(this) === `[string]` ? fromListToString(this) : value(this)}]`;
  }
}
