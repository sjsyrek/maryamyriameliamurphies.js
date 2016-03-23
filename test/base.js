import m from '../distribution/index';

describe(`Base`, function() {
  describe(`dataType()`, function() {
    it(`should return the constructor function of an object`, function() {
      m.dataType(0).should.be.a.Function();
      let lst = m.list(1,2,3);
      m.dataType(lst).should.be.a.Function();
    });
  });
  describe(`type()`, function() {
    it(`should return the type of an object`, function() {
      let a = m.tuple(1, 2);
      let b = m.tuple(3, 4, 5);
      let c = `text`;
      let d = m.tuple(c, 10);
      m.type(a).should.equal(`(number,number)`);
      m.type(b).should.equal(`(number,number,number)`);
      m.type(c).should.equal(`string`);
      m.type(d).should.equal(`(string,number)`);
      m.type(0).should.equal(`number`);
    });
  });
  describe(`typeCheck()`, function() {
    let t1 = m.tuple(1,2);
    let t2 = m.tuple(2,3);
    let lst = m.list(1,2,3);
    it(`should return true if two objects are the same type`, function() {
      m.typeCheck(t1, t2).should.be.true;
    });
    it(`should return false if two objects are not the same type`, function() {
      m.typeCheck(t1, lst).should.be.false;
    });
  });
  describe(`partial()`, function() {
    let f = (x, y) => {
      let p = (x, y) => x * y;
      return m.partial(p, x, y);
    }
    let partial = f(5);
    let applied = f(5, 5);
    it(`should return a function if not all arguments are applied`, function() {
      partial.should.be.a.Function();
    });
    it(`should return a value if all arguments are applied`, function() {
      applied.should.equal(25);
    });
  });
  describe(`$()`, function() {
    it(`should compose two functions and return the result`, function() {
      let addTen = x =>  x + 10;
      let multHund = x => x * 100;
      let addTwenty = x => addTen(10);
      let h = (x, y) => {
        let p = (x, y) => x / y;
        return m.partial(p, x, y);
      }
      let divByTen = h(10);
      m.$(addTen)(multHund)(10).should.equal(1010);
      m.$(addTen)(multHund, 10).should.equal(1010);
      m.$(multHund)(addTen)(10).should.equal(2000);
      m.$(multHund)(addTen, 10).should.equal(2000);
      m.$(addTen)(addTwenty)().should.equal(30);
      m.$(divByTen)(multHund)(10).should.equal(0.01);
    });
  });
  describe(`flip()`, function() {
    let f = (x, y) => x - y;
    let flipped = m.flip(f);
    it(`should return a function`, function() {
      flipped.should.be.a.Function();
    });
    it(`should return the value of the original function with its arguments flipped`, function() {
      f(100, 50).should.equal(50);
      flipped(100, 50).should.equal(-50);
    });
  });
  describe(`id()`, function() {
    it(`should return whatever is passed as an argument`, function() {
      m.id(1).should.equal(1);
      m.id(`A`).should.equal(`A`);
    });
  });
  describe(`constant()`, function() {
    it(`should return the value of the second argument applied to it`, function() {
      m.constant(2, 3).should.equal(2);
      let multHund = x => x * 100;
      let c = (x, y) => m.$(m.constant(x))(multHund)(y);
      c(5, 10).should.equal(5);
    });
  });
  describe(`until()`, function() {
    it(`should yield the result of applying a function to a value until a predicate is true`, function() {
      let pred = x => x > 10;
      let f = x => x + 1;
      let u = m.until(pred, f);
      u(1).should.equal(11);
    });
  });
  describe(`and()`, function() {
    it(`should return true if both of two values are true`, function() {
      m.and(true, true).should.be.true;
    });
    it(`should return false if either of two values is false`, function() {
      m.and(true, false).should.be.false;
      m.and(false, true).should.be.false;
    });
  });
  describe(`or()`, function() {
    it(`should return true if either of two values are true`, function() {
      m.or(true, false).should.be.true;
      m.or(false, true).should.be.true;
      m.or(true, true).should.be.true;
    });
    it(`should return false if both of two values are false`, function() {
      m.or(false, false).should.be.false;
    });
  });
  describe(`not()`, function() {
    it(`should return false if a value is true`, function() {
      m.not(true);
    });
    it(`should return true if a value is false`, function() {
      m.not(false);
    });
  });
  describe(`even()`, function() {
    it(`should return true if a value is even`, function() {
      m.even(2).should.be.true;
    });
    it(`should return false if a value is not even`, function() {
      m.even(3).should.be.false;
    });
  });
  describe(`odd()`, function() {
    it(`should return true if a value is odd`, function() {
      m.even(1).should.be.true;
    });
    it(`should return false if a value is not odd`, function() {
      m.even(2).should.be.false;
    });
  });
  describe(`isEmpty()`, function() {
    it(`should return true if a list, tuple, or array is empty`, function() {
      m.isEmpty([]).should.be.true;
      m.isEmpty(m.emptyList).should.be.true;
      m.isEmpty(m.unit).should.be.true;
    });
    it(`should return false if a list, tuple, or array is not empty`, function() {
      m.isEmpty([[]]).should.be.false;
      m.isEmpty(m.list(m.emptyList)).should.be.false;
      m.isEmpty(m.tuple(1,2)).should.be.false;
      m.isEmpty(m.tuple(m.unit, m.unit)).should.be.false;
    });
  });
  describe(`show()`, function() {
    it(`should display the value of an object as a string`, function() {
      let lst = m.list(1,2,3);
      let tup = m.tuple(1,2);
      m.show(lst).should.equal(`[1:2:3:[]]`);
      m.show(tup).should.equal(`(1,2)`);
    });
  });
  describe(`print()`, function() {
    it(`should display the value of an object on the console`, function() {
      let lst = m.list(1,2,3);
      let tup = m.tuple(1,2);
      m.print(lst);
      m.print(tup);
    });
  });
  // Eq
  describe(`isEq()`, function() {
    let a = 5;
    let b = 5;
    let c = 10;
    let d = `text`;
    it(`should return true if the two objects passed as arguments are equatable and equal in value`, function() {
      m.isEq(a, b).should.be.true;
    });
    it(`should return false if the two objects passed as arguments are equatable and not equal in value`, function() {
      m.isEq(a, c).should.be.false;
    });
    it(`should throw a type error if the two objects passed as arguments are not the same type`, function() {
      m.isEq.bind(null, a, d).should.throw();
    });
  });
  describe(`isNotEq()`, function() {
    let a = 5;
    let b = 5;
    let c = 10;
    let d = `text`;
    it(`should return true if the two objects passed as arguments are equatable and not equal in value`, function() {
      m.isEq(a, c).should.be.true;
    });
    it(`should return false if the two objects passed as arguments are equatable and equal in value`, function() {
      m.isEq(a, b).should.be.false;
    });
    it(`should throw a type error if the two objects passed as arguments are not the same type`, function() {
      m.isEq.bind(null, a, d).should.throw();
    });
  });
  // Ord
  describe(`compare()`, function() {
    let a = 1;
    let b = 2;
    let c = 2;
    let d = 2;
    it(`should return the Ordering of two values if they are the same type`, function() {
      m.compare(a, b).should.equal(m.LT);
      m.compare(b, a).should.equal(m.GT);
      m.compare(b, c).should.equal(m.EQ);
    });
    it(`should throw a type error if two tuples are not the same type`, function() {
      m.compare.bind(null, c, `text`).should.throw();
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
