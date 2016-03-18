# maryamyriameliamurphies.js
[![Apache 2.0 licensed](https://img.shields.io/badge/license-Apache2.0-blue.svg)](./LICENSE.txt)
[![npm](https://img.shields.io/npm/v/maryamyriameliamurphies.svg)](https://www.npmjs.com/package/maryamyriameliamurphies)
[![npm](https://img.shields.io/npm/dt/maryamyriameliamurphies.svg)](https://www.npmjs.com/package/maryamyriameliamurphies)
[![David](https://img.shields.io/david/dev/strongloop/maryamyriameliamurphies.svg)](https://www.npmjs.com/package/maryamyriameliamurphies)
[![David](https://img.shields.io/david/strongloop/maryamyriameliamurphies.svg)](https://www.npmjs.com/package/maryamyriameliamurphies)
[![Build Status](https://travis-ci.org/sjsyrek/maryamyriameliamurphies.js.svg?branch=master)](https://travis-ci.org/sjsyrek/maryamyriameliamurphies.js)

> All told, a monad in _X_ is just a monoid in the category of endofunctors of _X_, with product × replaced by composition of endofunctors and unit set by the identity endofunctor.
> — Saunders Mac Lane, [_Categories for the Working Mathematician_](http://bit.ly/1MbDPv3)

> In general, an arrow type will be a parameterised type with _two_ parameters, supporting operations analogous to _return_ and >>=. Just as we think of a monadic type _m a_ as representing a 'computation delivering an _a_', so we think of an arrow type _a b c_ (that is, the application of the parameterised type _a_ to the two parameters _b_ and _c_) as representing a 'computation with input of type _b_ delivering a _c_'.
> — John Hughes, [_Generalising monads to arrows_](http://www.sciencedirect.com/science/article/pii/S0167642399000234)

> In mathematics, a functor is a type of mapping between categories which is applied in category theory. Functors can be thought of as homomorphisms between categories. In the category of small categories, functors can be thought of more generally as morphisms.
> — Wikipedia, [_Functor_](https://en.wikipedia.org/wiki/Functor)

> murphy come, murphy go, murphy plant, murphy grow, a maryamyriameliamurphies, in the lazily eye of his lapis
> — James Joyce, [_Finnegans Wake_](http://www.trentu.ca/faculty/jjoyce/fw-293.htm)

## About

maryamyriameliamurphies.js is a library of [Haskell](https://www.haskell.org)-style morphisms ported to JavaScript using [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/) syntax.

## How to Install

1. Copy and paste the code. Go nuts.
2. `git clone` this repo and `import` it into your projects.
3. Install with npm locally `npm install maryamyriameliamurphies` or globally `npm -g maryamyriameliamurphies`.

If you clone this repo and have npm, ES2015 to ES5 transpiling, linting, and testing are automated through the following commands:

- `npm run compile` - run babel on `/source/index.js` and output to `/distribution/index.js`
- `npm run lint` - run eslint on `/source/index.js` and `/distribution/index.js`
- `npm run test` - run mocha using babel on all files imported into `/test/index.js`
- `npm run build` - compile and test

These commands require certain npm packages. See below. If you install via npm, these commands should work out of the box, unless you install for production.

## Description

Since the average explanation of functional programming terminology makes about as much sense to the average reader as the average page of _Finnegans Wake_, I gave this library a whimsical, literary name. Also, I'm an English literature Ph.D. student, and functional code strikes me as poetic (as "composed" in multiple senses) even though the technical explanations are impenetrably obtuse. All you need to know—in fact, all I understand—is that a pure function (or a morphism in general) simply describes how one thing can predictably transform into another. So a functional program, much like Joyce's final work, is an extended description of how things change.

These functions are experimental, as Haskell's type system translates only awkwardly to a JavaScript idiom, but I'd be delighted if any of them turn out to be useful. I tried hard to make them as pure as possible, which is why most (but not all) of them accept as arguments and return as values single values, and very few are defined as methods on prototypes. I also followed Haskell code patterns as
closely as I could and as made sense given each implementation, resulting in a style that is sometimes
extremely straightforward and sometimes bewilderingly terse.

I developed the code using the [Babel](http://babeljs.io/) package on [node.js](https://nodejs.org/en/), linted both source and distribution code with the [babel-eslint](https://github.com/babel/babel-eslint) parser for the latest version of [ESLint](http://eslint.org), and tested the transpiled ES5 output with [Mocha](http://mochajs.org) and the [should.js](http://shouldjs.github.io) assertion library. Since it uses the ES2015 [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) and [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) objects, you will need to install the [babel-polyfill](http://babeljs.io/docs/usage/polyfill/) package with [npm](https://www.npmjs.com) and include it in your project or copy and paste the code from `polyfill.js` to get it to work in [node](https://nodejs.org/en/) or the browser, respectively. ES2015 features may not be uniformly supported in all environments, and certain features (such as Proxy) cannot be polyfilled.

ES2015 code is located in the `/source` directory and babel-transpiled ES5 code in the `/distribution` directory. Mocha tests are in `/test` and example projects are in `/examples`.

There are two Haskell concepts that I use in the code that do not perfectly fit into the JavaScript way of doing things: the type class and the data type. In Haskell, a type class is similar to a protocol or trait in other programming languages. It describes an interface that objects conforming to it must implement.

A type class is a way of making fully parameterized types more useful by placing constraints on them. For example, the `Eq` type class in this library provides functionality for comparing whether the objects that implement it are equal. Objects that provide their own `isEq()` function will perform this test and return a `boolean`. Note that Haskell type classes are in no way comparable to "classes" in OOP.

A data type, on the other hand, is much closer to an OO class definition, as it does describe a custom type. The `Tuple` type is an example of a data type, as it represents a container for other, more basic values. As is often the case with objects in classical languages, instances of Haskell data types are created with special constructor functions that initialize them based on the arguments to those functions. A data type does not inherit (in the usual way) from other data types, however. Instead, it describes how constructor functions convert values passed in as arguments to those functions into the values that comprise that particular type.

As mentioned above, data types can be constrained (or not) by type classes, so as to provide additional functionality—`Eq` is an example of this, as is `Ord`, a type class that allows objects to be compared (greater than, less than, etc.). `Tuple` implements both of these type classes, as one may rightly want to compare tuples or test them for equality, for example.

Since JavaScript is not a strongly typed language by nature, it seemed unnecessary to me (and, for better or worse, antithetical to the JS spirit) to recreate the entirety of Haskell's static type system, though I do provide a limited amount of type checking. Anyone interested in better type safety should probably be using something like [PureScript](http://www.purescript.org) or [GHCJS](https://github.com/ghcjs/ghcjs). Instead, I use the new ES2015 `class` pattern for data types with static methods defined on those classes to provide the functionality of type classes. Since the classes and their constructors are not exposed in the API this library provides, instances of data types must be created using specialized functions provided for this purpose. This keeps the static "type class" methods private and affords some degree of namespace protection for the data types.

ES2015 features [tail call optimization](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-11.html#%_sec_1.2.1), which will ensure that all the nifty Haskell-esque recursions this library uses won't blow up your call stack. When it's [actually implemented](http://babeljs.io/docs/learn-es2015/#tail-calls).

## See also

- [ghcjs](https://github.com/ghcjs/ghcjs)
- [purescript](https://github.com/purescript/purescript)
- [lazy.js](https://github.com/dtao/lazy.js)
- [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
- [casualjavascript](https://github.com/casualjavascript/haskell-in-es6)

## API

See the code comments for more extensive documentation and examples.

### Basic functions
See Haskell [Data.Function](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Function.html#v:-46-) and [Prelude](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html).

* `partial(f, ...as)` Partially applies arguments `as` to function `f`.
* `$(f)` Composes function `f` with another function `g`.
* `flip(f)` Reverses the order of arguments to a function.
* `id(a)` Returns `a`. The identity function.
* `constant(a, b)` Returns `a`, discarding `b`.
* `until(pred, f, x)` Apply `f` to `x` until `pred` is true.
* `and(a, b)` Boolean "and".
* `or(a, b)` Boolean "or".
* `not(a)` Boolean "not".
* `even(a)` Return true if `a` is even.
* `odd(a)` Return true if `a` is odd.
* `isEmpty(a)` Return true if `a` is an empty list, tuple, or array.
* `show(a)` Return a string representation of a value (for data types from this library).
* `print(a)` Display the results of `show` on the console.

### Eq
See Haskell [Eq](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html#t:Eq).

* `isEq(a, b)` Returns true if `a` equals `b`.
* `isNotEq(a, b)` Returns true if `a` does not equal `b`.

### Ord
See Haskell [Ord](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html#t:Ord).

* `EQ` Ordering for equals.
* `LT` Ordering for less than.
* `GT` Ordering for greater than.
* `compare(a, b)` Return the Ordering of `a` as compared to `b`.
* `lessThan(a, b)` Return true if `a` is less than `b`.
* `lessThanOrEqual(a, b)` Return true if `a` is less than or equal to `b`.
* `greaterThan(a, b)` Return true if `a` is greater than `b`.
* `greaterThanOrEqual(a, b)` Return true if `a` is greater than or equal to `b`.
* `max(a, b)` Return the greater of `a` and `b`.
* `min(a, b)` Return the lesser of `a` and `b`.

### Monoid
See Haskell [Monoid](https://hackage.haskell.org/package/base-4.8.1.0/docs/Data-Monoid.html).

* `mempty(a)` Return the identity for the monoid.
* `mappend(a, b)` Perform an associative operation on two monoids.
* `mconcat(a)` Fold a list using the monoid.

### Functor
See Haskell [Functor](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Functor.html).

* `fmap(f, a)` Map the function `f` over the functor `a`.
* `fmapReplaceBy(a, b)` Replace all `b` with `a` in a functor.

## Applicative
See Haskell [Applicative](https://hackage.haskell.org/package/base-4.8.2.0/docs/Control-Applicative.html).

* `pure(f, a)` Lift `a` into applicative context `f`.
* `ap(f, a)` Apply applicative function `f` to applicative value `a`.
* `apFlip(f, a, b)` `ap` with its arguments reversed.
* `then(a1, a2)` Sequence actions, discarding the value of `a1`.
* `skip(a1, a2)` Sequence actions, discarding the value of `a2`.
* `liftA(f, a)` Lift function `f` into applicative context `a`.
* `liftA2(f, a, b)` Lift binary function `f` into applicative context `a`.
* `liftA3(f, a, b, c)` Lift ternary function `f` into applicative context `a`.

## Monad
See Haskell [Monad](https://hackage.haskell.org/package/base-4.8.2.0/docs/Control-Monad.html).

* `inject(m, a)` Inject value `a` into monadic context `m`.
* `bind(m, f)` Bind function `f` to the value contained in monadic context `m`.
* `chain(m, f)` Sequence actions, ignoring the value of the monadic context `m`.
* `bindFlip(f, m)` `bind` with its arguments reversed.
* `join(m)` Remove one level of monadic structure, like `concat`.
* `liftM(f, m)` Lift a function `f` into monadic context `m`.
* `Do(m)` Wrap a monad `m` in a special container for the purpose of chaining actions, in imitation of Haskell's "do" notation.

## Foldable
See Haskell [Foldable](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Foldable.html).

* `fold(a)` Combine the elements of a structure using a monoid.
* `foldMap(f, a)` Map `f` to each element in monoid `a`.
* `foldr(f, z, t)` Fold function `f` over monoid `t` with accumulator `z`.

## Traversable
See Haskell [Traversable](https://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Traversable.html).

* `traverse(f, a)` Map `f` over each element in monoid `a` and collect the results of evaluating each action.
* `mapM(f, m)` `traverse` for monads.
* `sequence(m)` Evaluate each action in monadic structure `m` and collect the results.

## Maybe
See Haskell [Maybe](https://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Maybe.html).

* `just(a)` Insert a value into a Maybe monad, returning `Just a` or `Nothing`.
* `maybe(n, f, m)` Apply `f` to the value in Maybe `m` or return `n` if `m` is `Nothing`.
* `isMaybe(a)` Return true if `a` is a Maybe.
* `isJust(m)` Return true if Maybe `m` is `Just`.
* `isNothing(m)` Return true if Maybe `m` is `Nothing`.
* `fromJust(m)` Extract the value from Maybe `m`, throwing an error if `m` is `Nothing`.
* `fromMaybe(d, m)` Extract the value from Maybe `m`, returning `d` if `m` is `Nothing`.
* `listToMaybe(as)` Return `Nothing` on an empty list or `Just a` where `a` is the first element of the list.
* `maybeToList(m)` Return an empty list if `m` if `Nothing` or a singleton list [`a`] if `m` is `Just a`.
* `catMaybes(as)` Return a list of all `Just` values from a list of Maybes.
* `mapMaybe(f, as)` Map `f` (that returns a Maybe) over a list and return a list of each `Just` result.

## Tuple
See Haskell [Tuple](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Tuple.html).

* `tuple(...as)` Create a new tuple from any number of values.
* `fst(p)` Return the first element of a tuple.
* `snd(p)` Return the second element of a tuple.
* `curry(f, x, y)` Convert `f` taking arguments `x` and `y` into a curried function.
* `uncurry(f, p)` Convert curried function `f` taking argument tuple pair `p` into an uncurried function.
* `swap(p)` Swap the first two values of a tuple.
* `isTuple(a)` Return true if `a` is a tuple.
* `fromArrayToTuple(a)` Convert an array into a tuple.
* `fromTupleToArray(p)` Convert a tuple into an array.

## List
See Haskell [List](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-List.html).

### Basic functions

* `list(...as)` Create a new list from a series of values.
* `listRange(start, end, f, filter)` Create a new list from `start` to `end` using step function `f` with values optionally filtered by `filter`.
* `listFilter(start, end, filter)` Create a new list of consecutive values, filtered using `filter`.
* `listRangeLazy(start, end)` Create a new list of consecutive values from `start` to `end`, using lazy evaluation.
* `listRangeLazyBy(start, end, step)` Create a new list from `start` to `end` incremented by step function `step`, using lazy evaluation.
* `listAppend(as, bs)` Append list `as` to list `bs`.
* `cons(x, xs)` Create a new list with head `x` and tail `xs`.
* `head(as)` Extract the first element of a list.
* `last(as)` Extract the last element of a list.
* `tail(as)` Extract the elements of a list after the head.
* `init(as)` Extract all elements of a list except the last one.
* `uncons(as)` Decompose a list into its head and tail.
* `empty(t)` Test whether a foldable structure is empty.
* `length(as)` Return the length of list.
* `isList(a)` Return true if `a` is a list.
* `fromArrayToList(a)` Convert an array into a list.
* `fromListToArray(as)` Convert a list into an array.
* `fromListToString(as)` Convert a list into a string.
* `fromStringToList(as)` Convert a string into a list.

### List transformations

* `map(f, as)` Map the function `f` over the elements in list `as`.
* `reverse(as)` Reverse the elements of a list.
* `intersperse(sep, as)` Intersperse the separator `sep` between the elements of `as`.
* `intercalate(xs, xss)` Intersperse the list `xs` between the lists in `xss` (a list of lists).
* `transpose(lss)` Transpose the "rows" and "columns" of a list of lists.

### Reducing lists

* `foldl(f, z, as)` Fold a list `as` from right to left, using function `f` and accumulator `z`.

### Special folds

* `concat(xss)` Concatenate the elements in a list of lists.
* `concatMap(f, as)` Map the function `f` (that returns a list) over the list `as` and concatenate the result list.

### Building lists

* `scanl(f, q, ls)` Reduce a list `ls` from right to left using function `f` and accumulator `q` and return a list of successive reduced values.
* `scanr(f, q0, as)` Like `scanl` but scans the list `as` from right to left.

### Infinite lists

* `listInf(start)` Return an infinite list of consecutive values beginning with `start`.
* `listInfBy(start, step)` Return an infinite list of values, incremented with function `step`, beginning with `start`.
* `iterate(f, x)` Return an infinite list of repeated applications of `f` to `x`.
* `repeat(a)` Return an infinite list in which all the values are `a`.
* `replicate(n, x)` Return a list of length `n` in which all values are `x`.
* `cycle(as)` Return the infinite repetition of a list.

### Sublists

* `take(n, as)` Return the prefix of a list of length `n`.
* `drop(n, as)` Return the suffix of a list after discarding `n` values.
* `splitAt(n, as)` Return a tuple in which the first element is the prefix of a list and the second element is the remainder of the list.
* `takeWhile(pred, as)` Return the longest prefix of a list of values that satisfy the predicate function `pred`.
* `dropWhile(pred, as)` Drop values from a list while the predicate function `pred` returns true.
* `span(pred, as)` Return a tuple in which the first element is the longest prefix of a list of values that satisfy the predicate function `pred` and the second element is the rest of the list.
* `spanNot(pred, as)` Return a tuple in which the first element is the longest prefix of a list of values that do not satisfy the predicate function `pred` and the second element is the rest of the list.
* `stripPrefix(as, bs)` Drop the prefix `as` from the list `bs`.
* `group(as)` Take a list and return a list of lists such that the concatenation of the result is equal to the argument. Each sublist in the result contains only equal values.
* `groupBy(eq, as)` Take a list and return a list of lists such that the concatenation of the result is equal to the argument. Each sublist in the result is grouped according to function `eq`.

### Searching

* `lookup(key, assocs)` Look up `key` in the association list `assocs`.
* `filter(f, as)` Return the list of elements from `as` to satisfy the predicate function `f`.

### Indexing

* `index(as, n)` Return the value in `as` at index `n`.
* `elemIndex(a, as)` Return the index of the first value in `as` equal to `a` or `Nothing` if there is no such value.
* `elemIndices(a, as)` Return the indices of all values in `as` equal to `a`, in ascending order.
* `find(pred, xs)` Return the first value in `xs` that satisfies the predicate function `pred` or `Nothing` if there is no such value.
* `findIndex(pred, xs)` Return the index of the first value in `xs` that satisfies the predicate function `pred` or `Nothing` if there is no such value.
* `findIndices(pred, xs)` Return the indices of all values in `xs` that satisfy `pred`, in ascending order.

### Zipping and unzipping lists

* `zip(as, bs)` Take two lists and return a list of corresponding pairs.
* `zip3(as, bs, cs)` `zip` for three lists.
* `zipWith(f, as, bs)` Zip `as` and `bs` using function `f`.
* `zipWith3(f, as, bs, cs)` Zip three lists using function `f`.

### "Set" operations

* `nub(as)` Remove duplicate values from a list.
* `nubBy(eq, as)` Remove duplicate values from a list, testing equality using function `eq`.
* `deleteL(a, as)` Remove the first occurrence of `a` from `as`.
* `deleteLBy(eq, a, as)` Remove the first occurrence of `a` from `as`, testing equality using function `eq`.
* `deleteFirsts(as, bs)` Remove the first occurrence of each value of `as` from `bs`.
* `deleteFirsts(eq, as, bs)` Remove the first occurrence of each value of `as` from `bs`, using function `eq` to test for equality.

### Ordered lists

* `sort(as)` Sort a list.
* `sortBy(cmp, as)` Sort a list using comparison function `cmp`.
* `mergeSort(as)` Sort a list using a merge sort algorithm.
* `mergeSortBy(cmp, as)` Merge sort a list using comparison function `cmp`.
* `insert(e, ls)` Insert `e` at the first position in `ls` where it is less than or equal to the next element.
* `insertBy(cmp, e, ls)` Insert `e` at the first position in `ls` using comparison function `cmp`.

### Utility functions

* `throwError(e)` Throws an error with message `e`.
* `defines(...methods)` Defines a type class that requires implementations of `methods`.
* `dataType(a)` Returns the data type of `a` (a synonym for `a.constructor`).
* `type(a)` Returns the type of `a` as defined by this library or `typeof` otherwise.
* `typeCheck(a, b)` Checks whether `a` and `b` are the same type.
