/*
 * @name maryamyriameliamurphies.js
 *
 * @fileOverview
 * maryamyriameliamurphies.js is a library of Haskell morphisms ported to JavaScript
 * using ECMAScript2015 syntax.
 *
 * See also:
 *
 * - [casualjs](https://github.com/casualjs/f)
 * - [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
 *
 * Guide to reading the code
 * -------------------------
 * I defined each Haskell type as an ES2015 class, hewing as closely as I could to the
 * Haskell original but with many concessions to JavaScript and probably a few too many
 * attempts to implement functions as one-liners. I introduce each class with the syntax
 * of its Haskell original and, otherwise, my hope is that most of the functions are
 * self-documenting.
 */

'use strict';

const EXC = '*** Exception: ';

class Type {
  static _type(a) {
    return a.constructor;
  }
}

class TypeClass {
  static _classCheck(a, f) { return a[f] !== undefined && a.f === 'function' ? true : false; }
  static _classMatch(a, b) { return this._classCheck(a) && this._classCheck(b); }
  static _typeCheck(a) { return a.typeOf() || a.constructor; }
  static _typeMatch(a, b) { return this._typeCheck(a) && this._typeCheck(b); }
}

/**
 * A Type class for determining equality. Implement on an object by defining a
 * function `eq(b)` that returns `true` if that object is equal to `b` and false
 * otherwise. Throws exceptions on invalid arguments.
 * class Eq a where
 *  (==), (/=) :: a -> a -> Bool
 */
class Eq {
		/**
			* Check whether an object is a member of the Eq type class.
			* @param {*} a - Any value.
			* @return {this} If `a` implements an `eq` function, return `this` for chaining.
			* @private
			*/
  static _classCheck(a, f) {
    if (super._classCheck(a, f) === false) throw new Error(`${EXC}'${a}' is not a member of the '${this.name}' type class.`);
  }
		/**
			* Check whether two objects are the same type.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` both have the same constructor.
			* @private
			*/
  static _eq(a, b) {
    let f = 'eq';
    this._classCheck(a, f);
    this._classCheck(b, f);
    this._typeMatch(a, b);
    return this;
  }
  static _typeMatch(a, b) {
    if (super._typeMatch(a, b) === false) throw new Error(`${EXC}Arguments to '${this.name}' must be the same type.`);
  }
		/**
			* Check whether two objects that implement Eq are equal. Equivalent to `a === b`.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` are equal.
			*/
  static is(a, b) { return this._eq(a, b).a.eq(b) ? true : false; }
		/**
			* The opposite of `is`. Equivalent to `a !== b`.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` are not equal.
			*/
  static isNot(a, b) { return !this.is(a, b) }
}

class Ord extends Eq {
  static _ord(a, b) {
    let f = 'compare';
    super._classCheck(a, f);
    super._classCheck(b, f);
    super._eq(a, b);
    return this
  }
  static compare(a, b) { return this._ord(a, b).a.compare(a, b); }
  static lessThanOrEqual(a, b) { return this.compare(a, b) !== Ordering.GT; }
  static lessThan(a, b) { return this.compare(a, b) === Ordering.LT; }
  static greaterThanOrEqual(a, b) { return this.compare(a, b) !== Ordering.LT; }
  static greaterThan(a, b) { return this.compare(a, b) === Ordering.GT; }
  static max(a, b) { return this.lessThanOrEqual(a, b) ? y : x; }
  static min(a, b) { return this.lessThanOrEqual(a, b) ? x : y; }
}

const Ordering = {
  EQ: 'EQ',
  LT: 'LT',
  GT: 'GT'
}

Object.freeze(Ordering);

class Tuple extends Type {
  constructor(...values) {
    super();
    if (values.length < 2) {
      throw new Error(`${EXC}Tuples must be defined with at least two values.`);
    } else {
      values.forEach( (value, i) => this[i + 1] = value);
    }
  };

  static _error(f) { throw new Error(`${EXC}Argument to Tuple.${f} is not a Tuple.`); };

  static eq(a, b) { return Eq.is(a, b); };

  static isTuple(o) { return super._type(o) === Tuple ? true : false; };

  static from(arrayLike) { return Reflect.construct(this, Array.from(...arguments)); };

  static fst(p) { if (this.isTuple(p)) return p.fst; else this._error('fst'); };

  static snd(p) { if (this.isTuple(p)) return p.snd; else this._error('snd'); };

  static curry(f, x, y) { return Reflect.construct(Tuple, [x, y]).curry(f); };

  static uncurry(f, p) { if (this.isTuple(p)) return p.uncurry(f); else this._error('uncurry'); };

  static swap(p) { if (this.isTuple(p)) return p.swap(); else this._error('swap'); };

  static typeOf(p) { if (this.isTuple(p)) return p.typeOf(); else this._error('typeOf'); };

  eq(b) {
    if (!Tuple.isTuple(b)) Tuple._error('eq');
    let aType = this.typeOf();
    let bType = b.typeOf();
    if (aType === bType) {
      return this.values().every( (av, i) => {
        let bv = b.values()[i];
        if (typeof av === 'object' || typeof bv === 'object') {
          throw new Error(`${EXC}Objects cannot be compared.`);
        } else {
          return av === b.values()[i];
        }
      });
    } else {
      throw new Error(`${EXC}${aType} is not the same type as ${bType}.`);
    }
  };

  compare(b) {
    if (this.eq(b)) return new Ordering(EQ);
    let aType = this.typeOf();
    let bType = b.typeOf();
    if (aType === bType) {
      let avalues = this.values();
      let bvalues = b.values();
      for (i = 0; i < avalues.length(); i += 1) {
        let av = avalues[i];
        let bv = bvalues[i];
        if (typeof av === 'object' || typeof bv === 'object') {
          throw new Error(`${EXC}Objects cannot be compared.`);
        } else if (av < bv) {
          return Ordering.LT;
        } else if (av > bv) {
          return Ordering.GT;
        }
      }
      return Ordering.EQ;
    } else {
      throw new Error(`${EXC}${aType} is not the same type as ${bType}.`);
    }
  };

  get fst() { return this[1]; };

  get snd() { return this[2]; };

  curry(f) { return f.bind(this, this.fst).bind(f, this.snd); };

  uncurry(f) { return f.bind(this, this.fst, this.snd); };

  swap() { return Reflect.construct(Tuple, [this.snd, this.fst]); };

  toString() { return '[Object Tuple]'; };

  typeOf() { return `(${Reflect.ownKeys(this).map(key => typeof this[key]).join(', ')})`; };

  // Deprecate in ES7
  values() { return Reflect.ownKeys(this).map(key => this[key]); };

  valueOf() { return `(${Reflect.ownKeys(this).map(key => typeof this[key] === 'string' ? `'${this[key]}'` : this[key]).join(', ')})`; }
}

export default {
  Eq,
  Ord,
  Tuple
};
