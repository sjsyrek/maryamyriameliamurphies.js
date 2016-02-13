# maryamyriameliamurphies.js
[![Apache 2.0 licensed](https://img.shields.io/badge/license-Apache2.0-blue.svg)](./LICENSE.txt)

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

If you install with npm or at least have it on your system, ES2015 to ES5 transpiling, linting, and testing are automated through the following commands:

- `npm run compile` - run babel on `/source/index.js` and output to `/distribution/index.js`
- `npm run lint` - run eslint on `/source/index.js` and `/distribution/index.js`
- `npm run test` - run mocha using babel on all files imported into `/test/index.js`
- `npm run build` - compile and test

## Description

Since the average explanation of functional programming terminology makes about as much sense to the average reader as the average page of _Finnegans Wake_, I gave this library a whimsical, literary name. Also, I'm an English literature Ph.D. student, and functional code strikes me as poetic (as "composed" in multiple senses) even though the technical explanations are impenetrably obtuse. All you need to know—in fact, all I understand—is that a pure function (or a morphism in general) simply describes how one thing can predictably transform into another. So a functional program, much like Joyce's final work, is an extended description of how things change.

These functions are experimental, as Haskell's type system translates only awkwardly to a JavaScript idiom, but I'd be delighted if any of them turn out to be useful. I tried hard to make them as pure as possible, which is why most (but not all) of them accept as arguments and return as values single values, and very few are defined as methods on prototypes.

I developed the code using the [Babel](http://babeljs.io/) package on [node.js](https://nodejs.org/en/), linted both source and distribution code with the [babel-eslint](https://github.com/babel/babel-eslint) parser for the latest version of [ESLint](http://eslint.org), and tested the transpiled ES5 output with [Mocha](http://mochajs.org) and the [should.js](http://shouldjs.github.io) assertion library. Since it uses the ES2015 [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) object, you will need to install the [babel-polyfill](http://babeljs.io/docs/usage/polyfill/) package with [npm](https://www.npmjs.com) and include it in your project or copy and paste the code from `polyfill.js` to get it to work in [node](https://nodejs.org/en/) or the browser, respectively.

ES2015 code is located in the `/source` directory and babel-transpiled ES5 code in the `/distribution` directory. Mocha tests are in `/test` and example projects are in `/examples`.

There are two Haskell concepts that I use in the code that do not perfectly fit into the JavaScript way of doing things: the type class and the data type. In Haskell, a type class is similar to a protocol or trait in other programming languages. It describes an interface that objects conforming to it must implement.

A type class is a way of making fully parameterized types more useful by placing certain constraints on them. For example, the `Eq` type class in this library provides functionality for comparing whether the objects that implement it are equal. Objects that provide their own `eq()` function will perform this test and return a `boolean`. Note that Haskell type classes are in no way comparable to "classes" in OOP.

A data type, on the other hand, is much closer to an OO class definition, as it does describe a custom type. My `Tuple` type is an example of a data type, as it represents a container for other, more basic values. As is often the case with objects in classical languages, instances of Haskell data types are created with special constructor functions that initialize them based on the arguments to those functions. A data type does not inherit from other data types, however. Instead, it describes how constructor functions convert values passed in as arguments to those functions to the values that comprise that particular type.

As mentioned above, data types can be constrained (or not) by type classes, so as to provide additional functionality—`Eq` is an example of this, as is `Ord`, a type class that allows objects to be compared (greater than, less than, etc.). `Tuple` implements both of these type classes, as one may rightly want to compare tuples or test them for equality.

Since JavaScript is not a strongly typed language by nature, it seemed unnecessary to me (and, for better or worse, antithetical to the JS spirit) to recreate the entirety of Haskell's static type system, though I do provide a limited amount of type checking. Anyone interested in such a thing should probably be using something like [PureScript](http://www.purescript.org) or [GHCJS](https://github.com/ghcjs/ghcjs). Instead, I use the new ES2015 `class` pattern for data types with static methods defined on those classes to provide the functionality of type classes. Since the classes and their constructors are not exposed in the API this library provides, instances of data types must be created using specialized functions provided for this purpose. This keeps the static "type class" methods private and affords some degree of namespace protection for the data types.

ES2015 features [tail call optimization](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-11.html#%_sec_1.2.1), which will ensure that all the nifty Haskell-esque recursions this library uses won't blow up your call stack. When it's [actually implemented](http://babeljs.io/docs/learn-es2015/#tail-calls).

## See also

- [casualjs](https://github.com/casualjs/f)
- [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
