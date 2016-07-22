const m = require('maryamyriameliamurphies');

const hello = str => { return m.print(`Hello ${str}!`), m.just(str); }

const str = m.just(`world`);

const sayHello = () => {
  m.Do(str)
   .flatMap(hello)
   .inject(`monad`)
   .flatMap(hello);
}

sayHello();
