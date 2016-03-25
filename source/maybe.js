/**
 * maryamyriameliamurphies.js
 *
 * @name maybe.js
 * @fileOverview
 * Maybe data type
 */

 /** @module maryamyriameliamurphies.js/source/maybe */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Maybe

 /**
  * The `Maybe` type encapsulates an optional value. A value of type `Maybe a` either contains a value of
  * type `a` (represented as `Just a`), or it is empty (represented as `Nothing`). Using Maybe
  * is a good way to deal with errors or exceptional cases without resorting to drastic measures such as
  * throwing an error. That's how the Haskell docs define it, and I don't think I can do a better job.
  * @extends Type
  * @private
  */
 class Maybe extends Type {
   /**
    * Create a new `Maybe`, which represents either a value or `Nothing`.
    * @param {*} a - The value to wrap in a `Maybe`.
    */
   constructor(a) {
     super();
     if (a !== undefined) { this.value = () => a; }
   }
   // Eq
   static isEq(a, b) {
     if (isNothing(a) && isNothing(b)) { return true; }
     if (isNothing(a) || isNothing(b)) { return false; }
     return isEq(a.value(), b.value());
   }
   // Ord
   static compare(a, b) {
     if (isEq(a, b)) { return EQ; }
     if (isNothing(a)) { return LT; }
     if (isNothing(b)) { return GT; }
     return compare(a.value(), b.value());
   }
   // Monoid
   static mempty(a) { return Nothing; }
   static mappend(m1, m2) {
     if (isNothing(m1)) { return m2; }
     if (isNothing(m2)) { return m1; }
     return Reflect.construct(Maybe, [mappend(m1.value(), m2.value())]);
   }
   // Foldable
   static foldr(f, z, m) { return isNothing(m) ? z : f(m.value(), z); }
   // Traversable
   static traverse(f, m) { return isNothing(m) ? pure(m, Nothing) : fmap(maybe, f(x)); }
   // Functor
   static fmap(f, m) { return isNothing(m) ? Nothing : Reflect.construct(Maybe, [f(m.value())]); }
   // Applicative
   static pure(m) { return just(m); }
   static ap(f, m) { return isNothing(f) ? Nothing : fmap(f.value(), m); }
   // Monad
   static bind(m, f) { return isNothing(m) ? Nothing : f(m.value()); }
   // Prototype
   typeOf() { return `Maybe ${this.value === undefined ? 'Nothing' : type(this.value())}`; }
   valueOf() { return this.value === undefined ? `Nothing` : `Just ${this.value()}`; }
 }

 /**
  * `Nothing` is the absence of a value, the opposite of `Just` for a `Maybe` object. Since all
  * nothings are the same nothing, there is only one `Nothing` (c.f. Wallace Stevens).
  * @const {Maybe}
  */
 const Nothing = new Maybe();

 /**
  * A constructor for a `Maybe` value. Returns `Nothing` if the value is `undefined`, `null`, or `NaN`.
  * @param {*} a - The value to wrap in a `Maybe`.
  * @returns {Maybe} - `Just a` or `Nothing`.
  */
 function just(a) { return a === undefined || a === null || a !== a ? Nothing : new Maybe(a); }

 /**
  * The `maybe` function takes a default value, a function, and a `Maybe` value. If the `Maybe` value is
  * `Nothing`, the function returns the default value. Otherwise, it applies the function to the value
  * inside the `Just` and returns the result.
  * Haskell> maybe :: b -> (a -> b) -> Maybe a -> b
  * @param {*} n - The default value to return if `m` is `Nothing`.
  * @param {Function} f - The function to apply to the value inside `m` if it is a `Just`.
  * @param {Maybe} m - A `Maybe`.
  * @returns {*} - `f` applied to the value contained in the `Just` or `n` if the `Maybe` is `Nothing`.
  * @example
  * let m1 = just(100);
  * let m2 = just(null);
  * let f = x => x * 10;
  * maybe(0, f, m1);     // => 1000
  * maybe(0, f, m2);     // => 0
  */
 function maybe(n, f, m) {
   let p = (n, f, m) => {
     if (isMaybe(m) === false) { return error.typeError(m, maybe); }
     return Nothing(m) ? n : f(fromJust(m));
   }
   return partial(p, n, f, m);
 }

 /**
  * Determine whether an object is a `Maybe`.
  * @param {*} a - Any object.
  * @returns {boolean} - `true` if the object is a `Maybe` and `false` otherwise.
  */
 function isMaybe(a) { return a instanceof Maybe ? true : false; }

 /**
  * Determine whether an object is a `Just`.
  * Haskell> isJust :: Maybe a -> Bool
  * @param {Maybe} m - Any object.
  * @returns {boolean} - `true` is the object is a `Just` and `false` otherwise.
  */
 function isJust(m) {
   if (isMaybe(m) === false) { return error.typeError(m, isJust); }
   return isNothing(m) ? false : true;
 }

 /**
  * Determine whether an object is `Nothing`.
  * Haskell> isNothing :: Maybe a -> Bool
  * @param {Maybe} m - Any object.
  * @returns {boolean} - `true` is the object is `Nothing` and `false` otherwise.
  */
 function isNothing(m) {
   if (isMaybe(m) === false) { return error.typeError(m, isNothing); }
   return m === Nothing ? true : false;
 }

 /**
  * Extract the value from a `Just`. Throws an error if the `Maybe` is `Nothing`.
  * Haskell> fromJust :: Maybe a -> a
  * @param {Maybe} m - A `Maybe`.
  * @returns {*} - The value contained in the `Just`.
  */
 function fromJust(m) {
   if (isMaybe(m) === false) { return error.typeError(m, fromJust); }
   return isNothing(m) ? error.nothing(m, fromJust) : m.value(); // yuck
 }

 /**
  * Return the value contained in a `Maybe` if it is a `Just` or a default value if
  * the `Maybe` is `Nothing`.
  * Haskell> fromMaybe :: a -> Maybe a -> a
  * @param {*} d - The default value to return if `m` is `Nothing`.
  * @param {Maybe} m - A `Maybe`.
  * @returns {*} - The value contained in the `Maybe` or `d` if it is `Nothing`.
  */
 function fromMaybe(d, m) {
   let p = (d, m) => {
     if (isMaybe(m) === false) { return error.typeError(m, fromMaybe); }
     return isNothing(m) ? d : m.value();
   }
   return partial(p, d, m);
 }

 /**
  * Return `Nothing` on an empty list or `Just a` where `a` is the first element of the list.
  * Haskell> listToMaybe :: [a] -> Maybe a
  * @param {List} as - A list.
  * @returns {Maybe} - A `Just` containing the head of `as` or `Nothing` if `as` is an empty list.
  * @example
  * let lst = list(1,2,3);
  * listToMaybe(lst);         // => Just 1
  * listToMaybe(emptyList);   // => Nothing
  */
 function listToMaybe(as) {
   if (isList(as) === false) { return error.listError(as, listToMaybe); }
   return isEmpty(as) ? Nothing : just(head(as));
 }

 /**
  * Return an empty list when given `Nothing` or a singleton list when not given `Nothing`.
  * Haskell> maybeToList :: Maybe a -> [a]
  * @param {Maybe} m - A `Maybe`.
  * @returns {List} - A new list.
  * @example
  * let l = list(1,2,3);
  * let m = just(10);
  * maybeToList(m);       // => [10:[]]
  * maybeToList(Nothing); // =>  [[]]
  */
 function maybeToList(m) {
   if (isMaybe(m) === false) { return error.typeError(m, maybeToList); }
   return isNothing(m) ? emptyList : list(m.value());
 }

 /**
  * Take a list of `Maybe` objects and return a list of all the `Just` values.
  * Haskell> catMaybes :: [Maybe a] -> [a]
  * @param {List} as - A List.
  * @returns {List} - A list of the `Just` values from `as`.
  * @example
  * let lst = list(just(1), just(2), just(null), just(3), Nothing, just(undefined), just(4), Nothing, just(5));
  * catMaybes(lst); // => [1:2:3:4:5:[]]
  */
 function catMaybes(as) {
   if (isList(as) === false) { return error.listError(as, catMaybes); }
   if (isMaybe(head(as)) === false) { return error.typeError(m, catMaybes); }
   let pred = x => isJust(x);
   let f = x => fromJust(x);
   return map(f, filter(pred, as));
 }

 /**
  * Map a function `f` that returns a `Maybe` over a list. For each element of the list, if the result of
  * applying the function is a `Just`, then the value it contains is included in the result list. If it is
  * `Nothing`, then no element is added to the result list.
  * Haskell> mapMaybe :: (a -> Maybe b) -> [a] -> [b]
  * @param {Function} f - A function that returns a `Maybe`.
  * @param {List} as - A list to map over.
  * @returns {List} - A list of `Just` values returned from `f` mapped over `as`.
  * @example
  * let lst = list(1,2,3);
  * mapMaybe(just, lst);                          // => [1:2:3:[]]
  * let f = x => even(x) ? just(x * 2) : Nothing;
  * let lst = listRange(1, 25);
  * mapMaybe(f, lst);                             // => [4:8:12:16:20:24:28:32:36:40:44:48:[]]
  */
 function mapMaybe(f, as) {
   let p = (f, as) => {
     if (isList(as) === false) { return error.listError(as, mapMaybe); }
     if (isEmpty(as)) { return emptyList; }
     let x = head(as);
     let xs = tail(as);
     let r = f(x);
     let rs = mapMaybe.bind(this, f, xs);
     if (isNothing(r)) { return rs(); }
     if (isJust(r)) { return cons(fromJust(r))(rs()); }
     return error.returnError(f, mapMaybe);
   }
   return partial(p, f, as);
 }
