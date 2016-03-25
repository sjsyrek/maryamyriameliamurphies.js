/**
 * maryamyriameliamurphies.js
 *
 * @name tuple.js
 * @fileOverview
 * Tuple data type
 */

 /** @module maryamyriameliamurphies.js/source/tuple */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Tuple

 /**
  * A data constructor for a `Tuple`. Unlike Haskell, which provides a separate constructor
  * for every possible number of tuple values, this class will construct tuples of any size.
  * Empty tuples, however, are a special type called `unit`, and single values passed to
  * this constructor will be returned unmodified. In order for them be useful, it is recommended
  * that you create tuples with primitive values.
  * @extends Type
  * @private
  */
 class Tuple extends Type {
   /**
    * Create a new `Tuple`.
    * @param {...*} values - The values to construct into a `Tuple`.
    */
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
     if (this.isEq(a, b)) { return EQ; }
     let i = 1;
     while (Reflect.has(a, i)) {
       if (a[i] < b[i]) { return LT; }
       if (a[i] > b[i]) { return GT; }
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
  * The `unit` object, an empty tuple. Note that `isTuple(unit) === false`.
  * @const {Tuple}
  */
 const unit = new Tuple();

 /**
  * Create a new `Tuple` from any number of values. A single value will be returned unaltered,
  * and `unit`, the empty tuple, will be returned if no arguments are passed.
  * @param {...*} as - The values to put into a `Tuple`.
  * @returns {Tuple} - A new `Tuple`.
  * @example
  * tuple(10,20); // => (10,20)
  */
 function tuple(...as) {
   let [x, y] = as;
   if (x === undefined) return unit;
   if (y === undefined) return x;
   return new Tuple(...as);
 }

 /**
  * Extract the first value of a tuple.
  * @param {Tuple} p - A `Tuple`.
  * @returns {*} - The first value of the tuple.
  * @example
  * let tup = tuple(10,20);
  * fst(tup);                // => 10
  */
 function fst(p) { return isTuple(p) ? p[1] : error.tupleError(p, fst); }

 /**
  * Extract the second value of a tuple.
  * @param {Tuple} p - A `Tuple`.
  * @returns {*} - The second value of the tuple.
  * let tup = tuple(10,20);
  * snd(tup);                // => 20
  */
 function snd(p) { return isTuple(p) ? p[2] : error.tupleError(p, snd); }

 /**
  * Convert an uncurried function to a curried function. For example, a function that expects
  * a tuple as an argument can be curried into a function that binds one value and returns another
  * function that binds the other value. This function can then be called with or without arguments
  * bound, or with arguments partially applied. Currying and uncurrying are transitive.
  * @param {Function} f - The function to curry.
  * @param {*} x - Any value, the first value of the new tuple argument.
  * @param {*} y - Any value, the second value of the new tuple argument.
  * @returns {Function} - The curried function.
  * @example
  * let f = function(p) { return fst(p) - snd(p); };
  * let a = curry(f);       // a === f()()
  * let b = a(100);         // b === f(100)()
  * let c = b(15);          // c === f(100)(15) === 85
  * let p = tuple(100,15);
  * let A = curry(f);       // A(100)(15) === 85
  * let B = uncurry(A);     // B(p) === 85
  * let C = curry(B);       // A(100)(15) === C(100)(15) === 85
  */
 function curry(f, x, y) {
   if (x === undefined) { return x => y => f.call(f, tuple(x, y)); }
   if (y === undefined) { return curry(f)(x); }
   return curry(f)(x)(y);
 }

 /**
  * Convert a curried function to a single function that takes a tuple as an argument.
  * Mostly useful for uncurrying functions previously curried with the `curry` function.
  * This will not work if any arguments are bound to the curried function (it would
  * result in a type error in Haskell). Currying and uncurrying are transitive.
  * @param {Function} f - The function to uncurry.
  * @param {Tuple} p - The tuple from which to extract argument values for the function.
  * @returns {Function} - The uncurried function.
  * @example
  * let f = function(p) { return fst(p) - snd(p); };
  * let p = tuple(100,15);
  * let a = curry(f);       // a === f()()
  * let b = uncurry(a);     // b === f()
  * let c = b(p);           // c === f({`1`:100,`2`:15}) === 85
  * let d = uncurry(a, p)   // d === 85
  */
 function uncurry(f, p) {
   if (p === undefined) { return p => isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry); }
   return isTuple(p) ? f.call(f, fst(p)).call(f, snd(p)) : error.tupleError(p, uncurry);
 }

 /**
  * Swap the values of a tuple. This function does not modify the original tuple.
  * @param {Tuple} p - A `Tuple`.
  * @returns {Tuple} - A new `Tuple`, with the values of the first tuple swapped.
  * @example
  * let tup = tuple(10,20);
  * swap(tup);               // => (20,10)
  */
 function swap(p) { return isTuple(p) ? Reflect.construct(Tuple, [snd(p), fst(p)]) : error.tupleError(p, swap); }

 /**
  * Determine whether an object is a `Tuple`. The empty tuple, `unit`, returns `false`.
  * @param {*} a - Any object.
  * @returns {boolean} - `true` if the object is a `Tuple` and `false` otherwise.
  */
 function isTuple(a) { return a instanceof Tuple && a !== unit ? true : false; }

 /**
  * Convert an array into a `Tuple`. Returns `unit`, the empty tuple, if no arguments or
  * arguments other than an array are passed. This function will not work on array-like objects.
  * @param {Array<*>} array - The array to convert.
  * @returns {Tuple} - The new `Tuple`.
  * @example
  * let arr = [10,20];
  * fromArrayToTuple(arr); // => (10,20)
  */
 function fromArrayToTuple(a) {
   return Array.isArray(a) ? Reflect.construct(Tuple, Array.from(a)) : error.typeError(a, fromArrayToTuple);
 }

 /**
  * Convert a `Tuple` into an array.
  * @param {Tuple} p - The `Tuple` to convert.
  * @returns {Array<*>} - The new array.
  * @example
  * let tup = tuple(10,20);
  * fromTupleToArray(tup);  // => [10,20]
  */
 function fromTupleToArray(p) {
   return isTuple(p) ? Reflect.ownKeys(p).map(key => p[key]) : error.tupleError(p, fromTupleToArray);
 }
