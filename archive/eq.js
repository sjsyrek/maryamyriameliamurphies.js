// eq.js

export class Eq {
  static is(a, b) { return a.eq(b) ? true : false; }
  static isNot(a, b) { return !this.is(a, b) }
}
