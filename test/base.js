import murphies from '../distribution/index';

describe('Base', function() {
  describe('#$()', function() {
    it('should compose two functions and return the result.', function() {
      let addTen = x =>  x + 10;
      let multHund = x => x * 100;
      let addTwenty = x => addTen(10);
      murphies.$(addTen)(multHund)(10).should.equal(1010);
      murphies.$(addTen)(multHund, 10).should.equal(1010);
      murphies.$(multHund)(addTen)(10).should.equal(2000);
      murphies.$(multHund)(addTen, 10).should.equal(2000);
      murphies.$(addTen)(addTwenty)().should.equal(30);
    });
  });
  describe('#id()', function() {
    it('should return whatever is passed as an argument.', function() {
      murphies.id(1).should.equal(1);
      murphies.id(`A`).should.equal(`A`);
    });
  });
  describe('#typeOf()', function() {
    it('should return the type of an object.', function() {
      let a = murphies.tuple(1, 2);
      let b = murphies.tuple(3, 4, 5);
      let c = `text`;
      let d = murphies.tuple(c, 10)
      murphies.typeOf(a).should.equal(`(number, number)`);
      murphies.typeOf(b).should.equal(`(number, number, number)`);
      murphies.typeOf(c).should.equal(`string`);
      murphies.typeOf(d).should.equal(`(string, number)`);
    });
  });
  describe('#isEq()', function() {
    it('should return true if the two objects passed as arguments are equatable and equal in value.', function() {
      let a = 5;
      let b = 5;
      let c = 10;
      murphies.isEq(a, b).should.be.true;
      murphies.isEq(a, c).should.be.false;
    });
    it('should throw a type error if the two objects passed as arguments are not the same type.', function() {
      let a = 5;
      let b = 'text';
      murphies.isEq.bind(null, a, b).should.throw(`I expected a value of type 'number' but I got text.`);
    });
  });
  describe('#isNotEq()', function() {
    it('should return true if the two objects passed as arguments are equatable and not equal in value.', function() {
      let a = 5;
      let b = 5;
      let c = 10;
      murphies.isNotEq(a, b).should.be.false;
      murphies.isNotEq(a, c).should.be.true;
    });
    it('should throw a type error if the two objects passed as arguments are not the same type.', function() {
      let a = 5;
      let b = 'text';
      murphies.isNotEq.bind(null, a, b).should.throw(`I expected a value of type 'number' but I got text.`);
    });
  });
  describe('#compare()', function() {
    let a = 1;
    let b = 2;
    let c = 2;
    let d = 2;
    it('should return the Ordering of two values if they are the same type.', function() {
      murphies.compare(a, b).should.equal('LT');
      murphies.compare(b, a).should.equal('GT');
      murphies.compare(b, c).should.equal('EQ');
    });
    it('should throw a type error if the two tuples are not the same type.', function() {
      murphies.compare.bind(null, c, 'text').should.throw(`I expected a value of type 'number' but I got text.`);
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
      murphies.max(a, b).should.equal(2);
      murphies.min(a, b).should.equal(1);
    });
  });
});
