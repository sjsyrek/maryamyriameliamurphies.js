import m from '../distribution/index';

let unit = m.unit;

describe(`Tuple`, function() {
  it(`should return [Object Tuple] when cast to a string.`, function() {
    let p = m.tuple(1, 2);
    p.toString().should.equal(`[Object Tuple]`);
  });
  it(`should return a tuple string, e.g. "(1, 2)", as its value.`, function() {
    let p = m.tuple(1, 2);
    p.valueOf().should.equal(`(1,2)`);
  });
  describe(`curry()`, function() {
    let f = function subtract(p) { return x - y; };
    let x = 10;
    let y = 2;
    it(`should return a function when no arguments are applied as arguments to the applied function.`, function() {
      let curried = m.curry(f);
      curried.should.be.a.Function;
    });
    it(`should return a function when arguments are partially applied to the applied function.`, function() {
      let curried = m.curry(f, x);
      curried.should.be.a.Function;
      curried = m.curry(f)(x);
    });
    it(`should return a value when all arguments are applied to the applied function.`, function() {
      let curried = m.curry(f, x, y);
      curried.should.equal(8);
      curried = m.curry(f)(x)(y);
      curried.should.equal(8);
    });
    it(`should be transitive with uncurry().`, function() {
      let p = m.tuple(100, 15);
      let f = function(p) { return m.fst(p) - m.snd(p); };
      let a = m.curry(f);
      let b = m.uncurry(a);
      let c = m.curry(b);
      (a(100)(15) === b(p) === c(100)(15)).should.be.true;
    });
  });
  describe(`fromArrayToTuple()`, function() {
    it(`should create a new tuple from the values of an array.`, function() {
      let p = m.fromArrayToTuple([100, 2]);
      p.should.have.properties({"1": 100, "2": 2});
    });
  });
  describe(`fromTupleToArray()`, function() {
    it(`should create a new array from the values of a tuple.`, function() {
      let p = m.tuple(1, 2);
      let arr = m.fromTupleToArray(p);
      arr.should.eql([1, 2]);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      m.fromTupleToArray.bind(null).should.throw();
      m.fromTupleToArray.bind(null, {}).should.throw();
    });
  });
  describe(`fst()`, function() {
    it(`should return the first element of a tuple.`, function() {
      let p = m.tuple(1, 2);
      m.fst(p).should.equal(1);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      m.fst.bind(null, unit).should.throw();
      m.fst.bind(null, {}).should.throw();
      m.fst.bind(null).should.throw();
    });
  });
  describe(`isEmpty(Tuple)`, function() {
    it(`should return true if the tuple is unit, the empty tuple.`, function() {
      let p1 = m.tuple();
      let p2 = m.tuple(1, 2);
      m.isEmpty(p1).should.be.true;
      m.isEmpty(p2).should.be.false;
    });
  });
  describe(`isTuple()`, function() {
    it(`should return true when the value is a tuple.`, function() {
      let p = m.tuple(1, 2);
      m.isTuple(p).should.be.true;
    });
    it(`should return false when the value is not a tuple.`, function() {
      let p = [1, 2];
      m.isTuple(p).should.be.false;
    });
    it(`should return false when the value is unit, the empty tuple.`, function() {
      m.isTuple(unit).should.be.false;
    });
  });
  describe(`snd()`, function() {
    it(`should return the second element of a tuple.`, function() {
      let p = m.tuple(1, 2);
      m.snd(p).should.equal(2);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      m.snd.bind(null, unit).should.throw();
      m.snd.bind(null, {}).should.throw();
      m.snd.bind(null).should.throw();
    });
  });
  describe(`swap()`, function() {
    it(`should swap the values of a tuple and return a new tuple.`, function() {
      let p = m.tuple(1, 2);
      m.swap(p).should.have.properties({"1": 2, "2": 1});
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      m.swap.bind(null, unit).should.throw();
      m.swap.bind(null, {}).should.throw();
      m.swap.bind(null).should.throw();
    });
  });
  describe(`tuple()`, function() {
    it(`should return a new tuple if at least two values are passed as arguments.`, function() {
      let p = m.tuple(1, 2);
      p.should.have.properties({"1": 1, "2": 2});
    });
    it(`should return the argument value if only one value is passed as an argument.`, function() {
      let p = m.tuple(7);
      p.should.equal(7);
    });
    it(`should return unit (an empty tuple) if no values are passed as arguments.`, function() {
      let p = m.tuple();
      p.should.have.properties({"0": null});
    });
  });
  describe(`uncurry()`, function() {
    let f = function(p) { return m.fst(p) - m.snd(p); };
    let p = m.tuple(10, 2);
    let curried = m.curry(f);
    let uncurried = m.uncurry(curried);
    it(`should return a function when no argument is applied as the second argument to the applied function.`, function() {
      uncurried.should.be.a.Function;
    });
    it(`should return a value when all arguments are applied.`, function() {
      uncurried(p).should.equal(8);
      uncurried = m.uncurry(curried)(p);
      uncurried.should.equal(8);
    });
  });
  describe(`typeOf()`, function() {
    it(`should return a string representing the type of the tuple, e.g. "(1, 2)" is type "(number, number)."`, function() {
      let p = m.tuple(1, 2);
      m.type(p).should.equal(`(number,number)`);
    });
  });
  describe(`isEq(Tuple, Tuple)`, function() {
    let a = m.tuple(1, 2);
    let b = m.tuple(1, 2);
    let c = m.swap(b);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return true if the two tuples are the same type and equal in values.`, function() {
      m.isEq(a, b).should.be.true;
      m.isEq(c, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type but not equal in values.`, function() {
      m.isEq(a, c).should.be.false;
      m.isEq(b, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = m.tuple(1, 2, 3);
      m.isEq.bind(null, a, p).should.throw();
    });
  });
  describe(`isNotEq(Tuple, Tuple)`, function() {
    let a = m.tuple(1, 2);
    let b = m.tuple(1, 2);
    let c = m.swap(b);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return true if the two tuples are the same type but not equal in values.`, function() {
      m.isNotEq(a, c).should.be.true;
      m.isNotEq(b, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type and equal in values.`, function() {
      m.isNotEq(a, b).should.be.false;
      m.isNotEq(c, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = m.tuple(1, 2, 3);
      m.isNotEq.bind(null, a, p).should.throw();
    });
  });
  describe(`compare(Tuple, Tuple)`, function() {
    let a = m.tuple(1, 2);
    let b = m.tuple(1, 3);
    let c = m.swap(a);
    let d = m.fromArrayToTuple([2, 1]);
    it(`should return the Ordering of the tuples if they are the same type.`, function() {
      m.compare(a, b).should.equal(m.LT);
      m.compare(c, b).should.equal(m.GT);
      m.compare(c, d).should.equal(m.EQ);
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      let p = m.tuple(1, 2, 3);
      m.compare.bind(null, a, p).should.throw();
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
