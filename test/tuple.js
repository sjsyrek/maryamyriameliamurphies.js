import m from '../distribution/index';

let tuple = m.tuple;
let unit = m.unit;

describe(`Tuple`, function() {
  it(`should return [Object Tuple] when cast to a string.`, function() {
    let p = tuple(1, 2);
    p.toString().should.equal(`[Object Tuple]`);
  });
  it(`should return a tuple string, e.g. "(1, 2)", as its value.`, function() {
    let p = tuple(1, 2);
    p.valueOf().should.equal(`(1,2)`);
  });
  describe(`curry()`, function() {
    let curry = m.curry;
    let uncurry = m.uncurry;
    let fst = m.fst;
    let snd = m.snd;
    let f = function subtract(p) { return x - y; };
    let x = 10;
    let y = 2;
    it(`should return a function when no arguments are applied as arguments to the applied function.`, function() {
      let curried = curry(f);
      curried.should.be.a.Function;
    });
    it(`should return a function when arguments are partially applied to the applied function.`, function() {
      let curried = curry(f, x);
      curried.should.be.a.Function;
      curried = curry(f)(x);
    });
    it(`should return a value when all arguments are applied to the applied function.`, function() {
      let curried = curry(f, x, y);
      curried.should.equal(8);
      curried = curry(f)(x)(y);
      curried.should.equal(8);
    });
    it(`should be transitive with uncurry().`, function() {
      let p = tuple(100, 15);
      let f = function(p) { return fst(p) - snd(p); };
      let a = curry(f);
      let b = uncurry(a);
      let c = curry(b);
      (a(100)(15) === b(p) === c(100)(15)).should.be.true;
    });
  });
  describe(`fromArrayToTuple()`, function() {
    let fromArrayToTuple = m.fromArrayToTuple;
    it(`should create a new tuple from the values of an array.`, function() {
      let p = fromArrayToTuple([100, 2]);
      p.should.have.properties({"1": 100, "2": 2});
    });
  });
  describe(`fromTupleToArray()`, function() {
    let fromTupleToArray = m.fromTupleToArray;
    it(`should create a new array from the values of a tuple.`, function() {
      let p = tuple(1, 2);
      let arr = fromTupleToArray(p);
      arr.should.eql([1, 2]);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      fromTupleToArray.bind(null).should.throw();
      fromTupleToArray.bind(null, {}).should.throw();
    });
  });
  describe(`fst()`, function() {
    let fst = m.fst;
    it(`should return the first element of a tuple.`, function() {
      let p = tuple(1, 2);
      fst(p).should.equal(1);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      fst.bind(null, unit).should.throw();
      fst.bind(null, {}).should.throw();
      fst.bind(null).should.throw();
    });
  });
  describe(`isEmpty(Tuple)`, function() {
    let isEmpty = m.isEmpty;
    it(`should return true if the tuple is unit, the empty tuple.`, function() {
      let p1 = tuple();
      let p2 = tuple(1, 2);
      isEmpty(p1).should.be.true;
      isEmpty(p2).should.be.false;
    });
  });
  describe(`isTuple()`, function() {
    let isTuple = m.isTuple;
    it(`should return true when the value is a tuple.`, function() {
      let p = tuple(1, 2);
      isTuple(p).should.be.true;
    });
    it(`should return false when the value is not a tuple.`, function() {
      let p = [1, 2];
      isTuple(p).should.be.false;
    });
    it(`should return false when the value is unit, the empty tuple.`, function() {
      isTuple(unit).should.be.false;
    });
  });
  describe(`snd()`, function() {
    let snd = m.snd;
    it(`should return the second element of a tuple.`, function() {
      let p = tuple(1, 2);
      snd(p).should.equal(2);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      snd.bind(null, unit).should.throw();
      snd.bind(null, {}).should.throw();
      snd.bind(null).should.throw();
    });
  });
  describe(`swap()`, function() {
    let swap = m.swap;
    it(`should swap the values of a tuple and return a new tuple.`, function() {
      let p = tuple(1, 2);
      swap(p).should.have.properties({"1": 2, "2": 1});
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      swap.bind(null, unit).should.throw();
      swap.bind(null, {}).should.throw();
      swap.bind(null).should.throw();
    });
  });
  describe(`tuple()`, function() {
    it(`should return a new tuple if at least two values are passed as arguments.`, function() {
      let p = tuple(1, 2);
      p.should.have.properties({"1": 1, "2": 2});
    });
    it(`should return the argument value if only one value is passed as an argument.`, function() {
      let p = tuple(7);
      p.should.equal(7);
    });
    it(`should return unit (an empty tuple) if no values are passed as arguments.`, function() {
      let p = tuple();
      p.should.have.properties({"0": null});
    });
  });
  describe(`uncurry()`, function() {
    let curry = m.curry;
    let uncurry = m.uncurry;
    let fst = m.fst;
    let snd = m.snd;
    let f = function(p) { return fst(p) - snd(p); };
    let p = tuple(10, 2);
    let curried = curry(f);
    let uncurried = uncurry(curried);
    it(`should return a function when no argument is applied as the second argument to the applied function.`, function() {
      uncurried.should.be.a.Function;
    });
    it(`should return a value when all arguments are applied.`, function() {
      uncurried(p).should.equal(8);
      uncurried = uncurry(curried)(p);
      uncurried.should.equal(8);
    });
  });
  describe(`type()`, function() {
    let type = m.type;
    it(`should return a string representing the type of the tuple, e.g. "(1, 2)" is type "(number, number)."`, function() {
      let p = tuple(1, 2);
      type(p).should.equal(`(number,number)`);
    });
  });
  // Eq
  describe(`isEq(Tuple, Tuple)`, function() {
    let isEq = m.isEq;
    let a = tuple(1, 2);
    let b = tuple(1, 2);
    let c = m.swap(b);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return true if the two tuples are the same type and equal in values.`, function() {
      isEq(a, b).should.be.true;
      isEq(c, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type but not equal in values.`, function() {
      isEq(a, c).should.be.false;
      isEq(b, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = tuple(1, 2, 3);
      isEq.bind(null, a, p).should.throw();
    });
  });
  describe(`isNotEq(Tuple, Tuple)`, function() {
    let isNotEq = m.isNotEq;
    let a = tuple(1, 2);
    let b = tuple(1, 2);
    let c = m.swap(b);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return true if the two tuples are the same type but not equal in values.`, function() {
      isNotEq(a, c).should.be.true;
      isNotEq(b, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type and equal in values.`, function() {
      isNotEq(a, b).should.be.false;
      isNotEq(c, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = tuple(1, 2, 3);
      isNotEq.bind(null, a, p).should.throw();
    });
  });
  // Ord
  describe(`compare(Tuple, Tuple)`, function() {
    let compare = m.compare;
    let a = tuple(1, 2);
    let b = tuple(1, 3);
    let c = m.swap(a);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return the Ordering of the tuples if they are the same type.`, function() {
      compare(a, b).should.equal(m.LT);
      compare(c, b).should.equal(m.GT);
      compare(c, d).should.equal(m.EQ);
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = tuple(1, 2, 3);
      compare.bind(null, a, p).should.throw();
    });
    it(`should work with the other Ordering functions.`, function() {
      m.lessThan(a, b).should.be.true;
      m.lessThan(c, d).should.be.false;
      m.lessThan(b, a).should.be.false;
      m.lessThanOrEqual(a, b).should.be.true;
      m.lessThanOrEqual(c, d).should.be.true;
      m.lessThanOrEqual(b, a).should.be.false;
      m.greaterThan(b, a).should.be.true;
      m.greaterThan(c, d).should.be.false;
      m.greaterThan(a, b).should.be.false;
      m.greaterThanOrEqual(b, a).should.be.true;
      m.greaterThanOrEqual(c, d).should.be.true;
      m.greaterThanOrEqual(a, b).should.be.false;
      m.max(a, b).should.have.properties({"1": 1, "2": 3});
      m.min(b, c).should.have.properties({"1": 1, "2": 3});
    });
  });
  describe(`unit`, function() {
    it(`should be the empty tuple.`, function() {
      unit.should.have.properties({"0": null});
    });
    it(`isTuple(unit) should return false.`, function() {
      m.isTuple(unit).should.be.false;
    });
  });
});
