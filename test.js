var Eq = require('./eq.js');
var Ord = require('./ord.js');
var Tuple = require('./tuple.js');

// Tuple tests
var p1 = new Tuple(1, 2);
var p2 = new Tuple(3, 4);
var p3 = Tuple.from([1, 2]);
var p4 = Tuple.swap(p2);
var subtract = (a, b) => a - b;


//var curried = Tuple.curry(subtract, 100, 98);
//var uncurried = Tuple.uncurry(curried, tup4);
console.log(`Tuples:
             p1.typeOf():       ${p1.typeOf()} //
             p1.fst:            ${p1.fst}
             p1.snd:            ${p1.snd}
             p3.valueOf():      ${p3.valueOf()}
             Tuple.isTuple(p4): ${Tuple.isTuple(p4)}
             Eq(p1, p3):        ${Eq(p1, p3)}`);
//console.log(uncurried());