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
  static _classCheck(a) {
    if (typeof a.eq !== 'function') throw new Error(`${EXC}'${a}' is not a member of the 'Eq' type class.`);
    return this;
  }
		/**
			* Check whether two objects are the same type.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` both have the same constructor.
			* @private
			*/
  static _typeCheck(a, b) {
    if (a.constructor !== b.constructor) throw new Error(`${EXC}Arguments to 'Eq' must be the same type.`);
    return true;
  }
		/**
			* Check whether two objects that implement Eq are equal. Equivalent to `a === b`.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` are equal.
			*/
  static is(a, b) { return this._classCheck(a)._classCheck(b)._typeCheck(a, b) && a.eq(b) ? true : false; }
		/**
			* The opposite of `is`. Equivalent to `a !== b`.
			* @param {*} a - Any value.
			* @param {*} b - Any value.
			* @return {boolean} True if `a` and `b` are not equal.
			*/
  static isNot(a, b) { return !this.is(a, b) }
}

class Ord extends Eq {

}

/*
class  (Eq a) => Ord a  where
    compare              :: a -> a -> Ordering
    (<), (<=), (>=), (>) :: a -> a -> Bool
    max, min             :: a -> a -> a

        -- Minimal complete definition:
        --      (<=) or compare
        -- Using compare can be more efficient for complex types.
    compare x y
         | x == y    =  EQ
         | x <= y    =  LT
         | otherwise =  GT

    x <= y           =  compare x y /= GT
    x <  y           =  compare x y == LT
    x >= y           =  compare x y /= LT
    x >  y           =  compare x y == GT

-- note that (min x y, max x y) = (x,y) or (y,x)
    max x y
         | x <= y    =  y
         | otherwise =  x
    min x y
         | x <= y    =  x
         | otherwise =  y
*/

class Tuple {
  constructor(...values) {
    if (values.length < 2) {
      throw new Error('${EXC}Tuples must be defined with at least two values.');
    } else {
      values.forEach( (value, i) => this[i + 1] = value);
    }
  };

  static _error(f) { throw new Error(`${EXC}Argument to Tuple.${f} is not a Tuple.`); };

  static eq(a, b) { return Eq.is(a, b); };

  static isTuple(o) { return o.constructor === Tuple ? true : false; };

  static from(arrayLike) { return Reflect.construct(this, Array.from(...arguments)); };

  static fst(p) { if (this.isTuple(p)) return p.fst; else this._error('fst'); };

  static snd(p) { if (this.isTuple(p)) return p.snd; else this._error('snd'); };

  static curry(f, x, y) { return Reflect.construct(Tuple, [x, y]).curry(f); };

  static uncurry(f, p) { if (this.isTuple(p)) return p.uncurry(f); else this._error('uncurry'); };

  static swap(p) { if (this.isTuple(p)) return p.swap(); else this._error('swap'); };

  static typeOf(p) { if (this.isTuple(p)) return p.typeOf(); else this._error('typeOf'); };

  eq(b) {
    let aType = this.typeOf();
    let bType = b.typeOf();
    if (aType === bType) {
      return this.values().every( (av, i) => {
        let bv = b.values()[i];
        if (typeof av === 'object' || typeof bv === 'object') {
          throw new Error(`Objects cannot be compared.`);
        } else {
          return av === b.values()[i];
        }
      });
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

///////////////////////////////////////////////////////////////////////////////
// Tests

// Tuple tests
var p1 = new Tuple(1, 2);
var p2 = new Tuple(3, 4);
var p3 = Tuple.from([1, 2]);
var p4 = Tuple.swap(p2);
var p5 = new Tuple(10, 20, 30, 40, 50);
var subtract = (a, b) => a - b;
var curried = Tuple.curry(subtract, 100, 98);
var uncurried = Tuple.uncurry(curried, p2);

console.log(`Tuples:
             p1.typeOf():       ${p1.typeOf()} // (number, number)
             p1.fst:            ${p1.fst} // 1
             p1.snd:            ${p1.snd} // 2
             p3.valueOf():      ${p3.valueOf()} // (1, 2)
             Tuple.isTuple(p4): ${Tuple.isTuple(p4)} // true
             Eq(p1, p3):        ${Eq.is(p1, p3)} // true
             Eq(p1, p2):        ${Eq.is(p1, p2)}`); // false

// console.log(`Eq(p1, p5):       ${Eq.is(p1, p5)}`); *** Exception: (number, number) is not the same type as (number, number, number, number, number).

console.log(uncurried()); // 2