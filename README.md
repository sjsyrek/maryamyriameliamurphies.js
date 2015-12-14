> All told, a monad in _X_ is just a monoid in the category of endofunctors of _X_, with product × replaced by composition of endofunctors and unit set by the identity endofunctor.
> — Saunders Mac Lane, [_Categories for the Working Mathematician_](http://bit.ly/1MbDPv3)

> In general, an arrow type will be a parameterised type with _two_ parameters, supporting operations analogous to _return_ and >>=. Just as we think of a monadic type _m a_ as representing a 'computation delivering an _a_', so we think of an arrow type _a b c_ (that is, the application of the parameterised type _a_ to the two parameters _b_ and _c_) as representing a 'computation with input of type _b_ delivering a _c_'.
> — John Hughes, [_Generalising monads to arrows_](http://www.sciencedirect.com/science/article/pii/S0167642399000234)

> In mathematics, a functor is a type of mapping between categories which is applied in category theory. Functors can be thought of as homomorphisms between categories. In the category of small categories, functors can be thought of more generally as morphisms.
> — Wikipedia, [_Functor_](https://en.wikipedia.org/wiki/Functor)

> murphy come, murphy go, murphy plant, murphy grow, a maryamyriameliamurphies, in the lazily eye of his lapis
> — James Joyce, [_Finnegans Wake_](http://www.trentu.ca/faculty/jjoyce/fw-293.htm)

# maryamyriameliamurphies.js

maryamyriameliamurphies.js is a library of [Haskell](https://www.haskell.org) data types, type classes, and morphisms translated into [JavaScript ES2015](http://www.ecma-international.org/ecma-262/6.0/) syntax. Because if you don't program with morphisms in mind, you are more likely to be menaced by [Murphy's Law](https://en.wikipedia.org/wiki/Murphy%27s_law). Just don't go thinking the average explanation of functional programming terminology makes any more sense to the average reader than the average page of _Finnegans Wake_. All you need to know—in fact, all I understand—is that a pure function (or a morphism in general) simply describes how one thing turns into another. So a functional program, like Joyce's final work, is an extended abstraction of changes. Many of these are similarly experiments in poetic coding but so much the better if any of them turn out to be useful.

I developed this code using [Babel](http://babeljs.io/) and tested the transpiled ES5 output in Chrome. Since it uses the ES2015 [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) object, you will need to install the [babel-polyfill](http://babeljs.io/docs/usage/polyfill/) package or copy the code from `polyfill.js` to get it to work in [node](https://nodejs.org/en/) or the browser.

## Eq


## Ord


## Tuple

