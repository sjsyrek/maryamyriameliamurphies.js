// export class Eq
module.exports = class Eq {
  static _typeCheck(a, b) {
    if (a.eq === undefined) throw new Error(`'${a}' is not a member of the 'Eq' type class.`);
    if (b.eq === undefined) throw new Error(`'${b}' is not a member of the 'Eq' type class.`);
    if (a.constructor !== b.constructor) throw new Error('Arguments to Eq must be the same type.');
    return true;
  }
  static is(a, b) { return this._typeCheck(a, b) && a.eq(b) ? true : false; }
  static isNot(a, b) { return this._typeCheck(a, b) && a.eq(b) ? false : true; }
}