var Eq = require('./eq.js');
var Ord = require('./ord.js');

// export class Tuple
module.exports = class Tuple {
  constructor(...values) {
    if (values.length < 2) {
      throw new Error('Tuples must be defined with at least two values.');
    } else {
      values.forEach( (value, i) => this[i + 1] = value);
    }
  };

  static _error(f) { throw new Error(`Argument to Tuple.${f} is not a Tuple.`); };

  static eq(a, b) { return Eq.is(a, b); };

  static isTuple(o) { return o.constructor === Tuple ? true : false; };

  static from(arrayLike) { return Reflect.construct(this, Array.from(...arguments)); };

  static fst(p) { if (this.isTuple(p)) return p.fst; else this._error('fst'); };

  static snd(p) { if (this.isTuple(p)) return p.snd; else this._error('snd'); };

  static curry(f, x, y) { return Reflect.construct(Tuple, [x, y]).curry(f); };

  static uncurry(f, p) { if (this.isTuple(p)) return p.uncurry(f); else this._error('uncurry'); };

  static swap(p) { if (this.isTuple(p)) return p.swap(); else this._error('swap'); };

  static typeOf(p) { if (this.isTuple(p)) return p.typeOf(); else this._error('typeOf'); };

  eq(b) { return this.values().every( (v, i) => v === b.values()[i] ); };

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