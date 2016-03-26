/**
 * maryamyriameliamurphies.js
 *
 * @name list.js
 * @author Steven J. Syrek
 * @file List data type.
 * @license ISC
 */

/** @module maryamyriameliamurphies.js/source/list */

////////////////////////////////////////////////////////////////////////////////////////////////////
// List

/**
 * A data constructor for a `List`. In Haskell, unlike in JavaScript, the default collection type is a
 * linked list, not an array. Obviously, there are benefits and drawbacks to both, and native Arrays
 * in JavaScript have certain performance advantages that a custom linked list implementation may not
 * be able to outperform, even when performing operations for which linked lists, all other things
 * being equal, have an advantage. Lists may only contain values of a single type.
 * @extends Type
 * @private
 */
class List extends Type {
  /**
   * Create a new `List`.
   * @param {*} head - The value to put at the head of the list, which will also determine the list's type.
   * @param {List} tail - The tail of the list, which is also a list (possibly the empty list).
   */
  constructor(head, tail) {
    super();
    this.head = null;
    this.tail = null;
    this.head = () => head;
    this.tail = () => tail;
  }
  // Eq
  static isEq(as, bs) {
    return typeCheck(head(as), head(bs)) ? fromListToArray(as).every((a, i) =>
    a === fromListToArray(bs)[i]) : error.typeMismatch(head(as), head(bs), this.isEq);
  }
  // Ord
  static compare(as, bs) {
    if (isEmpty(as) && isEmpty(bs)) { return EQ; }
    if (isEmpty(as) && isEmpty(bs) === false) { return LT; }
    if (isEmpty(as) === false && isEmpty(bs)) { return GT; }
    if (compare(head(as), head(bs)) === EQ) { return compare(tail(as), tail(bs)); }
    return compare(head(as), head(bs));
  }
  // Monoid
  static mempty(as) { return emptyList; }
  static mappend(as, bs) { return listAppend(as, bs); }
  // Foldable
  static foldr(f, acc, as) {
    if (isList(as) === false ) { return error.listError(as, foldr); }
    if (isEmpty(as)) { return acc; }
    //if (typeCheck(acc, head(as)) === false) { return error.typeMismatch(acc, head(as), foldr); }
    const x = head(as);
    const xs = tail(as);
    return f(x, foldr(f, acc, xs));
  }
  // Traversable
  static traverse(f, as) { return isEmpty(as) ? pure(as, emptyList) : ap(fmap(cons)(f(head(as))))(traverse(f, tail(as))); }
  // Functor
  static fmap(f, as) { return map(f, as); }
  // Applicative
  static pure(a) { return list(a); }
  static ap(fs, as) { return isEmpty(fs) ? emptyList : listAppend(fmap(head(fs), as))(ap(tail(fs), as)); }
  // Monad
  static bind(xs, f) { return concat(map(f, xs)); }
  // Prototype
  toString() { return `[Object List]`; }
  typeOf() { return `[${isEmpty(this) ? '' : type(head(this))}]`; }
  valueOf() { //return head(this) === null ? `[]` : `${head(this)}:${tail(this).valueOf()}`;
    const value = list => isEmpty(list) ? `[]` : `${head(list)}:${value(tail(list))}`;
    return `[${type(this) === `[string]` ? fromListToString(this) : value(this)}]`;
  }
}

/**
 * The empty list, or [] in Haskell (represented as [[]] in this library).
 * @const
 */
export const emptyList = new List();

// Basic functions

/**
 * Create a new `List` from a series of zero or more values.
 * @param {...*} as - Values to put into a new `List`.
 * @returns {List} - The new `List`.
 * @example
 * list(1,2,3); // => [1:2:3:[]]
 */
export function list(...as) { return isEmpty(as) ? emptyList : Reflect.construct(List, [as.shift(), list(...as)]); }

/**
 * Build a finite list from a range of values. Currently, this only works with numbers. The
 * equivalent is achieved in Haskell using list comprehensions.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [f=(x => x + 1)] - The function to apply iteratively to each value.
 * @param {Function} [filter] - An optional filter (returning `boolean`) to test whether to add each value to the list.
 * @returns {List} - The new list.
 * @example
 * const f = x => x + 5;
 * const filt = x => even(x);
 * listRange(0, 100, f);        // => [0:5:10:15:20:25:30:35:40:45:50:55:60:65:70:75:80:85:90:95:[]]
 * listRange(0, 100, f, filt);  // => [0:10:20:30:40:50:60:70:80:90:[]]
 */
export function listRange(start, end, f, filter) {
 const listRange_ = (start, end) => {
   if (f === undefined) { f = x => x + 1; }
   const lst = emptyList;
   const p = x => x >= end;
   const go = x => {
     if (filter === undefined) { lst = listAppend(lst)(list(x)); }
     if (filter !== undefined && filter(x)) { lst = listAppend(lst)(list(x)); }
     x = f(x);
     return x;
   }
   until(p, go, start);
   return lst;
 }
 return partial(listRange_, start, end);
}

/**
 * Build a finite list from a range of enumerated values, and apply a filter to each one. This
 * function is a shortcut for `listRange` that simply applies a filter with the default function
 * x = x + 1.
 * @param {*} start - The beginning of the range (inclusive).
 * @param {*} end - The end of the range (exclusive).
 * @param {Function} [filter] - An optional filter (returning `boolean`) to test whether to add each value to the list.
 * @returns {List} - The new list.
 * @example
 * const f = x => x + 5;
 * const filt = x => even(x);
 * listFilter(1, 50, filt)  // => [2:4:6:8:10:12:14:16:18:20:22:24:26:28:30:32:34:36:38:40:42:44:46:48:[]]
 */
export function listFilter(start, end, filter) {
 const f = x => x + 1;
 const listFilter_ = (start, end, filter) => listRange(start, end, f, filter);
 return partial(listFilter_, start, end, filter);
}

/**
 * Build a finite list from a range of values using lazy evaluation (i.e. each
 * successive value is only computed on demand, making infinite lists feasible).
 * To supply your own function for determining the increment, use `listRangeLazyBy`.
 * @param {*} start - The starting value.
 * @param {*} end - The end value.
 * @returns {List} - The lazy evaluated `List`.
 */
export function listRangeLazy(start, end) {
  const listRangeLazy_ = (start, end) => listRangeLazyBy(start, end, (x => x + 1));
  return partial(listRangeLazy_, start, end);
}

/**
 * Build a finite list from a range of values using lazy evaluation and incrementing
 * it using a given step function.
 * @param {*} start - The starting value.
 * @param {*} end - The end value.
 * @param {Function} step - The increment function.
 * @returns {List} - The lazy evaluated `List`.
 */
export function listRangeLazyBy(start, end, step) {
  const listRangeLazyBy_ = (start, end, step) => {
    if (start === end) { return list(start); }
    if (greaterThan(start, end)) { return emptyList; }
    let x = start;
    const xs = list(x);
    const listGenerator = function* () {
      do {
        x = step(x);
        yield list(x);
      } while (lessThan(x, end));
    }
    const gen = listGenerator();
    const handler = {
      get: function (target, prop) {
        if (prop === `tail` && isEmpty(tail(target))) {
          const next = gen.next();
          if (next.done === false) { target[prop] = () => new Proxy(next.value, handler); }
        }
        return target[prop];
      }
    };
    const proxy = new Proxy(xs, handler);
    return proxy;
  }
  return partial(listRangeLazyBy_, start, end, step);
}

/**
 * Append one `List` to another.
 * Haskell> (++) :: [a] -> [a] -> [a]
 * @param {List} as - A `List`.
 * @param {List} bs - A `List`.
 * @returns {List} - The new list, the result of the append.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * listAppend(lst1, lst2);   // => [1:2:3:4:5:6:[]]
 */
export function listAppend(as, bs) {
  const listAppend_ = (as, bs) => {
    if (isList(as) === false ) { return error.listError(as, listAppend); }
    if (isList(bs) === false ) { return error.listError(bs, listAppend); }
    if (isEmpty(as)) { return bs; }
    if (isEmpty(bs)) { return as; }
    if (type(head(as)) === type(head(bs))) { return cons(head(as))(listAppend(tail(as))(bs)); }
    return error.typeMismatch(type(head(as)), type(head(bs)), listAppend);
  }
  return partial(listAppend_, as, bs);
}

/**
 * Create a new `List` from a head and tail. As in Haskell, `cons` is based on the classic Lisp function.
 * Haskell> (:) :: a -> [a] -> [a]
 * @param {*} x - Any value, the head of the new list.
 * @param {List} xs - A `List`, the tail of the new list.
 * @returns {List} - The new `List`, constructed from `x` and `xs`.
 * @example
 * const lst = list(4,5,6);
 * cons(3)(lst);            // => [3:4:5:6:[]]
 */
export function cons(x, xs) {
  const cons_ = (x, xs) => {
    if (xs === undefined || isEmpty(xs)) { return new List(x, emptyList); }
    if (xs instanceof List === false) { return error.listError(xs, cons); }
    if (typeCheck(x, head(xs))) { return new List(x, xs); }
    return error.typeError(head(xs), cons);
  }
  return partial(cons_, x, xs);
}

/**
 * Extract the first element of a `List`.
 * Haskell> head :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The head of the list.
 * @example
 * const lst = list(1,2,3);
 * head(lst);               // => 1
 */
export function head(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, head) : as.head(); }
  return error.listError(as, head);
}

/**
 * Extract the last element of a `List`.
 * Haskell> last :: [a] -> a
 * @param {List} as - A `List`.
 * @returns {*} - The last element of the list.
 * @example
 * const lst = list(1,2,3);
 * last(lst);               // => 3
 */
export function last(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, last); }
    return isEmpty(tail(as)) ? head(as) : last(tail(as));
  }
  return error.listError(as, last);
}

/**
 * Extract the elements after the head of a `List`.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The tail of the list.
 * @example
 * const lst = list(1,2,3);
 * tail(lst);               // => [2:3:[]]
 */
export function tail(as) {
  if (isList(as)) { return isEmpty(as) ? error.emptyList(as, tail) : as.tail(); }
  return error.listError(as, tail);
}

/**
 * Return all the elements of a `List` except the last one.
 * Haskell> tail :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - A new list, without the original list's last element.
 * @example
 * const lst = list(1,2,3);
 * init(lst);               // => [1:2:[]]
 */
export function init(as) {
  if (isList(as)) {
    if (isEmpty(as)) { return error.emptyList(as, init); }
    return isEmpty(tail(as)) ? emptyList : cons(head(as))(init(tail(as)));
  }
  return error.listError(as, init);
}

/**
 * Decompose a `List` into its head and tail. If the list is empty, returns `Nothing`.
 * If the list is non-empty, returns `Just (x, xs)`, where `x` is the head of
 * the list and `xs` its tail.
 * Haskell> uncons :: [a] -> Maybe (a, [a])
 * @param {List} as - The `List` to decompose.
 * @returns {Maybe} - The decomposed `List` wrapped in a `Just`, or `Nothing` if the list is empty.
 * @example
 * const lst = list(1,2,3);
 * uncons(lst);             // => Just (1,[2:3:[]])
 */
export function uncons(as) { return isEmpty(as) ? Nothing : just(tuple(head(as), tail(as))); }

/**
 * Test whether a `Foldable` structure (such as a `List`) is empty.
 * Haskell> null :: t a -> Bool
 * @param {Object} t - The `Foldable` structure to test.
 * @returns {boolean} - `true` if the structure is empty, `false` otherwise.
 * @example
 * empty(list(1,2,3)); // => false
 * empty(emptyList);   // => true
 */
export function empty(t) { return foldr(x => x === undefined, true, t); }

/**
 * Return the length of a `List`. In the future, this function should work on all
 * `Foldable` structures.
 * Haskell> length :: Foldable t => t a -> Int
 * @param {List} as - A `List`.
 * @returns {number} - The length of the list.
 * @example
 * const lst = list(1,2,3);
 * length(lst);             // => 3
 */
export function length(as) {
  const lenAcc = (xs, n) => isEmpty(xs) ? n : lenAcc(tail(xs), n + 1);
  return isList(as) ? lenAcc(as, 0) : error.listError(as, length);
}

/**
 * Determine whether a given object is a `List`.
 * @param {*} a - Any object.
 * @returns {boolean} - `true` if the object is a `List` and `false` otherwise.
 */
export function isList(a) { return a instanceof List ? true : false; }

/**
 * Convert an array into a `List`.
 * @param {Array<*>} a - An array to convert into a `List`.
 * @returns {List} - A new `List`, the converted array.
 * @example
 * const arr = [1,2,3];
 * fromArrayToList(arr); // => [1:2:3:[]]
 */
export function fromArrayToList(a) { return Array.isArray(a) ? list(...a) : error.typeError(a, fromArrayToList); }

/**
 * Convert a `List` into an array.
 * @param {List} as - A `List` to convert into an array.
 * @returns {Array} - A new array, the converted list.
 * @example
 * const lst = list(1,2,3);
 * fromListToArray(lst);  // => [1,2,3]
 */
export function fromListToArray(as) {
  if (isList(as)) { return isEmpty(as) ? [] : [head(as)].concat(fromListToArray(tail(as))); }
  return error.listError(as, fromListToArray);
}

/**
 * Convert a `List` into a string.
 * @param {List} as - A `List` to convert into a string.
 * @returns {string} - A new string, the converted list.
 * @example
 * const str = list('a','b','c');
 * fromListToString(str);       // => "abc"
 */
export function fromListToString(as) {
  if (isList(as)) { return fromListToArray(as).join(``); }
  return error.listError(as, fromListToString);
}

/**
 * Convert a string into a `List`.
 * @param {string} str - A string to convert into a `List`.
 * @returns {List} - A new `List`, the converted string.
 * @example
 * const str = `abc`;
 * fromStringToList(str);       // => [abc]
 */
export function fromStringToList(str) {
  if (typeof str === 'string') { return fromArrayToList(str.split(``)); }
  return error.typeError(as, fromStringToList);
}

// List transformations

/**
 * Map a function over a `List` and put the results into a new list.
 * Haskell> map :: (a -> b) -> [a] -> [b]
 * @param {Function} f - The function to map.
 * @param {List} as - The `List` to map over.
 * @returns {List} - The list of results.
 * @example
 * const lst = list(1,2,3,4,5);
 * const f = x => x * 3;
 * map(f, lst));              // => [3:6:9:12:15:[]]
 */
export function map(f, as) {
  const map_ = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, map); }
    if (isEmpty(as)) { return emptyList; }
    const x = f(head(as)) === undefined ? f.bind(f, head(as)) : f(head(as));
    const xs = tail(as);
    return cons(x)(map(f)(xs));
  }
  return partial(map_, f, as);
}

/**
 * Return a new `List` with its elements reversed.
 * Haskell> reverse :: [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The reversed list.
 * @example
 * const lst = list(1,2,3,4,5);
 * reverse(lst);              // => [5:4:3:2:1:[]]
 */
export function reverse(as) {
  const r = (as, a) => isEmpty(as) ? a : r(tail(as), cons(head(as))(a));
  return r(as, emptyList);
}

/**
 * Take a separator and a `List` and intersperse the separator between the elements of the list.
 * Haskell> reverse :: [a] -> [a]
 * @param {*} sep - The seperator value.
 * @param {List} as - The `List` into which to intersperse the `sep` value.
 * @returns {List} - A new `List` in which the elements of `as` are interspersed with `sep`.
 * @example
 * const lst = list(1,2,3,4,5);
 * intersperse(0, lst);         // => [1:0:2:0:3:0:4:0:5:[]]
 * const str = fromStringToList(`abcdefghijklmnopqrstuvwxyz`);
 * intersperse(`|`, str)        // => [a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z]
 */
export function intersperse(sep, as) {
  const intersperse_ = (sep, as) => {
    if (isList(as) === false) { return error.listError(as, intersperse); }
    if (typeCheck(sep, head(as)) === false) { return error.typeMismatch(sep, head(as), intersperse); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return cons(x)(prependToAll(sep, xs));
  }
  const prependToAll = (sep, xs) => isEmpty(xs) ? emptyList : cons(sep)(cons(head(xs))(prependToAll(sep, tail(xs))));
  return partial(intersperse_, sep, as);
}

/**
 * Insert a `List` in between the lists in a `List` of lists. Equivalent to `(concat (intersperse xs xss)).`
 * Haskell> intercalate :: [a] -> [[a]] -> [a
 * @param {List} xs - The `List` to intercalate.
 * @param {List} xss - A `List` of lists.
 * @returns {List} - The intercalated `List`.
 * @example
 * const lst1 = list(1,1,1,1,1);
 * const lst2 = list(2,2,2,2,2);
 * const lst3 = list(3,3,3,3,3);
 * const lst4 = list(4,4,4,4,4);
 * const lst5 = list(5,5,5,5,5);
 * const xss = list(lst1, lst2, lst3, lst4, lst5); // [[1:1:1:1:1:[]]:[2:2:2:2:2:[]]:[3:3:3:3:3:[]]:[4:4:4:4:4:[]]:[5:5:5:5:5:[]]:[]]
 * const xs = list(0,0,0);
 * intercalate(xs, xss); // => [1:1:1:1:1:0:0:0:2:2:2:2:2:0:0:0:3:3:3:3:3:0:0:0:4:4:4:4:4:0:0:0:5:5:5:5:5:[]]
 */
export function intercalate(xs, xss) {
  const intercalate_ = (xs, xss) => concat(intersperse(xs, xss));
  return partial(intercalate_, xs, xss);
}

/**
 * Transpose the "rows" and "columns" of a `List` of lists. If some of the rows are shorter than the following rows,
 * their elements are skipped.
 * Haskell> transpose :: [[a]] -> [[a]]
 * @param {List} xss - A `List` of lists.
 * @returns {List} - A new `List` of lists, with the rows and columns transposed.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * const xss1 = list(lst1, lst2);
 * const xss2 = list(list(10,11), list(20), list(), list(30,31,32));
 * transpose(xss1);             // => [[1:4:[]]:[2:5:[]]:[3:6:[]]:[]]
 * transpose(xss2);             // => [[10:20:30:[]]:[11:31:[]]:[32:[]]:[]]
 */
export function transpose(lss) {
  if (isList(lss) === false) { return error.listError(lss, transpose); }
  if (isEmpty(lss)) { return emptyList; }
  const ls = head(lss);
  const xss = tail(lss);
  if (isList(ls) === false) { return error.listError(ls, transpose); }
  if (isEmpty(ls)) { return transpose(xss); }
  const x = head(ls);
  const xs = tail(ls);
  const hComp = map(h => head(h), filter(xs => !isEmpty(xs), xss));
  const tComp = map(t => tail(t), filter(xs => !isEmpty(xs), xss));
  return cons(cons(x)(hComp))(transpose(cons(xs)(tComp)));
}

// Reducing lists

/**
 * Left-associative fold of a structure (i.e. fold from the end to the beginning,
 * rather than from the beginning to the end, as with `foldr`). This function
 * currently only works with `List` objects but should be generalized to work with
 * all `Foldable` types, as in Haskell.
 * Haskell> foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 * @param {Function} f - The function to map over the list.
 * @param {*} z - An accumulator value.
 * @param {List} as - The `List` to fold.
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x - y;
 * foldl(f, 0, lst);          // => -6
 */
export function foldl(f, z, as) {
  const foldl_ = (f, z, as) => last(scanl(f, z, as));
  return partial(foldl_, f, z, as);
}

// Special folds

/**
 * Concatenate the elements in a container of lists. Currently, this function only
 * works on `List` objects, though it should in the future work on all `Foldable` types.
 * Haskell> concat :: Foldable t => t [a] -> [a]
 * @param {List} xss - A `List` of lists.
 * @returns {List} - The concatenated `List`.
 * @example
 * const lst1 = list(1,2,3);
 * const lst2 = list(4,5,6);
 * const lst3 = list(7,8,9);
 * const xss = list(lst1, lst2, lst3); // [[1:2:3:[]]:[4:5:6:[]]:[7:8:9:[]]:[]]
 * concat(xss);                        // => [1:2:3:4:5:6:7:8:9:[]]
 */
export function concat(xss) {
  if (isList(xss)) {
    if (isEmpty(xss)) { return emptyList; }
    const x = head(xss);
    const xs = tail(xss);
    return isList(x) ? listAppend(x, concat(xs)) : error.listError(x, concat);
  }
  return error.listError(xss, concat);
}

/**
 * Map a function that takes a value and returns a `List` over a `List` of values and
 * concatenate the resulting list. In the future, should work on all `Foldable` types.
 * Haskell> concatMap :: Foldable t => (a -> [b]) -> t a -> [b]
 * @param {Function} f - The function to map.
 * @param {List} as - The `List` to map over.
 * @returns {List} - The `List` of results of mapping `f` over `as`, concatenated.
 * @example
 * const f = x => list(x * 3);
 * const lst = list(1,2,3);    // [1:2:3:[]]
 * map(f, lst);                // => [[3:[]]:[6:[]]:[9:[]]:[]]
 * concatMap(f, lst);          // => [3:6:9:[]]
 */
export function concatMap(f, as) {
  const concatMap_ = (f, as) => concat(map(f, as));
  return partial(concatMap_, f, as);
}

// Building lists

/**
 * Scan a `List` from the right to left and return a `List` of successive reduced values.
 * Haskell> scanl :: (b -> a -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q - An accumulator value.
 * @param {List} ls - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * const lst = list(1,2,3)
 * const f = (x, y) => x - y;
 * scanl(f, 0, lst);          // => [0:-1:-3:-6:[]]
 */
export function scanl(f, q, ls) {
  const scanl_ = (f, q, ls) => {
    if (isList(ls) === false) { return error.listError(ls, scanl); }
    if (isEmpty(ls)) { return cons(q)(emptyList); }
    const x = head(ls);
    const xs = tail(ls);
    return cons(q)(p(f, f(q, x), xs));
  }
  return partial(scanl_, f, q, ls);
}

/**
 * Like `scanl` but scans left to right instead of right to left.
 * Haskell> scanr :: (a -> b -> b) -> b -> [a] -> [b]
 * @param {Function} f - The function to map over the `List`.
 * @param {*} q0 - An accumulator value.
 * @param {List} as - The `List` to scan.
 * @returns {List} - The `List` of reduced values.
 * @example
 * const lst = list(1,2,3);
 * const f = (x, y) => x - y;
 * scanr(f, 0, lst);          // => [2:-1:3:0:[]]
 */
export function scanr(f, q0, as) {
  const scanr_ = (f, q0, as) => {
    if (isList(as) === false) { return error.listError(ls, scanr); }
    if (isEmpty(as)) { return list(q0); }
    const x = head(as);
    const xs = tail(as);
    const qs = scanr(f, q0, xs);
    const q = head(qs);
    return cons(f(x, q))(qs);
  }
  return partial(scanr_, f, q0, as);
}

// Infinite lists

/**
 * Generate an infinite list. Use `listInfBy` to supply your own step function.
 * @param {*} start - The value with which to start the list.
 * @returns {List} - An infinite `List` of consecutive values, incremented from `start`.
 */
export function listInf(start) { return listInfBy(start, (x => x + 1)); }

/**
 * Generate an infinite list, incremented using a given step function.
 * @param {*} start - The value with which to start the list.
 * @param {Function} step - A unary step function.
 * @returns {List} - An infinite `List` of consecutive values, incremented from `start`.
 */
export function listInfBy(start, step) {
  const listInfBy_ = (start, step) => listRangeLazyBy(start, Infinity, step);
  return partial(listInfBy_, start, step);
}

/**
 * Return an infinite `List` of repeated applications of a function to a value.
 * Haskell> iterate :: (a -> a) -> a -> [a]
 * @param {Function} f - The function to apply.
 * @param {*} x - The value to apply the function to.
 * @returns {List} - An infinite `List` of repeated applications of `f` to `x`.
 * @example
 * const f = x => x * 2;
 * const lst = iterate(f, 1);
 * take(10, lst);             // => [1:2:4:8:16:32:64:128:256:512:[]]
 */
export function iterate(f, x) {
  const iterate_ = (f, x) => listInfBy(x, (x => f(x)));
  return partial(iterate_, f, x);
}

/**
 * Build an infinite list of identical values.
 * Haskell> repeat :: a -> [a]
 * @param {*} a - The value to repeat.
 * @returns {List} - The infinite `List` of repeated values.
 * @example
 * const lst = repeat(3);
 * take(10, lst);         // => [3:3:3:3:3:3:3:3:3:3:[]]
 */
export function repeat(a) { return cons(a)(listInfBy(a, id)); }

/**
 * Return a `List` of a specified length in which every value is the same.
 * Haskell> replicate :: Int -> a -> [a]
 * @param {number} n - The length of the `List`.
 * @param {*} x - The value to replicate.
 * @returns {List} - The `List` of values.
 */
export function replicate(n, x) {
  const replicate_ = (n, x) => take(n, repeat(x));
  return partial(replicate_, n, x);
}

/**
 * Return the infinite repetition of a `List` (i.e. the "identity" of infinite lists).
 * Haskell> cycle :: [a] -> [a]
 * @param {List} as - A finite `List`.
 * @returns {List} - A circular `List`, the original list infinitely repeated.
 * @example
 * const lst = list(1,2,3);
 * const c = cycle(lst);
 * take(9, c);              // => [1:2:3:1:2:3:1:2:3:[]]
 */
export function cycle(as) {
  if (isList(as) === false) { return error.listError(as, cycle); }
  if (isEmpty(as)) { return error.emptyList(as, cycle); }
  let x = head(as);
  let xs = tail(as);
  const c = list(x);
  const listGenerator = function* () {
    do {
      x = isEmpty(xs) ? head(as) : head(xs);
      xs = isEmpty(xs) ? tail(as) : tail(xs);
      yield list(x);
    } while (true);
  }
  const gen = listGenerator();
  const handler = {
    get: function (target, prop) {
      if (prop === `tail` && isEmpty(tail(target))) {
        const next = gen.next();
        target[prop] = () => new Proxy(next.value, handler);
      }
      return target[prop];
    }
  };
  const proxy = new Proxy(c, handler);
  return proxy;
}

// Sublists

/**
 * Return the prefix of a `List` of a given length.
 * Haskell> take :: Int -> [a] -> [a]
 * @param {number} n - The length of the prefix to take.
 * @param {List} as - The `List` to take from.
 * @returns {List} - A new `List`, the desired prefix of the original list.
 * @example
 * const lst = list(1,2,3);
 * take(2, lst);            // => [1:2:[]]
 */
export function take(n, as) {
  const take_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, take); }
    if (n <= 0) { return emptyList; }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return cons(x)(take(n - 1)(xs));
  }
  return partial(take_, n, as);
}

/**
 * Return the suffix of a `List` after discarding a specified number of values.
 * Haskell> drop :: Int -> [a] -> [a]
 * @param {number} n - The number of values to drop.
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - A new `List`, the desired suffix of the original list.
 * @example
 * const lst = list(1,2,3);
 * drop(2, lst);            // => [3:[]]
 */
export function drop(n, as) {
  const drop_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, drop); }
    if (n <= 0) { return as; }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    return drop(n - 1)(xs);
  }
  return partial(drop_, n, as);
}

/**
 * Return a `Tuple` in which the first element is the prefix of a `List` of a given
 * length and the second element is the remainder of the list.
 * Haskell> splitAt :: Int -> [a] -> ([a], [a])
 * @param {number} n - The length of the prefix.
 * @param {List} as - The `List` to split.
 * @returns {Tuple} - The split list.
 * @example
 * const lst = list(1,2,3);
 * splitAt(2, lst);         // => ([1:2:[]],[3:[]])
 */
export function splitAt(n, as) {
  const splitAt_ = (n, as) => {
    if (isList(as) === false) { return error.listError(as, splitAt); }
    return tuple(take(n, as), drop(n, as));
  }
  return partial(splitAt_, n, as);
}

/**
 * Return the longest prefix (possibly empty) of a `List` of values that satisfy a
 * predicate function.
 * Haskell> takeWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to take from.
 * @returns {List} - The `List` of values that satisfy the predicate function.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x < 3;
 * takeWhile(f, lst);                 // => [1:2:[]]
 */
export function takeWhile(p, as) {
  const takeWhile_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, takeWhile); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const test = p(x);
    if (test === true) { return cons(x)(takeWhile(p, xs)); }
    if (test === false) { return emptyList; }
    return error.listError(as, takeWhile);
  }
  return partial(takeWhile_, p, as);
}

/**
 * Drop values from a `List` while a given predicate function returns `true` for
 * each value.
 * Haskell> dropWhile :: (a -> Bool) -> [a] -> [a]
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - The `List` to drop values from.
 * @returns {List} - The `List` of values that do not satisfy the predicate function.
 * @example
 * const lst = list(1,2,3,4,5,1,2,3);
 * const f = x => x < 3;
 * dropWhile(f, lst);                 // => [3:4:5:1:2:3:[]]
 */
export function dropWhile(p, as) {
  const dropWhile_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, dropWhile); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const test = p(x);
    if (test === true) { return dropWhile(p, xs); }
    if (test === false) { return as; }
    return error.listError(as, dropWhile);
  }
  return partial(dropWhile_, p, as);
}

/**
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that satisfy a predicate function and the second element is
 * the rest of the list.
 * Haskell> span :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @returns {Tuple} - The `Tuple` of results.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x < 3;
 * span(f, lst);                    // => ([1:2:[]],[3:4:1:2:3:4:[]])
 */
export function span(p, as) {
  const span_ = (p, as) => {
    if (isList(as) === false) { return error.listError(as, span); }
    tuple(takeWhile(p, as), dropWhile(p, as));
  }
  return partial(span_, p, as);
}

/**
 * Return a `Tuple` in which the first element is the longest prefix (possibly empty)
 * of a `List` of values that do not satisfy a predicate function and the second element
 * is the rest of the list.
 * Haskell> break :: (a -> Bool) -> [a] -> ([a], [a])
 * @param {Function} p - The predicate function (should return `boolean`).
 * @param {List} as - A `List`.
 * @returns {Tuple} - The `Tuple` of results.
 * @example
 * const lst = list(1,2,3,4,1,2,3,4);
 * const f = x => x > 3;
 * spanNot(f, lst);                 // => ([1:2:3:[]],[4:1:2:3:4:[]])
 */
export function spanNot(p, as) {
  const spanNot_ = (p, as) => span($(not)(p), as);
  return partial(spanNot_, p, as);
}

/**
 * Drops the given prefix from a `List`. Returns `Nothing` if the list did not
 * start with the prefix given, or `Just` the `List` after the prefix, if it does.
 * Haskell> stripPrefix :: Eq a => [a] -> [a] -> Maybe [a]
 * @param {List} as - The prefix `List` to strip.
 * @param {List} bs - The `List` from which to strip the prefix.
 * @returns {Maybe} - The result `List` contained in a `Just`, or `Nothing`.
 * @example
 * const prefix = fromStringToList(`foo`);
 * stripPrefix(prefix, fromStringToList(`foobar`));    // => Just [bar]
 * stripPrefix(prefix, fromStringToList(`foo`));       // => Just [[]]
 * stripPrefix(prefix, fromStringToList(`barfoo`));    // => Nothing
 * stripPrefix(prefix, fromStringToList(`barfoobaz`)); // => Nothing
 */
export function stripPrefix(as, bs) {
  const stripPrefix_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, stripPrefix); }
    if (isList(bs) === false) { return error.listError(bs, stripPrefix); }
    if (isEmpty(as)) { return just(bs); }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    if (x === y) { return stripPrefix(xs, ys); }
    return Nothing;
  }
  return partial(stripPrefix_, as, bs);
}

/**
 * Take a `List` and return a `List` of lists such that the concatenation of the result
 * is equal to the argument. Each sublist in the result contains only equal values. Use
 * `groupBy` to supply your own equality function.
 * Haskell> group :: Eq a => [a] -> [[a]]
 * @param {List} as - A `List`.
 * @returns {List} - A `List` of result lists.
 * @example
 * const str = fromStringToList(`Mississippi`);
 * group(str); // => [[M]:[i]:[ss]:[i]:[ss]:[i]:[pp]:[i]:[]]
 */
export function group(as) { return groupBy(isEq, as); }

/**
 * Take a `List` and return a `List` of lists such that the concatenation of the result
 * is equal to the argument. Each sublist in the result is grouped according to the
 * the supplied equality function.
 * Haskell> groupBy :: (a -> a -> Bool) -> [a] -> [[a]]
 * @param {Function} eq - A function to test the equality of elements (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - A `List` of result lists.
 */
export function groupBy(eq, as) {
  const groupBy_ = (eq, as) => {
    if (isList(as) === false) { return error.listError(as, groupBy); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const t = span(eq(x), xs);
    const ys = fst(t);
    const zs = snd(t);
    return cons(cons(x)(ys))(groupBy(eq, zs));
  }
  return partial(groupBy_, eq, as);
}

// Searching

/**
 * Look up a key in an association list. For a list of `Tuple` objects, returns the
 * second element of the first tuple for which the key matches the first element.
 * Haskell> lookup :: Eq a => a -> [(a, b)] -> Maybe b
 * @param {*} key - The key value to lookup.
 * @param {List} assocs - A `List` of `Tuple` objects.
 * @returns {Maybe} - The matching value in a `Just` or `Nothing`, otherwise.
 * @example
 * const assocs = list(tuple(1,2), tuple(3,4), tuple(3,3), tuple(4,2)); // [(1,2):(3,4):(3,3):(4,2):[]]
 * lookup(3, assocs);                                                 // => Just 4
 * lookup(5, assocs);                                                 // => Nothing
 */
export function lookup(key, assocs) {
  const lookup_ = (key, assocs) => {
    if (isList(assocs) === false) { return error.listError(as, lookup); }
    if (isEmpty(assocs)) { return Nothing; }
    const xy = head(assocs);
    const xys = tail(assocs);
    const x = fst(xy);
    const y = snd(xy);
    if (key === x) { return just(y); }
    return lookup(key, xys);
  }
  return partial(lookup_, key, assocs);
}

/**
 * Return the `List` of elements in a `List` for which a function `f` returns `true`.
 * Haskell> filter :: (a -> Bool) -> [a] -> [a]
 * @param {Function} f - The filter function. Must return a `boolean`.
 * @param {List} as - The `List` to filter.
 * @returns {List} - The filtered `List`.
 * @example
 * const lst = listRange(1,50);
 * const f = x => and(odd(x), greaterThan(x, 10));
 * filter(f, lst); // => [11:13:15:17:19:21:23:25:27:29:31:33:35:37:39:41:43:45:47:49:[]]
 */
export function filter(f, as) {
  const filter_ = (f, as) => {
    if (isList(as) === false ) { return error.listError(as, filter); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    if (f(x) === true) { return cons(x)(filter(f, xs)); }
    if (f(x) === false) { return filter(f, xs); }
    return error.returnError(f, filter);
  }
  return partial(filter_, f, as);
}

// Indexing

/**
 * Return the value from a `List` at the specified index, starting at 0.
 * Haskell> (!!) :: [a] -> Int -> a
 * @param {List} as - The `List` to index into.
 * @param {number} n - The index to return.
 * @returns {*} - The value at the specified index.
 * @example
 * const lst = list(1,2,3,4,5);
 * index(lst, 3));              // => 4
 */
export function index(as, n) {
  const index_ = (as, n) => {
    if (isList(as) === false ) { return error.listError(as, index); }
    if (n < 0) { return error.rangeError(n, index); }
    if (isEmpty(as)) { return error.rangeError(n, index); }
    const x = head(as);
    const xs = tail(as);
    if (n === 0) { return x; }
    return index(xs)(n - 1);
  }
  return partial(index_, as, n);
}

/**
 * Return the index of the first value of a `List` equal to a query value, or
 * `Nothing` if there is no such value.
 * Haskell> elemIndex :: Eq a => a -> [a] -> Maybe Int
 * @param {*} a - The query value.
 * @param {List} as - The `List` to evaluate.
 * @returns {Maybe} - `Just a` or `Nothing`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,8);
 * elemIndex(8, lst);                         // => Just 11
 * elemIndex(10, lst);                        // => Nothing
 */
export function elemIndex(a, as) {
  const elemIndex_ = (a, as) => {
    if(isList(as) === false) { return listError(xs, elemIndex); }
    return findIndex(isEq(a), as);
  }
  return partial(elemIndex_, a, as);
}

/**
 * Return the indices of all values in a `List` equal to a query value, in
 * ascending order.
 * Haskell> elemIndices :: Eq a => a -> [a] -> [Int]
 * @param {*} a - The query value.
 * @param {List} as - The `List` to evaluate.
 * @returns {List} as - A `List` of values equal to `a`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,8);
 * elemIndices(2, lst);                       // => [1:2:4:6:7:9:[]]
 * elemIndices(10, lst);                      // => [[]]
 */
export function elemIndices(a, as) {
  const elemIndices_ = (a, as) => {
    if(isList(as) === false) { return listError(xs, elemIndices); }
    return findIndices(isEq(a), as);
  }
  return partial(elemIndices_, a, as);
}

/**
 * Take a predicate function and a `List` and return the first value in the list
 * that satisfies the predicate, or `Nothing` if there is no such element. This
 * function currently only works on `List` objects, but should in the future work
 * for all `Foldable` types.
 * Haskell> find :: Foldable t => (a -> Bool) -> t a -> Maybe a
 * @param {Function} p - The predicate function.
 * @param {List} xs - The `List` to evaluate.
 * @returns {Maybe} - The value inside a `Just` or `Nothing`, otherwise.
 * @example
 * const lst = list(1,2,3,4,5,6,7,8,9,10);
 * const pred1 = x => x % 3 === 0;
 * const pred2 = x => x > 10;
 * find(pred1, lst);                      // => Just 3
 * find(pred2, lst);                      // => Nothing
 */
export function find(p, xs) {
  const find_ = (p, xs) => {
    if (isList(xs) === false) { return listError(xs, find); }
    return $(listToMaybe)(filter(p))(xs);
  }
  return partial(find_, p, xs);
}

/**
 * Take a predicate function and a `List` and return the index of the first value
 * in the list that satisfies the predicate, or `Nothing` if there is no such element.
 * Haskell> findIndex :: (a -> Bool) -> [a] -> Maybe Int
 * @param {Function} p - The predicate function.
 * @param {List} xs - The `List` to evaluate.
 * @returns {Maybe} - The index inside a `Just` or `Nothing`, otherwise.
 * @example
 * const lst = list(1,2,3,4,5,6,7,8,9,10);
 * const pred1 = x => x % 3 === 0;
 * const pred2 = x => x > 10;
 * findIndex(pred1, lst);                 // => Just 2
 * findIndex(pred2, lst);                 // => Nothing
 */
export function findIndex(p, xs) {
  const findIndex_ = (pred, xs) => {
    if (isList(xs) === false) { return listError(xs, findIndex); }
    return $(listToMaybe)(findIndices(p))(xs);
  }
  return partial(findIndex_, p, xs);
}

/**
 * Return the indices of all values in a `List` that satisfy a predicate function,
 * in ascending order.
 * Haskell> findIndices :: (a -> Bool) -> [a] -> [Int]
 * @param {Function} p - The predicate function.
 * @param {List} xs - The `List` to evaluate.
 * @returns {List} - The `List` of matching indices.
 * @example
 * const lst1 = list(1,2,3,4,5,6,7,8,9,10);
 * const pred = x => even(x);
 * findIndices(pred, lst1); // => [1:3:5:7:9:[]]
 */
export function findIndices(p, xs) {
  const findIndices_ = (p, xs) => {
    if (isList(xs) === false) { return listError(xs, findIndices); }
    const z = zip(xs, listRange(0, length(xs)));
    const f = xs => {
      const x = fst(xs);
      const i = snd(xs);
      return p(x) ? true : false;
    }
    const m = t => snd(t);
    return map(m, filter(f, z));
  }
  return partial(findIndices_, p, xs);
}

// Zipping and unzipping lists

/**
 * Take two `List` objects and return a `List` of corresponding pairs. If one input
 * list is short, excess elements of the longer list are discarded.
 * Haskell> zip :: [a] -> [b] -> [(a, b)]
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The zipped `List` of `Tuple` objects.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * zip(lst1, lst2);              // => [(1,5):(2,4):(3,3):(4,2):(5,1):[]]
 */
export function zip(as, bs) {
  const zip_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, zip); }
    if (isList(bs) === false) { return error.listError(bs, zip); }
    if (isEmpty(as)) { return emptyList; }
    if (isEmpty(bs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    return cons(tuple(x, y))(zip(xs)(ys));
  }
  return partial(zip_, as, bs);
}

/**
 * Take three `List` objects and return a `List` of triples (`Tuple` objects
 * with three values). Analogous to the `zip` function.
 * Haskell> zip3 :: [a] -> [b] -> [c] -> [(a, b, c)]
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @param {List} cs - The third `List`.
 * @returns {List} - The zipped `List` of `Tuple` objects.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const lst3 = list(6,7,8,9,10);
 * zip3(lst1, lst2, lst3);        // => [(1,5,6):(2,4,7):(3,3,8):(4,2,9):(5,1,10):[]]
 */
export function zip3(as, bs, cs) {
  const zip3_ = (as, bs, cs) => {
    if (isList(as) === false) { return error.listError(as, zip3); }
    if (isList(bs) === false) { return error.listError(bs, zip3); }
    if (isList(cs) === false) { return error.listError(cs, zip3); }
    if (isEmpty(as) || isEmpty(bs) || isEmpty(cs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    const z = head(cs);
    const zs = tail(cs);
    return cons(tuple(x, y, z))(zip3(xs, ys, zs));
  }
  return partial(zip3_, as, bs, cs);
}

/**
 * A generalization of the `zip` function. Zip two `List` objects using a
 * provided function.
 * Haskell> zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * @param {Function} f - The zipping function.
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The zipped `List`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const f = (x, y) => tuple(x * 3, y ** 2);
 * const g = (x, y) => x + y;
 * zipWith(f, lst1, lst2); // => [(3,25):(6,16):(9,9):(12,4):(15,1):[]]
 * zipWith(g, lst1, lst2); // => [6:6:6:6:6:[]]
 */
export function zipWith(f, as, bs) {
  const zipWith_ = (f, as, bs) => {
    if (isList(as) === false) { return error.listError(as, zipWith); }
    if (isList(bs) === false) { return error.listError(bs, zipWith); }
    if (isEmpty(as) || isEmpty(bs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    return cons(f(x, y))(zipWith(f, xs, ys));
  }
  return partial(zipWith_, f, as, bs);
}

/**
 * A generalization of the `zip3` function. Zip three `List` objects using a
 * provided function.
 * Haskell> zipWith3 :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
 * @param {Function} f - The zipping function.
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @param {List} cs - The third `List`.
 * @returns {List} - The zipped `List`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(5,4,3,2,1);
 * const lst3 = list(6,7,8,9,10);
 * const f = (x, y, z) => tuple(x * 3, y ** 2, z % 2);
 * const g = (x, y, z) => x + y + z;
 * zipWith3(f, lst1, lst2, lst3); // => [(3,25,0):(6,16,1):(9,9,0):(12,4,1):(15,1,0):[]]
 * zipWith3(g, lst1, lst2, lst3); // => [12:13:14:15:16:[]]
 */
export function zipWith3(f, as, bs, cs) {
  const zipWith3_ = (f, as, bs, cd) => {
    if (isList(as) === false) { return error.listError(as, zipWith3); }
    if (isList(bs) === false) { return error.listError(bs, zipWith3); }
    if (isList(cs) === false) { return error.listError(cs, zipWith3); }
    if (isEmpty(as) || isEmpty(bs) || isEmpty(cs)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = head(bs);
    const ys = tail(bs);
    const z = head(cs);
    const zs = tail(cs);
    return cons(f(x, y, z))(zipWith3(f, xs, ys, zs));
  }
  return partial(zipWith3_, f, as, bs, cs);
}

// "Set" operations

/**
 * Remove duplicate values from a `List` by dropping all occurrences after the first.
 * Use `nubBy` to supply your own equality function.
 * Haskell> nub :: Eq a => [a] -> [a]
 * @param {List} as - A `List`.
 * @returns {List} - The essence of `as`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * nub(lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export function nub(as) {
  if (isList(as) === false) { return error.listError(as, nub); }
  return nubBy(isEq, as);
}

/**
 * Remove duplicate values from a `List` by dropping all occurrences after the first.
 * This function generalizes `nub` by allowing you to supply your own equality test.
 * Haskell> nubBy :: (a -> a -> Bool) -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - The essence of `as`.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * const eq = (x, y) => odd(x + y);
 * nubBy(eq, lst); // => [1:3:5:7:7:9:[]]
 */
export function nubBy(eq, as) {
  const nubBy_ = (eq, as) => {
    if (isList(as) === false) { return error.listError(as, nubBy); }
    if (isEmpty(as)) { return emptyList; }
    const x = head(as);
    const xs = tail(as);
    const y = y => not(eq(x, y));
    return cons(x)(nubBy(eq, filter(y, xs)));
    }
  return partial(nubBy_, eq, as);
}

/**
 * Remove the first occurrence of a value from a `List`. Use `deleteLBy` to supply
 * your own equality function.
 * Haskell> delete :: (Eq a) => a -> [a] -> [a]
 * @param {*} a - The value to delete.
 * @param {List} as - A `List`.
 * @returns {List} - The `List` with the first `a` deleted.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * deleteL(2, lst5); // => [1:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export function deleteL(a, as) {
  const deleteL_ = (a, as) => {
    if (isList(as) === false) { return error.listError(as, deleteL); }
    return deleteLBy(isEq, a, as);
  }
  return partial(deleteL_, a, as);
}

/**
 * Remove the first occurrence of a value from a `List` using a provided function
 * to check for equality.
 * Haskell> deleteBy :: (a -> a -> Bool) -> a -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - A `List`.
 * @returns {List} - The `List` with the first `a` deleted.
 * @example
 * const lst = list(1,2,2,3,2,4,2,2,5,2,6,7,7,8,9,10,10);
 * const eq = (x, y) => odd(x + y);
 * deleteLBy(eq, 2, lst); // => [2:2:3:2:4:2:2:5:2:6:7:7:8:9:10:10:[]]
 */
export function deleteLBy(eq, a, as) {
  const deleteLBy_ = (eq, a, as) => {
    if (isList(as) === false) { return error.listError(as, deleteLBy); }
    if (isEmpty(as)) { return emptyList; }
    const y = head(as);
    const ys = tail(as);
    const x = eq(a, y) ? ys : y;
    return eq(a, y) ? ys : cons(y)(deleteLBy(eq, a, ys));
  }
  return partial(deleteLBy_, eq, a, as);
}

/**
 * Non-associative list difference: remove the first occurrence of each value of a
 * `List` in turn from another `List`. Use `deleteFirstsBy` to supply your own
 * equality function.
 * Haskell> (\\) :: Eq a => [a] -> [a] -> [a]
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The difference of `as` and `bs`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst2, lst2);
 * deleteFirsts(lst3, lst1);                            // => [6:7:8:9:10:[]]
 * deleteFirsts(listAppend(lst1, lst2), lst1) === lst2; // => true
 */
export function deleteFirsts(as, bs) {
  const deleteFirsts_ = (as, bs) => {
    if (isList(as) === false) { return error.listError(as, deleteFirsts); }
    if (isList(ab) === false) { return error.listError(ab, deleteFirsts); }
    return foldl(flip(deleteL), as, bs);
  }
  return partial(deleteFirsts_, as, bs);
}

/**
 * Non-associative list difference: remove the first occurrence of each value of a
 * `List` in turn from another `List` using a provided function to check for equality.
 * Haskell> deleteFirstsBy :: (a -> a -> Bool) -> [a] -> [a] -> [a]
 * @param {Function} eq - A function to test for equality (must return `boolean`).
 * @param {List} as - The first `List`.
 * @param {List} bs - The second `List`.
 * @returns {List} - The difference of `as` and `bs`.
 * @example
 * const lst1 = list(1,2,3,4,5);
 * const lst2 = list(6,7,8,9,10);
 * const lst3 = listAppend(lst1, lst2);
 * const eq = (x, y) => even(x * y);
 * deleteFirstsBy(eq, lst3, lst1);    // => [5:7:8:9:10:[]]
 */
export function deleteFirstsBy(eq, as, bs) {
  const deleteFirstsBy_ = (eq, as, bs) => {
    return foldl(flip(deleteLBy(eq)), as, bs);
  }
  return partial(deleteFirstsBy_, eq, as, bs);
}

// Ordered lists

/**
 * Sort a list using regular value comparison. Use `sortBy` to supply your own
 * comparison function. Uses an insertion sort algorithm. The `mergeSort` function
 * is probably more efficient for larger lists.
 * Haskell> sort :: Ord a => [a] -> [a]
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list. The original list is unmodified.
 * @example
 * lst = list(9,8,7,6,5,4,3,10,13,11,14,23,24,26,25,2,1);
 * sort(lst) // => [1:2:3:4:5:6:7:8:9:10:11:13:14:23:24:25:26:[]]
 */
export function sort(as) { return sortBy(compare, as); }

/**
 * Sort a list using a comparison function of your choice. Uses an insertion sort
 * algorithm. The `mergeSortBy` function is probably more efficient for larger lists.
 * Haskell> sortBy :: (a -> a -> Ordering) -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted list. The original list is unmodified.
 * @example
 * const notCompare = (x, y) => compare(x, y) === EQ ? EQ : (GT ? LT : GT);
 * const lst1 = listRange(1, 11);
 * const lst2 = reverse(lst1);       // [10:9:8:7:6:5:4:3:2:1:[]]
 * sortBy(notCompare, lst1);         // => [1:2:3:4:5:6:7:8:9:10:[]]
 * sortBy(notCompare, lst2);         // => [10:9:8:7:6:5:4:3:2:1:[]]
 */
export function sortBy(cmp, as) {
  const sortBy_ = (cmp, as) => {
    if (isList(as) === false) { return error.listError(as, sortBy); }
    return foldr(insertBy(cmp), emptyList, as);
  }
  return partial(sortBy_, cmp, as);
}

/**
 * Sort a list using regular value comparison. Use `mergeSortBy` to supply your own
 * comparison function. Uses a merge sort algorithm, which may be more efficient
 * than `sort` for larger lists. Use `mergeSortBy` to supply your own comparison
 * function.
 * Haskell> sort :: Ord a => [a] -> [a]
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted `List`. The original list is unmodified.
 * @example
 * const lst1 = list(20,19,18,17,16,15,14,13,12,11,10,1,2,3,4,5,6,7,8,9);
 * mergeSort(lst1); // => [1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:[]]
 * const f = x => x + 1;
 * const lst2 = reverse(listRange(1, 11, f)); // [10:9:8:7:6:5:4:3:2:1:[]]
 * mergeSort(lst2);                         // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export function mergeSort(as) {
  if (isList(as) === false) { return error.listError(as, mergeSort); }
  return mergeSortBy(compare, as);
}

/**
 * Sort a list using a comparison function of your choice. Uses a merge sort algorithm,
 * which may be more efficient than `sortBy` for larger lists.
 * than `sort` for larger lists.
 * Haskell> sortBy :: (a -> a -> Ordering) -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {List} as - The `List` to sort.
 * @returns {List} - The sorted `List`. The original list is unmodified.
 * @example
 * const notCompare = (x, y) => compare(x, y) === EQ ? EQ : (GT ? LT : GT);
 * const lst1 = listRange(1, 11);
 * const lst2 = reverse(lst1);       // [10:9:8:7:6:5:4:3:2:1:[]]
 * mergeSortBy(notCompare, lst1);  // => [1:2:3:4:5:6:7:8:9:10:[]]
 * mergeSortBy(notCompare, lst2);  // => [10:9:8:7:6:5:4:3:2:1:[]]
 */
export function mergeSortBy(cmp, as) {
  const mergeSortBy_ = (cmp, as) => {
    if (isList(as) === false) { return error.listError(as, mergeSortBy); }
    const sequences = as => {
      if (isEmpty(as)) { return list(as); }
      const xs = tail(as);
      if (isEmpty(xs)) { return list(as); }
      const a = head(as);
      const b = head(xs);
      xs = tail(xs);
      if (cmp(a, b) === GT) { return descending(b, list(a), xs); }
      return ascending(b, cons(a), xs);
    }
    const descending = (a, as, bbs) => {
      if (isEmpty(bbs)) { return cons(cons(a)(as))(sequences(bbs)); }
      const b = head(bbs);
      const bs = tail(bbs);
      if (cmp(a, b) === GT) { return descending(b, cons(a)(as), bs); }
      return cons(cons(a)(as))(sequences(bbs));
    }
    const ascending = (a, as, bbs) => {
      if (isEmpty(bbs)) { return cons(as(list(a)))(sequences(bbs)); }
      const b = head(bbs);
      const bs = tail(bbs);
      const ys = ys => as(cons(a)(ys));
      if (cmp(a, b) !== GT) { return ascending(b, ys, bs); }
      return cons(as(list(a)))(sequences(bbs));
    }
    const mergeAll = xs => {
      if (isEmpty(tail(xs))) { return head(xs); }
      return mergeAll(mergePairs(xs));
    }
    const mergePairs = as => {
      if (isEmpty(as)) { return as; }
      const xs = tail(as);
      if (isEmpty(xs)) { return as; }
      const a = head(as);
      const b = head(xs);
      xs = tail(xs);
      return cons(merge(a, b))(mergePairs(xs));
    }
    const merge = (as, bs) => {
      if (isEmpty(as)) { return bs; }
      if (isEmpty(bs)) { return as; }
      const a = head(as);
      const as1 = tail(as);
      const b = head(bs);
      const bs1 = tail(bs);
      if (cmp(a, b) === GT) { return cons(b)(merge(as, bs1)); }
      return cons(a)(merge(as1, bs));
    }
    return $(mergeAll)(sequences)(as);
  }
  return partial(mergeSortBy_, cmp, as);
}

/**
 * The `insert` function takes an element and a `List` and inserts the element into the
 * list at the first position where it is less than or equal to the next element.
 * In particular, if the list is sorted before the call, the result will also be sorted.
 * Use `insertBy` to supply your own comparison function.
 * Haskell> insert :: Ord a => a -> [a] -> [a]
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 * @example
 * const lst = list(1,2,3,4,5,6,8,9,10);
 * insert(7, lst); // => [1:2:3:4:5:6:7:8:9:10:[]]
 */
export function insert(e, ls) {
  const insert_ = (e, ls) => insertBy(compare, e, ls);
  return partial(insert_, e, ls);
}

/**
 * Insert an element into a list using a comparison function of your choice.
 * Haskell> insertBy :: (a -> a -> Ordering) -> a -> [a] -> [a]
 * @param {Function} cmp - The comparison function—must return an `Ordering`.
 * @param {*} e - The element to insert.
 * @param {List} ls - The `List` to insert into.
 * @returns {List} - A new `List`, with the element inserted.
 */
export function insertBy(cmp, e, ls) {
  const insertBy_ = (cmp, e, ls) => {
    if (isList(ls) === false) { return error.listError(ls, insertBy); }
    if (isEmpty(ls)) { return list(e); }
    const y = head(ls);
    const ys = tail(ls);
    if (cmp(e, y) === GT) { return cons(y)(insertBy(cmp, e, ys)); }
    return cons(e)(ls);
  }
  return partial(insertBy_, cmp, e, ls);
}
