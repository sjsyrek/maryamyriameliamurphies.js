# maryamyriameliamurphies.js
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/sjsyrek/maryamyriameliamurphies.js/blob/master/LICENSE.txt)
[![Build Status](https://travis-ci.org/sjsyrek/maryamyriameliamurphies.js.svg?branch=master)](https://travis-ci.org/sjsyrek/maryamyriameliamurphies.js)
[![Test Coverage](https://codeclimate.com/github/sjsyrek/maryamyriameliamurphies.js/badges/coverage.svg)](https://codeclimate.com/github/sjsyrek/maryamyriameliamurphies.js/coverage)
[![Downloads](https://img.shields.io/npm/dt/maryamyriameliamurphies.svg?maxAge=2592000)](https://www.npmjs.com/package/maryamyriameliamurphies)
[![Monads](https://img.shields.io/badge/monads-yes-brightgreen.svg)](https://wiki.haskell.org/What_a_Monad_is_not)

[![NPM](https://nodei.co/npm/maryamyriameliamurphies.png?downloads=true)](https://nodei.co/npm/maryamyriameliamurphies/)

**Learn functional programming in ES2015 JavaScript from the principles and code patterns of Haskell**

**Make your own code more functional by using this library as it is or just implementing its ideas yourself**

## Now in version 1.0
- [Comprehensive HTML documentation](http://sjsyrek.github.io/maryamyriameliamurphies.js/)!
- Linting your mother would be proud of!
- Fully tested—with guaranteed 100% code coverage!
- Standalone browser bundles at no extra charge!
- Now ISC licensed!
- Not scary!
- Monads!

> All told, a monad in _X_ is just a monoid in the category of endofunctors of _X_, with product × replaced by composition of endofunctors and unit set by the identity endofunctor.
> — Saunders Mac Lane, [_Categories for the Working Mathematician_](http://bit.ly/1MbDPv3)

> In general, an arrow type will be a parameterised type with _two_ parameters, supporting operations analogous to _return_ and >>=. Just as we think of a monadic type _m a_ as representing a 'computation delivering an _a_', so we think of an arrow type _a b c_ (that is, the application of the parameterised type _a_ to the two parameters _b_ and _c_) as representing a 'computation with input of type _b_ delivering a _c_'.
> — John Hughes, [_Generalising monads to arrows_](http://www.sciencedirect.com/science/article/pii/S0167642399000234)

> In mathematics, a functor is a type of mapping between categories which is applied in category theory. Functors can be thought of as homomorphisms between categories. In the category of small categories, functors can be thought of more generally as morphisms.
> — Wikipedia, [_Functor_](https://en.wikipedia.org/wiki/Functor)

> murphy come, murphy go, murphy plant, murphy grow, a maryamyriameliamurphies, in the lazily eye of his lapis
> — James Joyce, [_Finnegans Wake_](http://www.trentu.ca/faculty/jjoyce/fw-293.htm)

## About

**maryamyriameliamurphies.js** is a library of [Haskell](https://www.haskell.org)-style morphisms implemented in JavaScript using [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/) syntax. That is, it's a collection of pure functions designed to showcase in a more widely-used language than Haskell the ways and means of functional programming, for which the newest dialect of JavaScript has improved support. If you're interested in functional programming or even Haskell itself, but find that world intimidating, this library may be a useful conceptual bridge. The syntax I use will probably come across as unconventional, as it mirrors as closely as possible the terse, efficient style of Haskell. Eventually, however, you may find it easy enough to reason about, thanks to its relative lack of side effects and foundation in function composition. If you're curious about strange-sounding things like functors, monads, partial application, currying, and lazy evaluation, then there's something here for you.

First published entirely by chance on St. Patrick's Day, 2016.

##### [Complete Online API Documentation](http://sjsyrek.github.io/maryamyriameliamurphies.js/)

### How to install

- Copy and paste the code. Go nuts.
- `git clone` this repo and then execute `npm install && npm run compile` to compile the code.
- [Install with npm](https://www.npmjs.com/package/maryamyriameliamurphies) `npm install --save-dev maryamyriameliamurphies`.

### How to use with npm if you clone

- `npm run compile` to run Babel on ES2015 code in `./source` and output transpiled ES5 code to `./distribution`.
- `npm run lint` to run ESlint to check the source code for errors.
- `npm test` to run Mocha on the test code in `./test`.
- `npm run cover` to run nyc on the source code and generate testing coverage reports.
- `npm run doc` to run JSDoc to generate HTML documentation for the entire library.
- `npm run bundle` to run Browserify to bundle the library for use in the browser.
- `npm run clean` to delete all files in `./distribution`.
- `npm run build` to run `clean`, `compile`, `bundle`, and `doc` all at once.

These commands require that you have certain [npm](https://www.npmjs.com) packages installed. See below.

### How to test in the browser

- Create a new HTML file in the `./bundle` directory, for example `maryamyriameliamurphies.html`.
- Paste this code into it, after any other content: `<script src="maryamyriameliamurphies.js"></script>`.
- Open your browser's JavaScript console.
- Test functions using the library namespace, e.g.:
```js
const m = maryamyriameliamurphies; // yes, I know it's too long
const hello = str => {
  m.print(`Hello ${str}!`);
  return m.just(str);
}
const str = m.just(`world`);
m.Do(str).flatMap(hello).inject(`monad`).flatMap(hello);
```

Your mileage may vary, depending on which browser you use to test. This example works in the latest version of Chrome, but ES2015 syntax is not fully supported in Safari as of this writing.

### Description

Since the average explanation of functional programming terminology makes about as much sense to the average reader as the average page of _Finnegans Wake_, I gave this library a whimsical, literary name. Also, I'm an English literature Ph.D. student, and functional code strikes me as poetic (as "composed" in multiple senses) even though the technical explanations are impenetrably obtuse. All you need to know—in fact, all I understand—is that a pure function (or a morphism in general) simply describes how one thing can predictably transform into another. So a functional program, much like Joyce's final work, is an extended description of how things change.

These functions are experimental, as Haskell's type system translates only awkwardly to a JavaScript idiom, but I'd be delighted if any of them turn out to be useful. I tried hard to make them as pure as possible, which is why most (but not all) of them accept as arguments and return as values single values, and very few are defined as methods on prototypes. I also followed Haskell code patterns as
closely as I could for each implementation (as much as it made sense to do so), resulting in a style that is sometimes extremely straightforward and sometimes bewilderingly terse.

There are two Haskell concepts that I use in the code that do not perfectly fit into the JavaScript way of doing things: the type class and the data type. In Haskell, a type class is similar to a protocol or trait in other programming languages. It describes an interface that objects conforming to it must implement.

A type class is a way of making fully parameterized types more useful by placing constraints on them. For example, the `Eq` type class in this library provides functionality for comparing whether the objects that implement it are equal. Objects that provide their own `isEq()` function will perform this test and return a `boolean`. Note that Haskell type classes are in no way comparable to "classes" in OOP.

A data type, on the other hand, is much closer to an OO class definition, as it does describe a custom type. The `Tuple` type is an example of a data type, as it represents a container for other, more basic values. As is often the case with objects in classical languages, instances of Haskell data types are created with special constructor functions that initialize them based on the arguments to those functions. A data type does not inherit (in the usual way) from other data types, however. Instead, it describes how constructor functions convert values passed in as arguments to those functions into the values that comprise that particular type.

As mentioned above, data types can be constrained (or not) by type classes, so as to provide additional functionality—`Eq` is an example of this, as is `Ord`, a type class that allows objects to be compared (greater than, less than, etc.). `Tuple` implements both of these type classes, as one may rightly want to compare tuples or test them for equality, for example.

Since JavaScript is not a strongly typed language by nature, it seemed unnecessary to me (and, for better or worse, antithetical to the JS spirit) to recreate the entirety of Haskell's static type system, though I do provide a limited amount of type checking. Anyone interested in better type safety should probably be using something like [PureScript](http://www.purescript.org) or [GHCJS](https://github.com/ghcjs/ghcjs). Instead, I use the new ES2015 `class` pattern for data types with static methods defined on those classes to provide the functionality of type classes. Since the classes and their constructors are not exposed in the API this library provides, instances of data types must be created using specialized functions provided for this purpose. This keeps the static "type class" methods private and affords some degree of namespace protection for the data types.

ES2015 specifies [tail call optimization](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-11.html#%_sec_1.2.1), which will ensure that all the nifty Haskell-esque recursions this library uses won't blow up your call stack (when it's [actually implemented](http://babeljs.io/docs/learn-es2015/#tail-calls)).

#### See also

* [ghcjs](https://github.com/ghcjs/ghcjs)
* [purescript](https://github.com/purescript/purescript)
* [lazy.js](https://github.com/dtao/lazy.js)
* [fantasy-land](https://github.com/fantasyland/fantasy-land)
* [casualjavascript](https://github.com/casualjavascript/haskell-in-es6)

### Development

Requires:

- [Node](https://nodejs.org/en/) - JavaScript runtime for the server
- [npm](https://www.npmjs.com) - node package manager
- [Babel](http://babeljs.io/) - ES2015 and later to ES5 JavaScript compiler (see below)
- [Mocha](http://mochajs.org) - testing framework
- [Should](http://shouldjs.github.io) - assertion library
- [ESLint](http://eslint.org) - static analysis of code for JavaScript
- [nyc](https://github.com/istanbuljs/nyc) - a command line interface for [istanbul](https://gotwarlost.github.io/istanbul/) compatible with ES2015
- [JSDoc](http://usejsdoc.org) - documentation utility

Babel packages and plugins:

- [babel-cli](http://babeljs.io/docs/usage/cli/) - command line interface
- [babel-core](http://babeljs.io/docs/usage/api/) - API for Node
- [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul) - for test coverage with nyc
- [babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) - for polyfilling libraries
- [babel-preset-es2015](https://babeljs.io/docs/plugins/preset-es2015/) - default transforms
- [babel-register](http://babeljs.io/docs/usage/require/) - require hook for testing with Mocha
- [babelify](https://github.com/babel/babelify) - Browserify transform

### What the name of this library means

The word "maryamyriameliamurphies" occurs on pg. 293 of James Joyce's _Finnegans Wake_. The two brothers Kev and Dolph (surrogates for the archetypal Shem and Shaun, who represent all rival brothers in history and myth) are having a math lesson. Dolph, the elder, is attempting to explain to Kev the [first postulate of Euclid](http://mathworld.wolfram.com/EuclidsPostulates.html), which results in a rather prurient diagram of circles and triangles. Happily for me, as a functional programmer, it contains a `λ`. If you want to find out about the naughtier significances of this diagram, you'll have to research that for yourself (hint: like functional programming, it involves "lifting"). In the middle of Dolph's explanation, Kev starts to daydream, hence all the invocations of "murphy," an allusion to Morpheus, the Greek god of dreams (also the common Irish surname, Murphy, as well as a slang word meaning both "potato" and "confidence game").

Here's my own interpretation of maryamyriameliamurphies:

- **mary** — A variant of the interjection "marry" common during the early modern period. It expresses surprise or outrage, more or less equivalent to "wow!" Also a mild oath, since it refers to the Virgin Mary (as pure as a monadic interface, she was).
- **myria** — Probably the word myriad, "many people or things." Also the ancient Greek word for 10,000, though used just as often to mean an uncountably large number of things (because who would ever need to count higher than 10,000?).
- **melia** — Similar to the Latin word for a thousand (mille), but it also looks to me like the plural of the Greek word for "honey," which can also be used to describe something sweet (or, at a stretch, the Latin word "meliora" meaning "better than").
- **murphies** — As an allusion to Morpheus, refers to the Greek word for "form" since dreaming is an experience of many forms shifting and changing. A "morphism" is also another word for a "mapping" or "function" in various branches of mathematics, though it's doubtful this would have occurred to Joyce.

#### **maryamyriameliamurphies** — Wow, a whole bunch of sweet functions!

## API

See the [online documentation](http://sjsyrek.github.io/maryamyriameliamurphies.js/) for more extensive explanations and examples. The online docs can also be generated locally with JSDoc if you `git clone` or `npm install` this repo.

### Basic functions
See Haskell [Data.Function](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Function.html#v:-46-) and [Prelude](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html).

- `partial(f, ...as)` Partially applies arguments `as` to function `f`.
- `$(f)` Composes function `f` with another function `g`.
- `flip(f)` Reverses the order of arguments to a function.
- `id(a)` Returns `a`. The identity function.
- `constant(a, b)` Returns `a`, discarding `b`.
- `until(pred, f, x)` Apply `f` to `x` until `pred` is true.
- `and(a, b)` Boolean "and".
- `or(a, b)` Boolean "or".
- `not(a)` Boolean "not".
- `even(a)` Return true if `a` is even.
- `odd(a)` Return true if `a` is odd.
- `isEmpty(a)` Return true if `a` is an empty list, tuple, or array.
- `show(a)` Return a string representation of a value (for data types from this library).
- `print(a)` Display the results of `show` on the console.

### Eq
See Haskell [Eq](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html#t:Eq).

- `isEq(a, b)` Returns true if `a` equals `b`.
- `isNotEq(a, b)` Returns true if `a` does not equal `b`.

### Ord
See Haskell [Ord](http://hackage.haskell.org/package/base-4.8.2.0/docs/Prelude.html#t:Ord).

- `EQ` Ordering for equals.
- `LT` Ordering for less than.
- `GT` Ordering for greater than.
- `compare(a, b)` Return the Ordering of `a` as compared to `b`.
- `lessThan(a, b)` Return true if `a` is less than `b`.
- `lessThanOrEqual(a, b)` Return true if `a` is less than or equal to `b`.
- `greaterThan(a, b)` Return true if `a` is greater than `b`.
- `greaterThanOrEqual(a, b)` Return true if `a` is greater than or equal to `b`.
- `max(a, b)` Return the greater of `a` and `b`.
- `min(a, b)` Return the lesser of `a` and `b`.

### Monoid
See Haskell [Monoid](https://hackage.haskell.org/package/base-4.8.1.0/docs/Data-Monoid.html).

- `mempty(a)` Return the identity for the monoid.
- `mappend(a, b)` Perform an associative operation on two monoids.
- `mconcat(a)` Fold a list using the monoid.

### Functor
See Haskell [Functor](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Functor.html).

- `fmap(f, a)` Map the function `f` over the functor `a`.
- `fmapReplaceBy(a, b)` Replace all `b` with `a` in a functor.

### Applicative
See Haskell [Applicative](https://hackage.haskell.org/package/base-4.8.2.0/docs/Control-Applicative.html).

- `pure(f, a)` Lift `a` into applicative context `f`.
- `ap(f, a)` Apply applicative function `f` to applicative value `a`.
- `apFlip(f, a, b)` `ap` with its arguments reversed.
- `then(a1, a2)` Sequence actions, discarding the value of `a1`.
- `skip(a1, a2)` Sequence actions, discarding the value of `a2`.
- `liftA(f, a)` Lift function `f` into applicative context `a`.
- `liftA2(f, a, b)` Lift binary function `f` into applicative context `a`.

### Monad
See Haskell [Monad](https://hackage.haskell.org/package/base-4.8.2.0/docs/Control-Monad.html).

- `inject(m, a)` Inject value `a` into monadic context `m`.
- `flatMap(m, f)` Bind function `f` to the value contained in monadic context `m`.
- `chain(m, f)` Sequence actions, ignoring the value of the monadic context `m`.
- `bindFlip(f, m)` `bind` with its arguments reversed.
- `join(m)` Remove one level of monadic structure, like `concat`.
- `liftM(f, m)` Lift a function `f` into monadic context `m`.
- `Do(m)` Wrap a monad `m` in a special container for the purpose of chaining actions, in imitation of Haskell's "do" notation.

### Foldable
See Haskell [Foldable](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Foldable.html).

- `fold(a)` Combine the elements of a structure using a monoid.
- `foldMap(f, a)` Map `f` to each element in monoid `a`.
- `foldr(f, z, t)` Fold function `f` over monoid `t` with accumulator `z`.

### Traversable
See Haskell [Traversable](https://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Traversable.html).

- `traverse(f, a)` Map `f` over each element in monoid `a` and collect the results of evaluating each action.
- `mapM(f, m)` `traverse` for monads.
- `sequence(m)` Evaluate each action in monadic structure `m` and collect the results.

### Maybe
See Haskell [Maybe](https://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Maybe.html).

- `just(a)` Insert a value into a Maybe monad, returning `Just a` or `Nothing`.
- `maybe(n, f, m)` Apply `f` to the value in Maybe `m` or return `n` if `m` is `Nothing`.
- `isMaybe(a)` Return true if `a` is a Maybe.
- `isJust(m)` Return true if Maybe `m` is `Just`.
- `isNothing(m)` Return true if Maybe `m` is `Nothing`.
- `fromJust(m)` Extract the value from Maybe `m`, throwing an error if `m` is `Nothing`.
- `fromMaybe(d, m)` Extract the value from Maybe `m`, returning `d` if `m` is `Nothing`.
- `listToMaybe(as)` Return `Nothing` on an empty list or `Just a` where `a` is the first element of the list.
- `maybeToList(m)` Return an empty list if `m` if `Nothing` or a singleton list [`a`] if `m` is `Just a`.
- `catMaybes(as)` Return a list of all `Just` values from a list of Maybes.
- `mapMaybe(f, as)` Map `f` (that returns a Maybe) over a list and return a list of each `Just` result.

### Tuple
See Haskell [Tuple](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-Tuple.html).

- `tuple(...as)` Create a new tuple from any number of values.
- `fst(p)` Return the first element of a tuple.
- `snd(p)` Return the second element of a tuple.
- `curry(f, x, y)` Convert `f` taking arguments `x` and `y` into a curried function.
- `uncurry(f, p)` Convert curried function `f` taking argument tuple pair `p` into an uncurried function.
- `swap(p)` Swap the first two values of a tuple.
- `isTuple(a)` Return true if `a` is a tuple.
- `fromArrayToTuple(a)` Convert an array into a tuple.
- `fromTupleToArray(p)` Convert a tuple into an array.

### List
See Haskell [List](http://hackage.haskell.org/package/base-4.8.2.0/docs/Data-List.html).

#### Basic functions

- `list(...as)` Create a new list from a series of values.
- `listRange(start, end, f, filter)` Create a new list from `start` to `end` using step function `f` with values optionally filtered by `filter`.
- `listFilter(start, end, filter)` Create a new list of consecutive values, filtered using `filter`.
- `listRangeLazy(start, end)` Create a new list of consecutive values from `start` to `end`, using lazy evaluation.
- `listRangeLazyBy(start, end, step)` Create a new list from `start` to `end` incremented by step function `step`, using lazy evaluation.
- `listAppend(as, bs)` Append list `as` to list `bs`.
- `cons(x, xs)` Create a new list with head `x` and tail `xs`.
- `head(as)` Extract the first element of a list.
- `last(as)` Extract the last element of a list.
- `tail(as)` Extract the elements of a list after the head.
- `init(as)` Extract all elements of a list except the last one.
- `uncons(as)` Decompose a list into its head and tail.
- `empty(t)` Test whether a foldable structure is empty.
- `length(as)` Return the length of list.
- `isList(a)` Return true if `a` is a list.
- `fromArrayToList(a)` Convert an array into a list.
- `fromListToArray(as)` Convert a list into an array.
- `fromListToString(as)` Convert a list into a string.
- `fromStringToList(as)` Convert a string into a list.

#### List transformations

- `map(f, as)` Map the function `f` over the elements in list `as`.
- `reverse(as)` Reverse the elements of a list.
- `intersperse(sep, as)` Intersperse the separator `sep` between the elements of `as`.
- `intercalate(xs, xss)` Intersperse the list `xs` between the lists in `xss` (a list of lists).
- `transpose(lss)` Transpose the "rows" and "columns" of a list of lists.

#### Reducing lists

- `foldl(f, z, as)` Fold a list `as` from right to left, using function `f` and accumulator `z`.

#### Special folds

- `concat(xss)` Concatenate the elements in a list of lists.
- `concatMap(f, as)` Map the function `f` (that returns a list) over the list `as` and concatenate the result list.

#### Building lists

- `scanl(f, q, ls)` Reduce a list `ls` from right to left using function `f` and accumulator `q` and return a list of successive reduced values.
- `scanr(f, q0, as)` Like `scanl` but scans the list `as` from right to left.

#### Infinite lists

- `listInf(start)` Return an infinite list of consecutive values beginning with `start`.
- `listInfBy(start, step)` Return an infinite list of values, incremented with function `step`, beginning with `start`.
- `iterate(f, x)` Return an infinite list of repeated applications of `f` to `x`.
- `repeat(a)` Return an infinite list in which all the values are `a`.
- `replicate(n, x)` Return a list of length `n` in which all values are `x`.
- `cycle(as)` Return the infinite repetition of a list.

#### Sublists

- `take(n, as)` Return the prefix of a list of length `n`.
- `drop(n, as)` Return the suffix of a list after discarding `n` values.
- `splitAt(n, as)` Return a tuple in which the first element is the prefix of a list and the second element is the remainder of the list.
- `takeWhile(pred, as)` Return the longest prefix of a list of values that satisfy the predicate function `pred`.
- `dropWhile(pred, as)` Drop values from a list while the predicate function `pred` returns true.
- `span(pred, as)` Return a tuple in which the first element is the longest prefix of a list of values that satisfy the predicate function `pred` and the second element is the rest of the list.
- `spanNot(pred, as)` Return a tuple in which the first element is the longest prefix of a list of values that do not satisfy the predicate function `pred` and the second element is the rest of the list.
- `stripPrefix(as, bs)` Drop the prefix `as` from the list `bs`.
- `group(as)` Take a list and return a list of lists such that the concatenation of the result is equal to the argument. Each sublist in the result contains only equal values.
- `groupBy(eq, as)` Take a list and return a list of lists such that the concatenation of the result is equal to the argument. Each sublist in the result is grouped according to function `eq`.

#### Searching

- `lookup(key, assocs)` Look up `key` in the association list `assocs`.
- `filter(f, as)` Return the list of elements from `as` to satisfy the predicate function `f`.

#### Indexing

- `index(as, n)` Return the value in `as` at index `n`.
- `elemIndex(a, as)` Return the index of the first value in `as` equal to `a` or `Nothing` if there is no such value.
- `elemIndices(a, as)` Return the indices of all values in `as` equal to `a`, in ascending order.
- `find(pred, xs)` Return the first value in `xs` that satisfies the predicate function `pred` or `Nothing` if there is no such value.
- `findIndex(pred, xs)` Return the index of the first value in `xs` that satisfies the predicate function `pred` or `Nothing` if there is no such value.
- `findIndices(pred, xs)` Return the indices of all values in `xs` that satisfy `pred`, in ascending order.

#### Zipping and unzipping lists

- `zip(as, bs)` Take two lists and return a list of corresponding pairs.
- `zip3(as, bs, cs)` `zip` for three lists.
- `zipWith(f, as, bs)` Zip `as` and `bs` using function `f`.
- `zipWith3(f, as, bs, cs)` Zip three lists using function `f`.

#### "Set" operations

- `nub(as)` Remove duplicate values from a list.
- `nubBy(eq, as)` Remove duplicate values from a list, testing equality using function `eq`.
- `deleteL(a, as)` Remove the first occurrence of `a` from `as`.
- `deleteLBy(eq, a, as)` Remove the first occurrence of `a` from `as`, testing equality using function `eq`.
- `deleteFirsts(as, bs)` Remove the first occurrence of each value of `as` from `bs`.
- `deleteFirsts(eq, as, bs)` Remove the first occurrence of each value of `as` from `bs`, using function `eq` to test for equality.

#### Ordered lists

- `sort(as)` Sort a list.
- `sortBy(cmp, as)` Sort a list using comparison function `cmp`.
- `mergeSort(as)` Sort a list using a merge sort algorithm.
- `mergeSortBy(cmp, as)` Merge sort a list using comparison function `cmp`.
- `insert(e, ls)` Insert `e` at the first position in `ls` where it is less than or equal to the next element.
- `insertBy(cmp, e, ls)` Insert `e` at the first position in `ls` using comparison function `cmp`.

### Utility functions

- `throwError(e)` Throws an error with message `e`.
- `defines(...methods)` Defines a type class that requires implementations of `methods`.
- `dataType(a)` Returns the data type of `a` (a synonym for `a.constructor`).
- `type(a)` Returns the type of `a` as defined by this library or `typeof` otherwise.
- `typeCheck(a, b)` Checks whether `a` and `b` are the same type.
