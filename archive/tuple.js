// tuple.js

import {Ord} from './ord';

export class Tuple extends Ord {
  constructor(...values) { super(); values.forEach( (value, i) => this[i + 1] = value); }

  static isTuple(a) { return a.constructor === Tuple ? true : false; }

  static from(arrayLike) { return Reflect.construct(this, Array.from(arrayLike)); }

  static tuple(...values) {
    if (values.length === 0) { return {}; }
    if (values.length === 1) { return values[0]; }
    return new Tuple(...values);
  }

  static curry(f, x, y) { return f.bind(f, Reflect.construct(Tuple, [x, y])); }

  isType(b) { return Tuple.isTuple(b) ? this.typeOf() === b.typeOf() : false; }

  eq(b) { return this.isType(b) && this.values().every((a, i) => a === b.values()[i]); }

  compare(b) {
    if (this.eq(b)) { return Ordering.EQ; }
    for (var i = 0; i < this.values().length; i += 1) {
      if (this.values()[i] < b.values()[i]) { return Ordering.LT; }
      if (this.values()[i] > b.values()[i]) { return Ordering.GT; }
    }
  }

  get fst() { return this[1]; }

  get snd() { return this[2]; }

  uncurry(f) { return f.bind(f, this.fst, this.snd); }

  swap() { return Reflect.construct(Tuple, [this.snd, this.fst]); }

  toString() { return '[Object Tuple]'; }

  typeOf() { return `(${Reflect.ownKeys(this).map(key => typeof this[key]).join(', ')})`; }

  // Deprecate in ES7
  values() { return Reflect.ownKeys(this).map(key => this[key]); }

  valueOf() { return `(${Reflect.ownKeys(this).map(key => typeof this[key] === 'string' ? `'${this[key]}'` : this[key]).join(', ')})`; }
}
