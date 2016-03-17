import murphies from '../distribution/index';

let unit = murphies.unit;

describe('Tuple', function() {
  it('should return [Object Tuple] when cast to a string.', function() {
    let p = murphies.tuple(1, 2);
    p.toString().should.equal(`[Object Tuple]`);
  });
  it('should return a tuple string, e.g. "(1, 2)", as its value.', function() {
    let p = murphies.tuple(1, 2);
    p.valueOf().should.equal(`(1,2)`);
  });
  describe('#curry()', function() {
    let f = function subtract(p) { return x - y; };
    let x = 10;
    let y = 2;
    it('should return a function when no arguments are applied as arguments to the applied function.', function() {
      let curried = murphies.curry(f);
      curried.should.be.a.Function;
    });
    it('should return a function when arguments are partially applied to the applied function.', function() {
      let curried = murphies.curry(f, x);
      curried.should.be.a.Function;
      curried = murphies.curry(f)(x);
    });
    it('should return a value when all arguments are applied to the applied function.', function() {
      let curried = murphies.curry(f, x, y);
      curried.should.equal(8);
      curried = murphies.curry(f)(x)(y);
      curried.should.equal(8);
    });
    it('should be transitive with uncurry().', function() {
      let p = murphies.tuple(100, 15);
      let f = function(p) { return murphies.fst(p) - murphies.snd(p); };
      let a = murphies.curry(f);
      let b = murphies.uncurry(a);
      let c = murphies.curry(b);
      (a(100)(15) === b(p) === c(100)(15)).should.be.true;
    });
  });
  describe('#fromArrayToTuple()', function() {
    it('should create a new tuple from the values of an array.', function() {
      let p = murphies.fromArrayToTuple([100, 2]);
      p.should.have.properties({'1': 100, '2': 2});
    });
  });
  describe('#fromTupleToArray()', function() {
    it('should create a new array from the values of a tuple.', function() {
      let p = murphies.tuple(1, 2);
      let arr = murphies.fromTupleToArray(p);
      arr.should.eql([1, 2]);
    });
    it('should throw a type error if a value other than a tuple is passed as an argument.', function() {
      murphies.fromTupleToArray.bind(null).should.throw();
      murphies.fromTupleToArray.bind(null, {}).should.throw();
    });
  });
  describe('#fst()', function() {
    it('should return the first element of a tuple.', function() {
      let p = murphies.tuple(1, 2);
      murphies.fst(p).should.equal(1);
    });
    it('should throw a type error if a value other than a tuple is passed as an argument.', function() {
      murphies.fst.bind(null, unit).should.throw();
      murphies.fst.bind(null, {}).should.throw();
      murphies.fst.bind(null).should.throw();
    });
  });
  describe('#isEmpty(Tuple)', function() {
    it('should return true if the tuple is unit, the empty tuple.', function() {
      let p1 = murphies.tuple();
      let p2 = murphies.tuple(1, 2);
      murphies.isEmpty(p1).should.be.true;
      murphies.isEmpty(p2).should.be.false;
    });
  });
  describe('#isTuple()', function() {
    it('should return true when the value is a tuple.', function() {
      let p = murphies.tuple(1, 2);
      murphies.isTuple(p).should.be.true;
    });
    it('should return false when the value is not a tuple.', function() {
      let p = [1, 2];
      murphies.isTuple(p).should.be.false;
    });
    it('should return false when the value is unit, the empty tuple.', function() {
      murphies.isTuple(unit).should.be.false;
    });
  });
  describe('#snd()', function() {
    it('should return the second element of a tuple.', function() {
      let p = murphies.tuple(1, 2);
      murphies.snd(p).should.equal(2);
    });
    it('should throw a type error if a value other than a tuple is passed as an argument.', function() {
      murphies.snd.bind(null, unit).should.throw();
      murphies.snd.bind(null, {}).should.throw();
      murphies.snd.bind(null).should.throw();
    });
  });
  describe('#swap()', function() {
    it('should swap the values of a tuple and return a new tuple.', function() {
      let p = murphies.tuple(1, 2);
      murphies.swap(p).should.have.properties({'1': 2, '2': 1});
    });
    it('should throw a type error if a value other than a tuple is passed as an argument.', function() {
      murphies.swap.bind(null, unit).should.throw();
      murphies.swap.bind(null, {}).should.throw();
      murphies.swap.bind(null).should.throw();
    });
  });
  describe('#tuple()', function() {
    it('should return a new tuple if at least two values are passed as arguments.', function() {
      let p = murphies.tuple(1, 2);
      p.should.have.properties({'1': 1, '2': 2});
    });
    it('should return the argument value if only one value is passed as an argument.', function() {
      let p = murphies.tuple(7);
      p.should.equal(7);
    });
    it('should return unit (an empty tuple) if no values are passed as arguments.', function() {
      let p = murphies.tuple();
      p.should.have.properties({'0': null});
    });
  });
  describe('#uncurry()', function() {
    let f = function(p) { return murphies.fst(p) - murphies.snd(p); };
    let p = murphies.tuple(10, 2);
    let curried = murphies.curry(f);
    let uncurried = murphies.uncurry(curried);
    it('should return a function when no argument is applied as the second argument to the applied function.', function() {
      uncurried.should.be.a.Function;
    });
    it('should return a value when all arguments are applied.', function() {
      uncurried(p).should.equal(8);
      uncurried = murphies.uncurry(curried)(p);
      uncurried.should.equal(8);
    });
  });
  describe('#typeOf()', function() {
    it('should return a string representing the type of the tuple, e.g. "(1, 2)" is type "(number, number)."', function() {
      let p = murphies.tuple(1, 2);
      murphies.type(p).should.equal(`(number,number)`);
    });
  });
  describe('#isEq(Tuple, Tuple)', function() {
    let a = murphies.tuple(1, 2);
    let b = murphies.tuple(1, 2);
    let c = murphies.swap(b);
    let d = murphies.fromArrayToTuple([2, 1]);
    it('should return true if the two tuples are the same type and equal in values.', function() {
      murphies.isEq(a, b).should.be.true;
      murphies.isEq(c, d).should.be.true;
    });
    it('should return false if the two tuples are the same type but not equal in values.', function() {
      murphies.isEq(a, c).should.be.false;
      murphies.isEq(b, d).should.be.false;
    });
    it('should throw a type error if the two tuples are not the same type.', function() {
      let p = murphies.tuple(1, 2, 3);
      murphies.isEq.bind(null, a, p).should.throw();
    });
  });
  describe('#isNotEq(Tuple, Tuple)', function() {
    let a = murphies.tuple(1, 2);
    let b = murphies.tuple(1, 2);
    let c = murphies.swap(b);
    let d = murphies.fromArrayToTuple([2, 1]);
    it('should return true if the two tuples are the same type but not equal in values.', function() {
      murphies.isNotEq(a, c).should.be.true;
      murphies.isNotEq(b, d).should.be.true;
    });
    it('should return false if the two tuples are the same type and equal in values.', function() {
      murphies.isNotEq(a, b).should.be.false;
      murphies.isNotEq(c, d).should.be.false;
    });
    it('should throw a type error if the two tuples are not the same type.', function() {
      let p = murphies.tuple(1, 2, 3);
      murphies.isNotEq.bind(null, a, p).should.throw();
    });
  });
  describe('#compare(Tuple, Tuple)', function() {
    let a = murphies.tuple(1, 2);
    let b = murphies.tuple(1, 3);
    let c = murphies.swap(a);
    let d = murphies.fromArrayToTuple([2, 1]);
    it('should return the Ordering of the tuples if they are the same type.', function() {
      murphies.compare(a, b).should.equal(murphies.LT);
      murphies.compare(c, b).should.equal(murphies.GT);
      murphies.compare(c, d).should.equal(murphies.EQ);
    });
    it('should throw a type error if the two tuples are not the same type.', function() {
      let p = murphies.tuple(1, 2, 3);
      murphies.compare.bind(null, a, p).should.throw();
    });
    it('should work with the other Ordering functions.', function() {
      murphies.lessThan(a, b).should.be.true;
      murphies.lessThan(c, d).should.be.false;
      murphies.lessThan(b, a).should.be.false;
      murphies.lessThanOrEqual(a, b).should.be.true;
      murphies.lessThanOrEqual(c, d).should.be.true;
      murphies.lessThanOrEqual(b, a).should.be.false;
      murphies.greaterThan(b, a).should.be.true;
      murphies.greaterThan(c, d).should.be.false;
      murphies.greaterThan(a, b).should.be.false;
      murphies.greaterThanOrEqual(b, a).should.be.true;
      murphies.greaterThanOrEqual(c, d).should.be.true;
      murphies.greaterThanOrEqual(a, b).should.be.false;
      murphies.max(a, b).should.have.properties({'1': 1, '2': 3});
      murphies.min(b, c).should.have.properties({'1': 1, '2': 3});
    });
  });
  describe('#unit', function() {
    it('should be the empty tuple.', function() {
      unit.should.have.properties({'0': null});
    });
    it('isTuple(unit) should return false.', function() {
      murphies.isTuple(unit).should.be.false;
    });
  });
});
