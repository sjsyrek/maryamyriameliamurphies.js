import m from '../distribution/index';

describe(`Do`, function() {
  it(`should allow for chaining of monadic functions`, function() {
    let monad = m.just(10);
    let f = x => m.just(x * 2);
    let g = x => m.just(x - 1);
    m.Do(monad).bind(f).bind(g).valueOf().should.equal(`Maybe number >>= Just 19`);
    m.Do(monad).bind(f).chain(monad).bind(g).valueOf().should.equal(`Maybe number >>= Just 9`);
    let lst = m.list(1,2,3);
    let h = x => m.list(x + 1);
    let n = x => m.list(x * 2);
    m.Do(lst).bind(h).bind(n).valueOf().should.equal(`[number] >>= [4:6:8:[]]`);
    m.Do(lst).bind(h).chain(lst).bind(n).valueOf().should.equal(`[number] >>= [2:4:6:2:4:6:2:4:6:[]]`);
    let put = x => {
      m.show(x);
      return m.just(x);
    }
    m.Do(monad)
    .bind(put)                          // => 10
    .bind(f)
    .bind(put)                          // => 20
    .chain(h)
    .bind(put)                          // => 10
    .bind(g)
    .bind(put)                          // => 9
    .bind(f)
    .bind(put)
    .valueOf().should.equal(18);
  });
});
