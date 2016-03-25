import m from '../distribution/index';

let just = m.just;
let Do = m.Do;
let tuple = m.tuple;
let list = m.list;
let print = m.print;

describe(`Do()`, function() {
  let j = just(10);
  let doubleJust = x => just(x * 2);
  let minusOne = x => just(x - 1);
  let lst = list(1,2,3);
  let plusOne = x => list(x + 1);
  let doubleList = x => list(x * 2);
  let put = x => {
    print(x);
    return just(x);
  }
  let b1 = Do(j).bind(doubleJust).bind(minusOne);
  let b2 = Do(j).bind(doubleJust).chain(j).bind(minusOne);
  let b3 = Do(lst).bind(plusOne).bind(doubleList);
  let b4 = Do(lst).bind(plusOne).chain(lst).bind(doubleList);
  let b5 =
  Do(j)
  .bind(put)                          // => 10
  .bind(doubleJust)
  .bind(put)                          // => 20
  .chain(j)
  .bind(put)                          // => 10
  .bind(minusOne)
  .bind(put)                          // => 9
  .bind(doubleJust)
  .bind(put);                         // => 18
  it(`should allow for chaining of monadic functions`, function() {
    b1.valueOf().should.equal(`Maybe number >>= Just 19`);
    b2.valueOf().should.equal(`Maybe number >>= Just 9`);
    b3.valueOf().should.equal(`[number] >>= [4:6:8:[]]`);
    b4.valueOf().should.equal(`[number] >>= [2:4:6:2:4:6:2:4:6:[]]`);
    b5.valueOf().should.equal(`Maybe number >>= Just 18`);
  });
});
