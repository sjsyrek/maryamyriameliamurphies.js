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

describe(`List`, function() {
  it(`should return [Object List] when cast to a string.`, function() {
    let list = m.list(1, 2);
    list.toString().should.equal(`[Object List]`);
  });
});
