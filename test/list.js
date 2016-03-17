import murphies from '../distribution/index';

describe('List', function() {
  it('should return [Object List] when cast to a string.', function() {
    let list = murphies.list(1, 2);
    list.toString().should.equal(`[Object List]`);
  });
});
