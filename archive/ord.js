// ord.js

import {Eq} from './eq';

const Ordering = {
  EQ: 'EQ',
  LT: 'LT',
  GT: 'GT'
}

Object.freeze(Ordering);

export class Ord extends Eq {
  static compare(a, b) { return a.compare(b); }
  lessThanOrEqual(a, b) { return this.compare(a, b) !== Ordering.GT; }
  lessThan(a, b) { return this.compare(a, b) === Ordering.LT; }
  greaterThanOrEqual(a, b) { return this.compare(a, b) !== Ordering.LT; }
  greaterThan(a, b) { return this.compare(a, b) === Ordering.GT; }
  static max(a, b) { return a.lessThanOrEqual(b) ? b : a; }
  static min(a, b) { return a.lessThanOrEqual(b) ? a : b; }
}
