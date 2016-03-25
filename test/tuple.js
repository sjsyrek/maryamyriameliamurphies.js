import m from '../distribution/index';

let tuple = m.tuple;
let unit = m.unit;

describe(`Tuple`, function() {
  let a = tuple(1, 2);
  let b = tuple(1, 2);
  let c = m.swap(b);
  let d = m.fromArrayToTuple([2, 1]);
  let e = tuple(1, 2, 3);
  // Eq
  describe(`isEq(Tuple, Tuple)`, function() {
    let isEq = m.isEq;
    it(`should return true if the two tuples are the same type and equal in values.`, function() {
      isEq(a, b).should.be.true;
      isEq(c, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type but not equal in values.`, function() {
      isEq(a, c).should.be.false;
      isEq(b, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      isEq.bind(null, a, e).should.throw();
    });
  });
  describe(`isNotEq(Tuple, Tuple)`, function() {
    let isNotEq = m.isNotEq;
    it(`should return true if the two tuples are the same type but not equal in values.`, function() {
      isNotEq(a, c).should.be.true;
      isNotEq(b, d).should.be.true;
    });
    it(`should return false if the two tuples are the same type and equal in values.`, function() {
      isNotEq(a, b).should.be.false;
      isNotEq(c, d).should.be.false;
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      isNotEq.bind(null, a, e).should.throw();
    });
  });
  // Ord
  describe(`compare(Tuple, Tuple)`, function() {
    let compare = m.compare;
    it(`should return the Ordering of the tuples if they are the same type.`, function() {
      compare(a, d).should.equal(m.LT);
      compare(c, b).should.equal(m.GT);
      compare(c, d).should.equal(m.EQ);
    });
    it(`should throw a type error if the two tuples are not the same type.`, function() {
      compare.bind(null, a, e).should.throw();
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
      m.max(a, d).should.have.properties({"1": 2, "2": 1});
      m.min(a, d).should.have.properties({"1": 1, "2": 2});
    });
  });
  // Monoid

  // Foldable

  // Traversable

  // Functor

  // Applicative

  it(`should return [Object Tuple] when cast to a string.`, function() {
    a.toString().should.equal(`[Object Tuple]`);
  });
  it(`should return a tuple string, e.g. "(1, 2)", as its value.`, function() {
    a.valueOf().should.equal(`(1,2)`);
  });
  describe(`unit`, function() {
    it(`should be the empty tuple.`, function() {
      unit.should.have.properties({"0": null});
    });
    it(`isTuple(unit) should return false.`, function() {
      m.isTuple(unit).should.be.false;
    });
  });
  // Basic functions
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
  describe(`fst()`, function() {
    let fst = m.fst;
    it(`should return the first element of a tuple.`, function() {
      fst(a).should.equal(1);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      fst.bind(null, unit).should.throw();
      fst.bind(null, {}).should.throw();
      fst.bind(null).should.throw();
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
  describe(`fromArrayToTuple()`, function() {
    it(`should create a new tuple from the values of an array.`, function() {
      d.should.have.properties({"1": 2, "2": 1});
    });
  });
  describe(`fromTupleToArray()`, function() {
    let fromTupleToArray = m.fromTupleToArray;
    it(`should create a new array from the values of a tuple.`, function() {
      let arr = fromTupleToArray(a);
      arr.should.eql([1, 2]);
    });
    it(`should throw a type error if a value other than a tuple is passed as an argument.`, function() {
      fromTupleToArray.bind(null).should.throw();
      fromTupleToArray.bind(null, {}).should.throw();
    });
  });
});
