import murphies from '../distribution/index';

describe('List', function() {
  it('should return [Object List] when cast to a string.', function() {
    let list = murphies.list(1, 2);
    list.toString().should.equal(`[Object List]`);
  });
  it('should return a list string, e.g. "(1, 2)", as its value.', function() {
    let p = murphies.tuple(1, 2);
    p.valueOf().should.equal(`(1, 2)`);
  });
  describe('#curry()', function() {
    let f = function subtract(p) { return x - y; };
    let x = 10;
    let y = 2;
    it('should return itself when a function is not applied as the first argument.', function() {
      murphies.curry().should.equal(murphies.curry);
    });
});
