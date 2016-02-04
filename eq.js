import {TypeClass} from './base';

export class Eq extends TypeClass {
  static _classCheck(a, f) {
    if (super._classCheck(a, f) === false) throw new Error(`${this.EXC()}'${a}' is not a member of the '${this.name}' type class.`);
  }
  static _eq(a, b) {
    let f = 'eq';
    this._classCheck(a, f);
    this._classCheck(b, f);
    this._typeMatch(a, b);
    return true;
  }
  static _typeMatch(a, b) {
    if (super._typeMatch(a, b) === false) throw new Error(`${this.EXC()}Arguments to '${this.name}' must be the same type.`);
  }
  static is(a, b) { return this._eq(a, b) && a.eq(b) ? true : false; }
  static isNot(a, b) { return !this.is(a, b) }
}
