import {Eq} from './eq';

const Ordering = {
  EQ: 'EQ',
  LT: 'LT',
  GT: 'GT'
}

Object.freeze(Ordering);

export class Ord extends Eq {
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
