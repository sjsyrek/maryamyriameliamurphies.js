import m from '../distribution/index';

let partial = m.partial;
let $ = m.$;
let type = m.type;
let dataType = m.dataType;
let just = m.just;
let tuple = m.tuple;
let unit = m.unit;
let list = m.list;
let emptyList = m.emptyList;

describe(`Base`, function() {
  let tup = tuple(1, 2);
  let lst = list(1, 2, 3);
  describe(`dataType()`, function() {
    it(`should return the constructor function of an object`, function() {
      dataType(0).should.be.a.Function();
      dataType(lst).should.be.a.Function();
    });
  });
  describe(`type()`, function() {
    let b = tuple(3, 4, 5);
    let c = `text`;
    let d = tuple(c, 10);
    it(`should return the type of an object`, function() {
      type(tup).should.equal(`(number,number)`);
      type(b).should.equal(`(number,number,number)`);
      type(c).should.equal(`string`);
      type(d).should.equal(`(string,number)`);
      type(0).should.equal(`number`);
    });
  });
  describe(`typeCheck()`, function() {
    let typeCheck = m.typeCheck;
    let tup2 = tuple(2, 3);
    it(`should return true if two objects are the same type`, function() {
      typeCheck(tup, tup2).should.be.true;
    });
    it(`should return false if two objects are not the same type`, function() {
      typeCheck(tup, lst).should.be.false;
    });
  });
  describe(`partial()`, function() {
    let f = (x, y) => {
      let p = (x, y) => x * y;
      return partial(p, x, y);
    }
    let p = f(5);
    let a = f(5, 5);
    it(`should return a function if not all arguments are applied`, function() {
      p.should.be.a.Function();
    });
    it(`should return a value if all arguments are applied`, function() {
      a.should.equal(25);
    });
  });
  describe(`$()`, function() {
    it(`should compose two functions and return the result`, function() {
      let addTen = x =>  x + 10;
      let multHund = x => x * 100;
      let addTwenty = x => addTen(10);
      let h = (x, y) => {
        let p = (x, y) => x / y;
        return partial(p, x, y);
      }
      let divByTen = h(10);
      $(addTen)(multHund)(10).should.equal(1010);
      $(addTen)(multHund, 10).should.equal(1010);
      $(multHund)(addTen)(10).should.equal(2000);
      $(multHund)(addTen, 10).should.equal(2000);
      $(addTen)(addTwenty)().should.equal(30);
      $(divByTen)(multHund)(10).should.equal(0.01);
    });
  });
  describe(`flip()`, function() {
    let flip = m.flip;
    let f = (x, y) => x - y;
    let flipped = flip(f);
    it(`should return a function`, function() {
      flipped.should.be.a.Function();
    });
    it(`should return the value of the original function with its arguments flipped`, function() {
      f(100, 50).should.equal(50);
      flipped(100, 50).should.equal(-50);
    });
  });
  describe(`id()`, function() {
    let id = m.id;
    it(`should return whatever is passed as an argument`, function() {
      id(1).should.equal(1);
      id(`A`).should.equal(`A`);
    });
  });
  describe(`constant()`, function() {
    let constant = m.constant;
    let multHund = x => x * 100;
    let c = (x, y) => $(constant(x))(multHund)(y);
    it(`should return the value of the second argument applied to it`, function() {
      constant(2, 3).should.equal(2);
      c(5, 10).should.equal(5);
    });
  });
  describe(`until()`, function() {
    let until = m.until;
    let pred = x => x > 10;
    let f = x => x + 1;
    let u = until(pred, f);
    it(`should yield the result of applying a function to a value until a predicate is true`, function() {
      u(1).should.equal(11);
    });
  });
  describe(`and()`, function() {
    let and = m.and;
    it(`should return true if both of two values are true`, function() {
      and(true, true).should.be.true;
    });
    it(`should return false if either of two values is false`, function() {
      and(true, false).should.be.false;
      and(false, true).should.be.false;
    });
  });
  describe(`or()`, function() {
    let or = m.or;
    it(`should return true if either of two values are true`, function() {
      or(true, false).should.be.true;
      or(false, true).should.be.true;
      or(true, true).should.be.true;
    });
    it(`should return false if both of two values are false`, function() {
      or(false, false).should.be.false;
    });
  });
  describe(`not()`, function() {
    let not = m.not;
    it(`should return false if a value is true`, function() {
      not(true);
    });
    it(`should return true if a value is false`, function() {
      not(false);
    });
  });
  describe(`even()`, function() {
    let even = m.even;
    it(`should return true if a value is even`, function() {
      even(2).should.be.true;
    });
    it(`should return false if a value is not even`, function() {
      even(3).should.be.false;
    });
  });
  describe(`odd()`, function() {
    let odd = m.odd;
    it(`should return true if a value is odd`, function() {
      m.odd(1).should.be.true;
    });
    it(`should return false if a value is not odd`, function() {
      m.odd(2).should.be.false;
    });
  });
  describe(`isEmpty()`, function() {
    let isEmpty = m.isEmpty;
    it(`should return true if a list, tuple, or array is empty`, function() {
      isEmpty([]).should.be.true;
      isEmpty(emptyList).should.be.true;
      isEmpty(unit).should.be.true;
    });
    it(`should return false if a list, tuple, or array is not empty`, function() {
      isEmpty([[]]).should.be.false;
      isEmpty(list(emptyList)).should.be.false;
      isEmpty(tup).should.be.false;
      isEmpty(tuple(unit, unit)).should.be.false;
      isEmpty(lst).should.be.false;
    });
  });
  describe(`show()`, function() {
    let show = m.show;
    it(`should display the value of an object as a string`, function() {
      show(lst).should.equal(`[1:2:3:[]]`);
      show(tup).should.equal(`(1,2)`);
    });
  });
  describe(`print()`, function() {
    let print = m.print;
    it(`should display the value of an object on the console`, function() {
      print(lst);
      print(tup);
    });
  });
  // Eq
  describe(`isEq()`, function() {
    let isEq = m.isEq;
    let a = 5;
    let b = 5;
    let c = 10;
    let d = `text`;
    it(`should return true if the two objects passed as arguments are equatable and equal in value`, function() {
      isEq(a, b).should.be.true;
    });
    it(`should return false if the two objects passed as arguments are equatable and not equal in value`, function() {
      isEq(a, c).should.be.false;
    });
    it(`should throw a type error if the two objects passed as arguments are not the same type`, function() {
      isEq.bind(null, a, d).should.throw();
    });
  });
  describe(`isNotEq()`, function() {
    let isNotEq = m.isNotEq;
    let a = 5;
    let b = 5;
    let c = 10;
    let d = `text`;
    it(`should return true if the two objects passed as arguments are equatable and not equal in value`, function() {
      isNotEq(a, c).should.be.true;
    });
    it(`should return false if the two objects passed as arguments are equatable and equal in value`, function() {
      isNotEq(a, b).should.be.false;
    });
    it(`should throw a type error if the two objects passed as arguments are not the same type`, function() {
      isNotEq.bind(null, a, d).should.throw();
    });
  });
  // Ord
  describe(`compare()`, function() {
    let compare = m.compare;
    let a = 1;
    let b = 2;
    let c = 2;
    let d = 2;
    it(`should return the Ordering of two values if they are the same type`, function() {
      compare(a, b).should.equal(m.LT);
      compare(b, a).should.equal(m.GT);
      compare(b, c).should.equal(m.EQ);
    });
    it(`should throw a type error if two tuples are not the same type`, function() {
      compare.bind(null, c, `text`).should.throw();
    });
    it(`should work with the other Ord functions`, function() {
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
      m.max(a, b).should.equal(2);
      m.min(a, b).should.equal(1);
    });
  });
});
