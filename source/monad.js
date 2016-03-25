/**
 * maryamyriameliamurphies.js
 *
 * @name monad.js
 * @fileOverview
 * Monad type class
 */

 /** @module maryamyriameliamurphies.js/source/monad */

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Monad

 /**
  * A monad is an abstract datatype of actions. Instances of `Monad` must define a `bind` method as well
  * all the required methods for `Functor` and `Applicative`.
  * @const {Function} - Returns `true` if an object is an instance of `Monad` and `false` otherwise.
  */
 const Monad = defines(`fmap`, `pure`, `ap`, `bind`);

 /**
  * Inject a value into the monadic type.
  * Haskell> return :: a -> m a
  * @param {Object} m - A monad.
  * @param {*} a - The value to inject.
  * @returns {Object} - A new monad of the same type with the value injected.
  */
 function inject(m, a) {
   let p = (m, a) => Monad(m) ? dataType(m).pure(a) : error.typeError(m, inject);
   return partial(p, m, a);
 }

 /**
  * Sequentially compose two actions, passing any value produced by the first as an argument to the second.
  * Haskell> (>>=) :: m a -> (a -> m b) -> m b
  * @param {Object} m - A monad.
  * @param {Function} f - A function to bind to the injected value of the monad. This function must return a monad.
  * @returns {Object} - A new monad of the same type, the result of binding the function to the original injected value.
  */
 function bind(m, f) {
   let p = (m, f) => Monad(m) ? dataType(m).bind(m, f) : error.typeError(m, bind);
   return partial(p, m, f);
 }

 /**
  * Sequentially compose two actions, discarding any value produced by the first, like sequencing operators
  * (such as the semicolon) in imperative languages.
  * @param {Object} m - A monad.
  * @param {Function} f - A function to call that ignores the injected value of the monad.
  * @returns {Object} - A new monad of the same type, the result of calling the function.
  * Haskell> (>>) :: m a -> m b -> m b
  */
 function chain(m, f) {
   let p = (m, f) => Monad(m) ? then(m, f) : error.typeError(m, chain);
   return partial(p, m, f);
 }

 /**
  * The same as `bind` but with the arguments interchanged.
  * Haskell> (=<<) :: Monad m => (a -> m b) -> m a -> m b
  * @param {Function} f - A function to bind to the injected value of the monad.
  * @param {Object} m - A monad.
  * @returns {Object} - A new monad of the same type, the result of binding the function to the original injected value.
  */
 function bindFlip(f, m) {
   let p = (f, m) => bind(m, f);
   return partial(p, f, m);
 }

 /**
  * Remove one level of monadic structure from a monad, projecting its bound argument into the outer level.
  * Haskell> join :: Monad m => m (m a) -> m a
  * @param {Object} m - A monad (wrapping another monad).
  * @returns {Object} - The wrapped monad on its own.
  * @example
  * let m = just(10); // => Just 10
  * let n = just(m);  // => Just Just 10
  * join(n);          // => Just 10
  * join(m);          // => *** Error: 'Just 10' is not a valid argument to function 'join'.
  */
 function join(m) {
   if (Monad(m)) { return Monad(bind(m, id)) ? bind(m, id) : error.typeError(m, join); }
   return error.typeError(m, join);
 }

 /**
  * Promote a function to a monad.
  * Haskell> liftM :: Monad m => (a1 -> r) -> m a1 -> m r
  * @param {Function} f - The function to lift into a monad.
  * @param {Object} m - The monad to lift the function into.
  * @returns {Object} - A new monad containing the result of mapping the function over the monad.
  */
 function liftM(f, m) {
   let p = (f, m) => Monad(m) ? dataType(m).fmap(f, m) : error.typeError(m, liftM);
   return partial(p, f, m)
 }

 /**
  * Since there is no way to exactly replicate Haskell's 'do' notation for monadic chaining, but it
  * would be useful to have a similar affordance, this class provides such a mechanism. See `Do`
  * below for an example of how it works.
  * @private
  */
 class DoBlock {
   /**
    * Create a new monadic context for chaining actions.
    * @param {Object} m - A monad, the context for the actions.
    */
   constructor(m) { this.m = () => m; }
   inject(a) { return Do(dataType(this.m()).pure(a)); }
   bind(f) { return Do(bind(this.m(), f)); }
   chain(f) { return Do(chain(this.m(), f)); }
   valueOf() { return `${this.m().typeOf()} >>= ${this.m().valueOf()}`; }
 }

 /**
  * Wrap a monad in a special container for the purpose of chaining actions, in imitation of the
  * syntactic sugar provided by Haskell's 'do' notation. Example:
  * @param {Object} m - A monad.
  * @returns {DoBlock} - A monadic context in which to chain actions.
  * @example
  * let j = just(10);
  * let doubleJust = x => just(x * 2);
  * let minusOne = x => just(x - 1);
  * let lst = list(1,2,3);
  * let plusOne = x => list(x + 1);
  * let doubleList = x => list(x * 2);
  * let put = x => { *    print(x);
  *   return just(x);
  * }
  * let b1 = Do(j).bind(doubleJust).bind(minusOne);
  * let b2 = Do(j).bind(doubleJust).chain(j).bind(minusOne);
  * let b3 = Do(lst).bind(plusOne).bind(doubleList);
  * let b4 = Do(lst).bind(plusOne).chain(lst).bind(doubleList);
  * print(b1);                          // => Maybe number >>= Just 19
  * print(b2);                          // => Maybe number >>= Just 9
  * print(b3);                          // => [number] >>= [4:6:8:[]]
  * print(b4);                          // => [number] >>= [2:4:6:2:4:6:2:4:6:[]]
  * Do(j)
  * .bind(put)                          // => 10
  * .bind(doubleJust)
  * .bind(put)                          // => 20
  * .chain(j)
  * .bind(put)                          // => 10
  * .bind(minusOne)
  * .bind(put)                          // => 9
  * .bind(doubleJust)
  * .bind(put);                         // => 18
  */
 function Do(m) { return Monad(m) ? new DoBlock(m) : error.typeError(Do, m); }
