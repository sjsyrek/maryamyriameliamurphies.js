function subsequences(as) {
  if (isList(as) === false) { return error.listError(as, subsequences); }
  function nonEmptySubsequences(as) {
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let f = ys => cons(ys)(cons(cons(x)(ys)))(r);
    return cons(list(x))(foldr(f, emptyList, nonEmptySubsequences(xs)));
  }
  return cons(emptyList)(nonEmptySubsequences(as));
}

let abc = fromStringToList('abc');
//console.log(show(subsequences(abc)))

// -- > subsequences "abc" == ["","a","b","ab","c","ac","bc","abc"]
// subsequences            :: [a] -> [[a]]
// subsequences xs         =  [] : nonEmptySubsequences xs

// -- | The 'nonEmptySubsequences' function returns the list of all subsequences of the argument,
// --   except for the empty list.
// --
// -- > nonEmptySubsequences "abc" == ["a","b","ab","c","ac","bc","abc"]

// nonEmptySubsequences         :: [a] -> [[a]]
// nonEmptySubsequences []      =  []
// nonEmptySubsequences (x:xs)  =  [x] : foldr f [] (nonEmptySubsequences xs)
//   where f ys r = ys : (x : ys) : r
f = cons(ys)(cons(cons(x)(ys)))(r)




// TODO: reimplement Ordering as a Monoid
// TODO: replace (where possible) class property values with closures
// TODO: replace pseudo-list comprehensions with maps and filters
// TODO: implement error checking for lazy functions that don't do it, because it's hard to track down errors otherwise

/*
 * maryamyriameliamurphies.js
 *
 * @name index.js
 * @fileOverview
 * maryamyriameliamurphies.js is a library of Haskell-style morphisms ported to JavaScript
 * using ECMAScript 2015 syntax.
 *
 * See also:
 *
 * - [casualjs](https://github.com/casualjs/f)
 * - [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
 *
 * Reading the code:
 *
 * I implement each Haskell data type as an ES2015 class, hewing as closely as I can to the
 * Haskell original but with reasonable concessions to JavaScript idiom. Type classes are
 * represented by static class methods. Since the class definitions are not exported, these
 * methods remain private, thus providing a limited amount of type checking that cannot be
 * easily hacked by accident. For example, data types that are equatable (with ===) will work
 * with the isEq() function if they define an eq() static function or are natively equatable.
 * For the sake of those interested, I introduce each function with the syntax of its Haskell
 * original. My hope is that most of the functions are otherwise self-documenting. The public
 * API for this library is specified, following CommonJS style, in a default object at the
 * bottom of this file.
 */

// Base

let defines = (...methods) => a => methods.every(m => Reflect.has(dataType(a), m));

const error = {
  emptyList: (a, f) => throwError(`'${a}' is an empty list, but '${f.name}' expects a non-empty list.`),
  listError: (a, f) => throwError(`'${a}' is type '${a.constructor.name}' but function '${f.name}' expects a list.`),
  nothing: (a, f) => throwError(`'${f}' returned Nothing from argument '${a}'`),
  rangeError: (n, f) => throwError(`Index '${n}' is out of range in function '${f.name}'.`),
  returnError: (f1, f2) => throwError(`Unexpected return value from function '${f1.name}' called by function '${f2.name}'.`),
  tupleError: (p, f) => throwError(`'${p}' is type '${p.constructor.name}' but function '${f.name}' expects a tuple.`),
  typeError: (a, f) => throwError(`'${type(a) === 'function' ? `${type(a)} ${a.name}` : a}' is not a valid argument to function '${f.name}'.`),
  typeMismatch: (a, b, f) => throwError(`Arguments '${a}' and '${b}' to function '${f.name}' are not the same type.`)
};

function throwError(e) { throw Error(`*** Error: ${e}`); }

class Type {
  static type(a) { return dataType(a) === this ? this.name : error.typeError(a, this.type); }
  toString() { return this.valueOf(); }
  typeOf() { return dataType(this).name; }
  valueOf() { return this; }
}

// function partial(f, x, y) {
//   if (x === undefined) { return error.noArguments(f); }
//   if (y === undefined) { return f.bind(f, x); }
//   return f.call(f, x, y)
// }

function partial(f, ...as) {
  if (isEmpty(as)) { return f.call(); }
  let a = as.shift();
  if (a === undefined) { return f; }
  let p = f.bind(f, a);
  return partial(p, ...as);
}

function print(a) { return console.log(show(a)); }

function constant(a, b) {
  let p = (a, b) => a;
  return partial(p, a, b);
}

function dataType(a) { return a.constructor; }

/**
 * Determine whether two objects are the same type, returning true if they are and false otherwise.
 * This is a limited form of type checking for this library.
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 * @private
 */
function typeCheck(a, b) {
  let p = (a, b) => {
    if (a instanceof Type && b instanceof Type) { return dataType(a).type(a) === dataType(b).type(b); }
    if (dataType(a) === dataType(b)) { return true; }
    return false;
  }
  return partial(a, b);
}

/**
 * Compose two functions. In Haskell, f.g = \x -> f(g x), or the composition of two functions,
 * f and g is the same as applying the result of g to f, or f(g(x)) for a given argument x.
 * This pattern can't exactly be reproduced in JavaScript, since the dot operator denotes
 * namespace membership, and custom operators are not available. However, Haskell also provides
 * the $ operator, which simply binds functions right to left, allowing parentheses to be
 * omitted: f $ g $ h x = f (g (h x)). We still can't do this in JavaScript, but why not borrow
 * the $ for semantic consistency? Sorry, jQuery. Note that an argument need not be supplied
 * to the rightmost function, in which case $ returns a new function to which you can bind an
 * argument later. The leftmost function, however, must be a pure function, as its argument is
 * the value returned by the rightmost function. Example:
 * {@code let addTen = x => x + 10;
 *        let multHund = x => x * 100;
 *        let addTwenty = x => addTen(10);
 *        $(addTen)(multHund)(10)           // 1010
 *        $(addTen)(multHund, 10)           // 1010
 *        $(multHund)(addTen)(10)           // 2000
 *        $(multHund)(addTen, 10)           // 2000
 *        $(addTen)(addTwenty)()            // 30
 * }
 * @param {function()} f - The outermost function to compose.
 * @return {function()} - The composed function, called only if a value is bound to f.
 */
function $(f) { return (g, x) => x === undefined ? x => f(g(x)) : f(g(x)); }

function flip(f) { return (x, y) => y === undefined ? y => f(y, x) : f(y, x); }

/**
 * The identity function.
 * @param {*} a - Any value.
 * @return {*} a - The same value;
 */
function id(a) { return a; }

function isEmpty(a) {
  if (isList(a)) { return a === emptyList; } // a.head === null
  if (isTuple(a)) { return false; }
  if (a === unit) { return true; }
  if (Array.isArray(a)) { return a.length === 0; }
  return error.typeError(a, isEmpty);
}

/**
 * Display the value of an object as a string.
 * @param {*} a - The object to show.
 * @return {string} - The value as a string.
 */
function show(a) { return a instanceof Tuple ? `(${Object.values(a).map(e => e.valueOf())})` : a.valueOf(); }

/**
 * Return the type of any object as specified by this library or its primitive type.
 * @param {*} a - Any object.
 * @return {string}
 */
function type(a) { return a instanceof Type ? a.typeOf() : typeof a; }

function until(pred, f, x) {
  let p = (pred, f, a) => pred(x) ? x : until(pred, f, f(x));
  return partial(p, pred, f, x);
}

function and(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, and); }
    if (type(b) !== `boolean`) { return error.typeError(b, and); }
    return true && b ? b : false;
  }
  return partial(p, a, b);
}

function or(a, b) {
  let p = (a, b) => {
    if (type(a) !== `boolean`) { return error.typeError(a, or); }
    if (type(b) !== `boolean`) { return error.typeError(b, or); }
    return a ? true : b;
  }
  return partial(p, a, b);
}

function not(a) {
  if (a === true) { return false; }
  if (a === false) { return true; }
  return error.typeError(a, not);
}

// Eq (from Prelude)

let Eq = defines(`isEq`);

/**
 * Compare two objects for equality. Both objects must be instances of a class that implements
 * an eq() static method.
 * (==), (/=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 */
function isEq(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) { return Eq(a) ? dataType(a).isEq(a, b) : a === b; }
    return error.typeMismatch(a, b, isEq);
  }
  return partial(p, a, b);
}

function isNotEq(a, b) {
  let p = (a, b) => !isEq(a, b);
  return partial(p, a, b);
}

// Ord (from Prelude)

let Ord = defines(`isEq`, `compare`);

/**
 * Compare two objects for ordering. Both values must be instances of a class that implements
 * an ord() static method. Only a single comparison is required to determine the precise
 * ordering of two objects.
 * compare :: a -> a -> Ordering
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {string} - Ordering.
 */
function compare(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) {
      if (Ord(a)) { return dataType(a).compare(a, b); }
      if (isEq(a, b)) { return Ordering.EQ; }
      if (a < b) { return Ordering.LT; }
      if (a > b) { return Ordering.GT; }
    }
    return error.typeMismatch(a, b, compare);
  }
  return partial(p, a, b);
}

/**
 * (<), (<=), (>), (>=) :: a -> a -> Bool
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {boolean}
 */
function lessThan(a, b) {
  let p = (a, b) => compare(a, b) === Ordering.LT;
  return partial(p, a, b);
}

function lessThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== Ordering.GT;
  return partial(p, a, b);
}

function greaterThan(a, b) {
  let p = (a, b) => compare(a, b) === Ordering.GT;
  return partial(p, a, b);
}

function greaterThanOrEqual(a, b) {
  let p = (a, b) => compare(a, b) !== Ordering.LT;
  return partial(p, a, b);
}

/**
 * Return the higher or lower in value of two objects.
 * max, min :: a -> a -> a
 * @param {*} a - Any object.
 * @param {*} b - Any object.
 * @return {Object} - a or b.
 */
function max(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? b : a;
  return partial(p, a, b);
}

function min(a, b) {
  let p = (a, b) => lessThanOrEqual(a, b) ? a : b;
  return partial(p, a, b);
}

/**
 * A data type for representing the relationship of two values.
 * @const {Object}
 */
const Ordering = {
  EQ: 'EQ', // a === b
  LT: 'LT', // a < b
  GT: 'GT'  // a > b
}
Object.freeze(Ordering);

// instance Monoid Ordering where
//         mempty         = EQ
//         LT `mappend` _ = LT
//         EQ `mappend` y = y
//         GT `mappend` _ = GT

// Monoid (from Prelude)

let Monoid = defines(`mempty`, `mappend`);

function mempty(a) { return Monoid(a) ? dataType(a).mempty(a) : error.typeError(a, mempty); }

function mappend(a, b) {
  let p = (a, b) => {
    if (typeCheck(a, b)) { return Monoid(a) ? dataType(a).mappend(a, b) : error.typeError(a, mappend); }
    return error.typeMismatch(a, b, mappend);
  }
  return partial(p, a, b);
}

function mconcat(a) { return foldr(mappend, mempty(a), a); }

// Functor

let Functor = defines(`fmap`);

// fmap id  ==  id
// fmap (f . g)  ==  fmap f . fmap g

// function f(x) { return x * 11; }
// function g(x) { return x * 100; }
// let g1 = fmap(g, t1)
// let f1 = fmap(f, g1)
// let m = fmap(f(fmap(g, t1)))
// function $$(f) { return (g, x) => partial(f, g, x); }
// let f2 = fmap(f);
// let g2 = fmap(g);
// let mm = $(f2)(g2)(t1)

function fmap(f, a) {
  let p = (f, a) => Functor(a) ? dataType(a).fmap(f, a) : error.typeError(a, fmap);
  return partial(p, f, a);
}

function fmapReplaceBy(a, b) {
  let p = (a, b) => fmap(constant(a), b);
  return partial(p, a, b);
}

// Applicative (let p all these multiparameter functions)

let Applicative = defines(`fmap`, `pure`, `ap`);

function pure(f, a) {
  let p = (f, a) => Applicative(f) ? dataType(f).pure(a) : error.typeError(f, pure);
  return partial(p, f, a);
}

function ap(f, a) { // <*>
  let p = (f, a) => {
    if (Applicative(f) === false) { error.typeError(f, ap); }
    if (Applicative(a) === false) { error.typeError(a, ap); }
    return dataType(a).ap(f, a);
  }
  return partial(p, f, a);
}

function apFlip(f, a, b) { // <**>
  let p = (f, a, b) => liftA2(flip(f), a, b);
  return partial(p, f, a, b);
}

function then(a1, a2) { // *>
  let p = (a1, a2) => liftA2(constant(id), a1, a2);
  return partial(p, a1, a2);
}

function skip(a1, a2) { // <*
  let p = (a1, a2) => liftA2(constant, a1, a2);
  return partial(p, a1, a2);
}

function liftA(f, a) {
  let p = (f, a) => ap(dataType(a).pure(f))(a);
  return partial(p, f, a);
}

function liftA2(f, a, b) {
  let p = (f, a, b) => ap(fmap(f, a))(b);
  return partial(p, f, a, b);
}

function liftA3(f, a, b, c) {
  let p = (f, a, b, c) => ap(ap(fmap(f, a))(b))(c);
  return partial(p, f, a, b, c);
}

// Monad

let Monad = defines(`fmap`, `pure`, `ap`, `bind`);

function inject(m, a) { // return
  let p = (m, a) => Monad(m) ? dataType(m).pure(a) : error.typeError(m, inject);
  return partial(p, m, a);
}

function bind(m, f) { // >>=
  let p = (m, f) => Monad(m) ? dataType(m).bind(m, f) : error.typeError(m, bind);
  return partial(p, m, f);
}

function chain(m, f) {  // >>
  let p = (m, f) => return Monad(m) ? then(f, m) : error.typeError(m, chain);
  return partial(p, m, f);
}

function bindFlip(f, m) { // =<<
  let p = (f, m) => bind(m, f);
  return partial(p, f, m);
}

function join(m) { return Monad(m) ? bind(m, id) : error.typeError(m, join); }

function liftM(f, m) {
  let p = (f, m) => Monad(m) ? dataType(m).fmap(f, m) : error.typeError(m, liftM);
  return partial(p, f, m)
}

class DoBlock {
  constructor(m) { this.m = m; }
  inject(a) { return Do(dataType(this.m).pure(a)); }
  bind(f) { return Do(bind(this.m, f)); }
  then(a) { return Do(chain(this.m, a)); }
  valueOf() { return `${dataType(this.m).name} >>= ${this.m.valueOf()}`; }
}

function Do(m) { return Monad(m) ? new DoBlock(m) : error.typeError(Do, m); }

// Foldable

let Foldable = defines(`foldr`);

function fold(a) { return foldMap(id, a); }

function foldMap(f, a) {
  let p = (f, a) => Monoid(a) ? $(mconcat)(fmap(f))(a) : error.typeError(a, foldMap);
  return partial(p, f, a);
}

function foldr(f, z, t) {
  let p = (f, z, t) => { return Foldable(t) ? dataType(t).foldr(f, z, t) : error.typeError(t, foldr); }
  return partial(p, f, z, t);
}

// Traversable

let Traversable = defines(`fmap`, `foldr`, `traverse`);

function traverse(f, a) {
  let p = (f, a) => { return Traversable(a) ? dataType(a).traverse(f, a) : error.typeError(a, traverse); }
  return partial(p, f, a);
}

// I think these are wrong, because the functions should take traversable types that contain monads, no just monads?:

function mapM(f, m) {
  let p = (f, m) => Monad(m) ? traverse(f, dataType(m).bind(f)) : error.typeError(m, mapM);
  return partial(p, f, m);
}

function mapM_(f, m) {
  let p = (f, m) => Monad(m) ? foldr(chain(m, f), inject(m, unit), m); : error.typeError(m, mapM_);
  return partial(p, f, m);
}

function sequence(m) { return Monad(m) ? traverse(id, a) : error.typeError(a, sequence); }

function sequence_(m) { return Monad(m) ? foldr(chain(m, f), inject(m, unit), m) : error.typeError(m, sequence_); }

// Morphism (fix)

class Morphism extends Type {
  constructor(f) {
    super();
    this.bind = f;
  }
  static mempty(a) { return this.mempty; }
  static mappend(f, g, x) { return x => mappend(f.bind(x), g.bind(x)); }
  static fmap(g, m) { return x => $(m.bind)(g)(x); } // might be backward
  static pure(a) { return constant(a); }
  static ap(f, g) { return x => f(x).g.bind(g, x); } // I have no idea
  toString() { return this.bind; }
  typeOf() { return `morphism`; }
  valueOf() { return this.toString(); }
}

// instance Applicative ((->) a) where
//     pure = const
//     (<*>) f g x = f x (g x)

function functor(f) { return new Morphism(f); }

// Maybe
// derives Eq and Ord
class Maybe extends Type {
  constructor(a) {
    super();
    if (a !== undefined) { this.value = a; }
  }
  // Eq
  static isEq(a, b) {
    if (isNothing(a) && isNothing(b)) { return true; }
    if (isNothing(a) || isNothing(b)) { return false; }
    return isEq(a.value, b.value);
  }
  // Ord
  static compare(a, b) {
    if (isEq(a, b)) { return Ordering.EQ; }
    if (isNothing(a)) { return Ordering.LT; }
    if (isNothing(b)) { return Ordering.GT; }
    return compare(a.value, b.value);
  }
  // Monoid
  static mempty(a) { return Nothing; }
  static mappend(m1, m2) {
    if (isNothing(m1)) { return m2; }
    if (isNothing(m2)) { return m1; }
    return Reflect.construct(Maybe, [mappend(m1.value, m2.value)]);
  }
  // Foldable
  static foldr(f, z, m) { return isNothing(m) ? z : f(m.value, z); }
  // Traversable
  static traverse(f, m) { return isNothing(m) ? pure(this, Nothing) : fmap(maybe, f(x)); }
  // Functor
  static fmap(f, m) { return isNothing(m) ? Nothing : Reflect.construct(Maybe, [f(m.value)]); }
  // Applicative
  static pure(m) { return just(m); }
  static ap(f, m) { return isNothing(f) ? Nothing : fmap(f.value, m); }
  // Monad
  static bind(m, f) { return isNothing(m) ? Nothing : f(m.value); }
  // Prototype
  toString() { return this.toString(); }
  typeOf() { return `Maybe ${this.value === undefined ? 'Nothing' : type(this.value)}`; }
  valueOf() { return this.value === undefined ? `Nothing` : `Just ${this.value}`; }
}

let Nothing = new Maybe();

function just(a) { return new Maybe(a); }

function maybe(n, f, m) {
  let p = (n, f, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, maybe); }
    isNothing(m) ? n : f(x.value);
  }
  return partial(p, n, f, m);
}

function isMaybe(a) { return dataType(m) === Maybe; }

function isJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isJust); }
  return isNothing(m) ? false : true;
}

function isNothing(m) {
  if (isMaybe(m) === false) { return error.typeError(m, isNothing); }
  return m === Nothing ? true : false;
}

function fromJust(m) {
  if (isMaybe(m) === false) { return error.typeError(m, fromJust); }
  return isNothing(m) ? error.nothing(m, fromJust) : m.value; // yuck
}

function fromMaybe(d, m) {
  let p = (d, m) => {
    if (isMaybe(m) === false) { return error.typeError(m, fromMaybe); }
    return isNothing(m) ? d : m.value;
  }
  return partial(p, d, m);
}

function maybeToList(m) {
  if (isMaybe(m) === false) { return error.typeError(m, maybeToList); }
  return isNothing(m) ? emptyList : list(m.value);
}

function listToMaybe(as) {
  if (isList(as) === false) { return error.listError(as, listToMaybe); }
  return isEmpty(as) ? Nothing : just(as.head);
}

function catMaybes(as) {
  if (isList(as) === false) { return error.listError(as, catMaybes); }
  if (isMaybe(as.head) === false) { return error.typeError(m, catMaybes); }
  let pred = as => isJust(x);
  return filter(pred, as);
}

function mapMaybe(f, as) {
  let p = (f, as) => {
    if (isList(as) === false) { return error.listError(as, mapMaybe); }
    if (isEmpty(as)) { return emptyList; }
    if (isMaybe(as.head) === false) { return error.typeError(m, mapMaybe); }
    let x = as.head;
    let xs = as.tail;
    let r = f(x);
    let rs = mapMaybe.bind(this, f, xs);
    if (isNothing(r)) { return rs(); }
    if (isJust(r)) { return cons(r)(rs); }
    return error.returnError(f, mapMaybe);
  }
  return partial(p, f, as);
}

// Tuple (from Data.Tuple)

/**
 * A data constructor for a tuple. Unlike Haskell, which provides a separate constructor
 * for every possible number of tuple values, this class will construct tuples of any size.
 * Empty Tuples, however, are a special type called {@code unit}, and single values passed to this
 * constructor will be returned unmodified. In order for them be useful, it is recommended
 * that you create Tuples with primitive values. Note that this class is not exposed as part
 * of the maryamyriameliamurphies.js API, as new Tuples should be instantiated with the
 * {@code tuple()} function and not by using {@code new Tuple()} directly.
 * @class
 * @param {*} values - The values to put into the tuple.
 */
class Tuple extends Type {
  constructor(...as) {
    super();
    if (as.length === 0) { this[0] = null; }
    as.forEach((v, i) => this[i + 1] = v );
  }
  static type(a) { return dataType(a) === this ? a.typeOf() : error.typeError(a, this.type); }
  // Eq
  static isEq(a, b) { return fromTupleToArray(a).every((a, i) => a === fromTupleToArray(b)[i]); }
  // Ord
  static compare(a, b) {
    if (this.isEq(a, b)) { return Ordering.EQ; }
    let i = 1;
    while (Reflect.has(a, i)) {
      if (a[i] < b[i]) { return Ordering.LT; }
      if (a[i] > b[i]) { return Ordering.GT; }
      i += 1;
    }
  }
  // Monoid
  static mempty(a) { return unit; }
  static mappend(a, b) { return Reflect.construct(Tuple, [mappend(fst(a), fst(b)), mappend(snd(a), snd(b))]); }
  // Foldable
  static foldr(f, acc, p) { return f(snd(p), acc); }
  // Traversable
  static traverse(f, p) { return fmap(tuple.bind(this, fst(p)), f(snd(p))); }
  // Functor
  static fmap(f, p) { return Reflect.construct(Tuple, [fst(p), f(snd(p))]); }
  // Applicative
  static pure(p) { return Reflect.construct(Tuple, [mempty(p), snd(p)]); }
  static ap(uf, vx) { return Reflect.construct(Tuple, [mappend(fst(uf), fst(vx)), snd(uf)(snd(vx))]); }
  // Prototype
  toString() { return `[Object Tuple]`; }
  typeOf() { return `(${Reflect.ownKeys(this).map(key => type(this[key])).join(',')})`; }
  valueOf() {
    if (this === unit) { return `()`; }
    return `(${Reflect.ownKeys(this).map(key => type(this[key]) === 'string' ? `'${this[key]}'` : this[key].valueOf()).join(',')})`;
  }
}

/**
 * The {@code unit} object: an empty tuple. Note that {@code isTuple(unit) === false}.
 * @const {Tuple}
 */
const unit = new Tuple();

/**
 * Create a new tuple from any number of values. A single value will be returned unaltered,
 * and {@code unit}, the empty tuple, will be returned if no arguments are passed.
 * Usage: tuple(10, 20) -> {"1": 10, "2": 20}
 * @param {...*} values - The values to put into a tuple.
 * @return {Tuple} - A new tuple.
 */
function tuple(...as) {
  let [x, y] = as;
  if (x === undefined) return unit;
  if (y === undefined) return x;
  return new Tuple(...as);
}

/**
 * Convert an uncurried function to a curried function. For example, a function that expects
 * a tuple as an argument can be curried into a function that binds one value and returns another
 * function that binds the other value. This function can then be called with or without arguments
 * bound, or with arguments partially applied. Currying and uncurrying are transitive. Example:
 * {@code let f = function(p) { return fst(p) - snd(p); };
 *        let a = curry(f);       // a === f()()
 *        let b = a(100);         // b === f(100)()
 *        let c = b(15);          // c === f(100)(15) === 85
 *        let p = tuple(100, 15);
 *        let A = curry(f);       // A(100)(15) === 85
 *        let B = uncurry(A);     // B(p) === 85
 *        let C = curry(B);       // A(100)(15) === C(100)(15) === 85
 * }
 * @param {function()} f - The function to curry.
 * @param {*} x - Any value, the first value of the new tuple argument.
 * @param {*} y - Any value, the second value of the new tuple argument.
 * @return {function()} - The curried function.
 */
function curry(f, x, y) {
  if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
  if (y === undefined) { return curry(f)(x); }
  return curry(f)(x)(y);
}

/**
 * Convert an array into a tuple. Returns {@code unit}, the empty tuple, if no arguments or
 * arguments other than an array are passed. This function will not work on array-like objects.
 * @param {Array<*>} array - The array to convert.
 * @return {Tuple} - The new tuple.
 */
function fromArrayToTuple(a) {
  return Array.isArray(a) ? Reflect.construct(Tuple, Array.from(a)) : error.typeError(a, fromArrayToTuple);
}

/**
 * Convert a tuple into an array.
 * @param {Tuple} p - The tuple to convert.
 * @return {Array<*>} - The new array.
 */
function fromTupleToArray(p) {
  return isTuple(p) ? Reflect.ownKeys(p).map(key => p[key]) : error.tupleError(p, fromTupleToArray);
}

/**
 * Extract the first value of a tuple.
 * @param {Tuple} p - A tuple.
 * @return {*} - The first value of the tuple.
 */
function fst(p) { return isTuple(p) ? p[1] : error.tupleError(p, fst); }

/**
 * Determine whether an object is a tuple. The {@code unit}, or empty tuple, returns false.
 * @param {*} a - Any object.
 * @return {boolean} - True if the object is a tuple.
 */
function isTuple(a) { return a instanceof Tuple && a !== unit ? true : false; }

/**
 * Extract the second value of a tuple.
 * @param {Tuple} p - A tuple.
 * @return {*} - The second value of the tuple.
 */
function snd(p) { return isTuple(p) ? p[2] : error.tupleError(p, snd); }

/**
 * Swap the values of a tuple. This function does not modify the original tuple.
 * @param {Tuple} p - A tuple.
 * @return {Tuple} - A new tuple, with the values of the first tuple swapped.
 */
function swap(p) { return isTuple(p) ? Reflect.construct(Tuple, [snd(p), fst(p)]) : error.tupleError(p, swap); }

/**
 * Convert a curried function to a single function that takes a tuple as an argument.
 * Mostly useful for uncurrying functions previously curried with the {@code curry()}
 * function from this library. This will not work if any arguments are bound to the
 * curried function (it would resulted in a type error in Haskell). Currying and
 * uncurrying are transitive. Example:
 * {@code let f = function(p) { return fst(p) - snd(p); };
 *        let p = tuple(100, 15); //
 *        let a = curry(f);       // a === f()()
 *        let b = uncurry(a);     // b === f()
 *        let c = b(p);           // c === f({`1`: 100, `2`: 15}) === 85
 *        let d = uncurry(a, p)   // d === 85
 * }
 * @param {function()} f - The function to uncurry.
 * @param {Tuple} p - The tuple from which to extract argument values for the function.
 * @return {function()} - The uncurried function.
 */
function uncurry(f, p) {
  if (p === undefined) { return p => isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry); }
  return isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
}

// List (from Data.List)

// Basic functions

// need to type check lists in static functions

class List extends Type {
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    if (head !== undefined) { this.head = head; }
    if (tail !== undefined) { this.tail = tail; }
  }
  // Eq
  static isEq(a, b) {
    return typeCheck(a.head, b.head) ? fromListToArray(a).every((a, i) =>
    a === fromListToArray(b)[i]) : error.typeMismatch(a.head, b.head, this.isEq);
  }
  // Ord
  static compare(a, b) {
    if (isEmpty(a) && isEmpty(b)) { return Ordering.EQ; }
    if (isEmpty(a) && isEmpty(b) === false) { return Ordering.LT; }
    if (isEmpty(a) === false && isEmpty(b)) { return Ordering.GT; }
    if (compare(a.head, b.head) === Ordering.EQ) { return compare(a.tail, b.tail)}
    return compare(a.head, b.head);
  }
  // Monoid
  static mempty(a) { return emptyList; }
  static mappend(a, b) { return listAppend(a, b); }
  // Foldable
  static foldr(f, acc, as) {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return acc; }
    if (typeCheck(acc, as.head) === false) { return error.typeMismatch(acc, as.head, foldr); }
    let x = as.head;
    let xs = as.tail;
    return f(x, foldr(f, acc, xs));
  }
  // Traversable
  static traverse(f, as) { return isEmpty(as) ? pure(this, emptyList) : ap(fmap(cons)(f(as.head)))(traverse(f, as.tail)); }
  // Functor
  static fmap(f, as) { return map(f, as); }
  // Applicative
  static pure(a) { return list(a); }
  static ap(fs, as) { return isEmpty(fs) ? emptyList : listAppend(fmap(fs.head, as))(ap(fs.tail, as)); }
  // Monad
  static bind(xs, f) { return concat(map(f, xs)); }
  // Prototype
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(this.head)}]`; }
  valueOf() { //return this.head === null ? `[]` : `${this.head}:${this.tail.valueOf()}`;
    let value = list => isEmpty(list) ? `[]` : `${list.head}:${value(list.tail)}`;
    return `[${type(this) === `[string]` ? fromListToString(this) : value(this)}]`;
  }
}

const emptyList = new List();

function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }

function concat(xss) {
  if (isList(xss)) {
    if (isEmpty(xss)) { return emptyList; }
    let x = xss.head;
    let xs = xss.tail;
    return isList(x) ? listAppend(x, concat(xs)) : error.listError(x, concat);
  }
  return error.listError(xss, concat);
}

function cons(x, xs) {
  let p = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return Reflect.construct(List, [x, emptyList]); }
    if (xs instanceof List === false) { return error.listError(xs, cons); }
    if (typeCheck(x, head(xs))) { return new List(x, xs); }
    return error.typeError(head(xs), cons);
  }
  return partial(p, x, xs);
}

function fromArrayToList(a) { return Array.isArray(a) ? list(...a) : error.typeError(a, fromArrayToList); }

function fromListToArray(as) {
  if (isList(as)) { return isEmpty(as) ? [] : [as.head].concat(fromListToArray(as.tail)); }
  return error.listError(as, fromListToArray);
}

function fromListToString(as) {
  if (isList(as)) { return fromListToArray(as).join(``); }
  return error.listError(as, fromListToString);
}

function fromStringToList(str) {
  if (typeof str === 'string') { return fromArrayToList(str.split(``)); }
  return error.typeError(as, fromStringToList);
}

function head(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head; }
  return error.listError(as, head);
}

function init(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, init); }
    return isEmpty(as.tail) ? emptyList : cons(as.head)(init(as.tail));
  }
  return error.listError(as, init);
}

function isList(a) { return a instanceof List ? true : false; }

function last(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, last); }
    return isEmpty(as.tail) ? as.head : last(as.tail);
  }
  return error.listError(as, last);
}

function length(as) {
  let lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(xs.tail, n + 1);
  return isList(as) ? lenAcc(as, 0) : error.listError(as, length);
}

function listAppend(as, bs) {
  let p = (as, bs) => {
    if (isList(as) === false ) { return error.listError(as, listAppend); }
    if (isList(bs) === false ) { return error.listError(bs, listAppend); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(as.head)(listAppend(as.tail)(bs)); }
    return error.typeMismatch(type(head(as)), type(head(bs)), listAppend);
  }
  return partial(p, as, bs);
}

function head(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head; }
  return error.listError(as, head);
}

function tail(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, tail) : as.tail; }
  return error.listError(as, tail);
}

function reverse(as) {
  let rev = (as, a) => isEmpty(as) ? a : rev(as.tail, cons(as.head)(a));
  return rev(as, emptyList);
}

function splitAt(n, as) {
  let p = (n, as) => tuple(take(n, as), drop(n, as));
  return partial(p, n, as);
}

function takeWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, takeWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let test = pred(x);
    if (test === true) { return cons(x)(takeWhile(pred, xs)); }
    if (test === false) { return emptyList; }
    return error.listError(as, takeWhile);
  }
  return partial(p, pred, as);
}

function dropWhile(pred, as) {
  let p = (pred, as) => {
    if (isList(as) === false) { return error.listError(as, dropWhile); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let test = pred(x);
    if (test === true) { return dropWhile(pred, xs); }
    if (test === false) { return as; }
    return error.listError(as, dropWhile);
  }
  return partial(p, pred, as);
}

function span(pred, as) {
  let p = (pred, as) => tuple(takeWhile(pred, as), dropWhile(pred, as));
  return partial(p, pred, as);
}

function spanNot(pred, as) {
  let p = (pred, as) => span($(not)(pred), as);
  return partial(p, pred, as);
}

//uncons

// List transformations

function map(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return emptyList; }
    //let x = as.head;
    let x = !f(as.head) ? f.bind(f, as.head) : f(as.head);
    let xs = as.tail;
    //return cons(f(x))(map(f)(xs));
    return cons(x)(map(f)(xs));
  }
  return partial(p, f, as);
}

// use this in places where I'm mimicking list comprehensions
function filter(f, as) {
  let p = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, filter); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    if (f(x) === true) { return cons(x)(filter(f, xs)); }
    if (f(x) === false) { return filter(f, xs); }
    return error.returnError(f, filter);
  }
  return partial(p, f, as);
}

function intersperse(sep, as) {
  let p = (sep, as) => {
    if (isList(as) === false) { return error.listError(as, intersperse); }
    if (typeCheck(sep, as.head) === false) { return error.typeMismatch(sep, as.head, intersperse); }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(x)(prependToAll(sep, xs));
  }
  function prependToAll(sep, xs) { return isEmpty(xs) ? emptyList : cons(sep)(cons(xs.head)(prependToAll(sep, xs.tail))); }
  return partial(p, sep, as);
}

function intercalate(xs, xss) { return concat(intersperse(xs, xss)); }

function transpose(xss) {
  if (isList(xss) === false) { return error.listError(xss, transpose); }
  if (isEmpty(xss)) { return emptyList; }
  let head = xss.head;
  let tail = xss.tail;
  if (isList(head) === false) { return error.listError(head, transpose); }
  if (isEmpty(head)) { return transpose(tail); }
  let x = head.head;
  let xs = head.tail;
  let headComp = fromArrayToList(fromListToArray(tail).map(xs => xs.head));
  let tailComp = fromArrayToList(fromListToArray(tail).map(xs => xs.tail));
  return cons(cons(x)(headComp))(transpose(cons(xs)(tailComp)));
}

// Sublists

function drop(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, drop); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return drop(n - 1)(xs);
  }
  return partial(p, n, as);
}

function take(n, as) {
  let p = (n, as) => {
    if (isList(as) === false) { return error.listError(as, take); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    return cons(x)(take(n - 1)(xs));
  }
  return partial(p, n, as);
}

// Indexing functions

function index(as, n) {
  let p = (as, n) => {
    if (isList(as) === false ) { return error.listError(as, index); }
    if (n < 0) { return error.rangeError(n, index); }
    if (isEmpty(as)) { return error.rangeError(n, index); }
    let x = as.head;
    let xs = as.tail;
    if (n === 0) { return x; }
    return index(xs)(n - 1);
  }
  return partial(p, as, n);
}

// Zipping and unzipping lists

function zip(as, bs) {
  let p = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, zip); }
    if (isList(bs) === false) { return error.listError(bs, zip); }
    if (isEmpty(as)) { return emptyList; }
    if (isEmpty(bs)) { return emptyList; }
    let x = as.head;
    let xs = as.tail;
    let y = bs.head;
    let ys = bs.tail;
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return partial(p, as, bs);
}

// Ordered lists



// API

export default {
  $: $,
  id: id,
  isEmpty: isEmpty,
  show: show,
  type: type,
  isEq: isEq,
  isNotEq: isNotEq,
  compare: compare,
  lessThan: lessThan,
  lessThanOrEqual: lessThanOrEqual,
  greaterThan: greaterThan,
  greaterThanOrEqual: greaterThanOrEqual,
  max: max,
  min: min,
  unit: unit,
  tuple: tuple,
  curry: curry,
  fromArrayToTuple: fromArrayToTuple,
  fromTupleToArray: fromTupleToArray,
  fst: fst,
  isTuple: isTuple,
  snd: snd,
  swap: swap,
  uncurry: uncurry,
  emptyList: emptyList,
  list: list,
  cons: cons,
  fromArrayToList: fromArrayToList,
  fromListToArray: fromListToArray,
  fromListToString: fromListToString,
  fromStringToList: fromStringToList,
  head: head,
  init: init,
  isList: isList,
  last: last,
  length: length,
  listAppend: listAppend,
  tail: tail,
  map: map,
  drop: drop,
  take: take,
  index: index,
  zip: zip
}
