import m from '../distribution/index';

describe('List', function() {
  it('should return [Object List] when cast to a string.', function() {
    let list = m.list(1, 2);
    list.toString().should.equal(`[Object List]`);
  });
});
