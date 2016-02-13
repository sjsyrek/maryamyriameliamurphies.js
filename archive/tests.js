import {Eq, Ord, Tuple} from '../source/index';
// import {Eq} from './eq';
// import {Ord} from './ord';
// import {Tuple} from './tuple';

// let Eq = mary.Eq;
// let Ord = mary.Ord;
// let Tuple = mary.Tuple;

// Tuple tests
let p1 = Tuple.tuple(1, 2);
let p2 = Tuple.tuple(3, 4);
let p3 = Tuple.from([1, 2]);
let p4 = p2.swap();
let p5 = Tuple.tuple(10, 20, 30, 40, 50);
let subtract = tuple => tuple.fst - tuple.snd;
let add = (a, b) => a + b;
let curried = Tuple.curry(subtract, 100, 98);
let p6 = Tuple.tuple(100, 98);
let uncurried = p6.uncurry(add);

console.log(`
  Tuples:
  p1.typeOf():       ${p1.typeOf()} == (number, number)
  p1.fst:            ${p1.fst} == 1
  p1.snd:            ${p1.snd} == 2
  p3.valueOf():      ${p3.valueOf()} == (1, 2)
  Tuple.isTuple(p4): ${Tuple.isTuple(p4)} == true
  Eq(p1, p3):        ${Eq.is(p1, p3)} == true
  Eq(p1, p2):        ${Eq.is(p1, p2)} == false
  curried():         ${curried()} == 2
  uncurried():       ${uncurried()} == 198

`);

try {
  console.log(`Eq(p1, p5):       ${Eq.is(p1, p5)}`);
} catch(e) {
  console.log(e); // *** Exception: (number, number) is not the same type as (number, number, number, number, number).
}
