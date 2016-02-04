import {Type} from './base';

export class Tuple extends Type {
  constructor(...values) {
    super();
    if (values.length < 2) {
      throw new Error(`${this.EXC()}Tuples must be defined with at least two values.`);
    } else {
      values.forEach( (value, i) => this[i + 1] = value);
    }
  };

  static _error(f) { throw new Error(`${this.EXC()}Argument to Tuple.${f} is not a Tuple.`); };

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
          throw new Error(`${this.EXC()}Objects cannot be compared.`);
        } else {
          return av === b.values()[i];
        }
      });
    } else {
      throw new Error(`${this.EXC()}${aType} is not the same type as ${bType}.`);
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
          throw new Error(`${this.EXC()}Objects cannot be compared.`);
        } else if (av < bv) {
          return Ordering.LT;
        } else if (av > bv) {
          return Ordering.GT;
        }
      }
      return Ordering.EQ;
    } else {
      throw new Error(`${this.EXC()}${aType} is not the same type as ${bType}.`);
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
