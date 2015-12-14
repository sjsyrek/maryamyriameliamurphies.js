/*
 * @name maryamyriameliamurphies.js
 *
 * @fileOverview
 * maryamyriameliamurphies.js is a library of Haskell morphisms ported to JavaScript
 * using ECMAScript2015 syntax.
 *
 * See also:
 *
 * - [casualjs](https://github.com/casualjs/f)
 * - [pointfree-fantasy](https://github.com/DrBoolean/pointfree-fantasy)
 *
 * Guide to reading the code
 * -------------------------
 * I defined each Haskell type as an ES2015 class, hewing as closely as I could to the
 * Haskell original but with many concessions to JavaScript and probably a few too many
 * attempts to implement functions as one-liners. I introduce each class with the syntax
 * of its Haskell original and, otherwise, my hope is that most of the functions are
 * self-documenting.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXC = '*** Exception: ';

/**
 * A Type class for determining equality. Implement on an object by defining a
 * function `eq(b)` that returns `true` if that object is equal to `b` and false
 * otherwise. Throws exceptions on invalid arguments.
 * class Eq a where
 *  (==), (/=) :: a -> a -> Bool
 */

var Eq = (function () {
  function Eq() {
    _classCallCheck(this, Eq);
  }

  _createClass(Eq, null, [{
    key: '_classCheck',

    /**
    	* Check whether an object is a member of the Eq type class.
    	* @param {*} a - Any value.
    	* @return {this} If `a` implements an `eq` function, return `this` for chaining.
    	* @private
    	*/
    value: function _classCheck(a) {
      if (typeof a.eq !== 'function') throw new Error(EXC + '\'' + a + '\' is not a member of the \'Eq\' type class.');
      return this;
    }
    /**
    	* Check whether two objects are the same type.
    	* @param {*} a - Any value.
    	* @param {*} b - Any value.
    	* @return {boolean} True if `a` and `b` both have the same constructor.
    	* @private
    	*/

  }, {
    key: '_typeCheck',
    value: function _typeCheck(a, b) {
      if (a.constructor !== b.constructor) throw new Error(EXC + 'Arguments to \'Eq\' must be the same type.');
      return true;
    }
    /**
    	* Check whether two objects that implement Eq are equal. Equivalent to `a === b`.
    	* @param {*} a - Any value.
    	* @param {*} b - Any value.
    	* @return {boolean} True if `a` and `b` are equal.
    	*/

  }, {
    key: 'is',
    value: function is(a, b) {
      return this._classCheck(a)._classCheck(b)._typeCheck(a, b) && a.eq(b) ? true : false;
    }
    /**
    	* The opposite of `is`. Equivalent to `a !== b`.
    	* @param {*} a - Any value.
    	* @param {*} b - Any value.
    	* @return {boolean} True if `a` and `b` are not equal.
    	*/

  }, {
    key: 'isNot',
    value: function isNot(a, b) {
      return !this.is(a, b);
    }
  }]);

  return Eq;
})();

var Ord = (function (_Eq) {
  _inherits(Ord, _Eq);

  function Ord() {
    _classCallCheck(this, Ord);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Ord).apply(this, arguments));
  }

  return Ord;
})(Eq);

/*
class  (Eq a) => Ord a  where
    compare              :: a -> a -> Ordering
    (<), (<=), (>=), (>) :: a -> a -> Bool
    max, min             :: a -> a -> a

        -- Minimal complete definition:
        --      (<=) or compare
        -- Using compare can be more efficient for complex types.
    compare x y
         | x == y    =  EQ
         | x <= y    =  LT
         | otherwise =  GT

    x <= y           =  compare x y /= GT
    x <  y           =  compare x y == LT
    x >= y           =  compare x y /= LT
    x >  y           =  compare x y == GT

-- note that (min x y, max x y) = (x,y) or (y,x)
    max x y
         | x <= y    =  y
         | otherwise =  x
    min x y
         | x <= y    =  x
         | otherwise =  y
*/

var Tuple = (function () {
  function Tuple() {
    var _this2 = this;

    _classCallCheck(this, Tuple);

    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    if (values.length < 2) {
      throw new Error('${EXC}Tuples must be defined with at least two values.');
    } else {
      values.forEach(function (value, i) {
        return _this2[i + 1] = value;
      });
    }
  }

  _createClass(Tuple, [{
    key: 'eq',
    value: function eq(b) {
      var aType = this.typeOf();
      var bType = b.typeOf();
      if (aType === bType) {
        return this.values().every(function (av, i) {
          var bv = b.values()[i];
          if ((typeof av === 'undefined' ? 'undefined' : _typeof(av)) === 'object' || (typeof bv === 'undefined' ? 'undefined' : _typeof(bv)) === 'object') {
            throw new Error('Objects cannot be compared.');
          } else {
            return av === b.values()[i];
          }
        });
      } else {
        throw new Error('' + EXC + aType + ' is not the same type as ' + bType + '.');
      }
    }
  }, {
    key: 'curry',
    value: function curry(f) {
      return f.bind(this, this.fst).bind(f, this.snd);
    }
  }, {
    key: 'uncurry',
    value: function uncurry(f) {
      return f.bind(this, this.fst, this.snd);
    }
  }, {
    key: 'swap',
    value: function swap() {
      return Reflect.construct(Tuple, [this.snd, this.fst]);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[Object Tuple]';
    }
  }, {
    key: 'typeOf',
    value: function typeOf() {
      var _this3 = this;

      return '(' + Reflect.ownKeys(this).map(function (key) {
        return _typeof(_this3[key]);
      }).join(', ') + ')';
    }
  }, {
    key: 'values',

    // Deprecate in ES7
    value: function values() {
      var _this4 = this;

      return Reflect.ownKeys(this).map(function (key) {
        return _this4[key];
      });
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      var _this5 = this;

      return '(' + Reflect.ownKeys(this).map(function (key) {
        return typeof _this5[key] === 'string' ? '\'' + _this5[key] + '\'' : _this5[key];
      }).join(', ') + ')';
    }
  }, {
    key: 'fst',
    get: function get() {
      return this[1];
    }
  }, {
    key: 'snd',
    get: function get() {
      return this[2];
    }
  }], [{
    key: '_error',
    value: function _error(f) {
      throw new Error(EXC + 'Argument to Tuple.' + f + ' is not a Tuple.');
    }
  }, {
    key: 'eq',
    value: function eq(a, b) {
      return Eq.is(a, b);
    }
  }, {
    key: 'isTuple',
    value: function isTuple(o) {
      return o.constructor === Tuple ? true : false;
    }
  }, {
    key: 'from',
    value: function from(arrayLike) {
      var _Array;

      return Reflect.construct(this, (_Array = Array).from.apply(_Array, arguments));
    }
  }, {
    key: 'fst',
    value: function fst(p) {
      if (this.isTuple(p)) return p.fst;else this._error('fst');
    }
  }, {
    key: 'snd',
    value: function snd(p) {
      if (this.isTuple(p)) return p.snd;else this._error('snd');
    }
  }, {
    key: 'curry',
    value: function curry(f, x, y) {
      return Reflect.construct(Tuple, [x, y]).curry(f);
    }
  }, {
    key: 'uncurry',
    value: function uncurry(f, p) {
      if (this.isTuple(p)) return p.uncurry(f);else this._error('uncurry');
    }
  }, {
    key: 'swap',
    value: function swap(p) {
      if (this.isTuple(p)) return p.swap();else this._error('swap');
    }
  }, {
    key: 'typeOf',
    value: function typeOf(p) {
      if (this.isTuple(p)) return p.typeOf();else this._error('typeOf');
    }
  }]);

  return Tuple;
})();

///////////////////////////////////////////////////////////////////////////////
// Tests

// Tuple tests

var p1 = new Tuple(1, 2);
var p2 = new Tuple(3, 4);
var p3 = Tuple.from([1, 2]);
var p4 = Tuple.swap(p2);
var p5 = new Tuple(10, 20, 30, 40, 50);
var subtract = function subtract(a, b) {
  return a - b;
};
var curried = Tuple.curry(subtract, 100, 98);
var uncurried = Tuple.uncurry(curried, p2);

console.log('Tuples:\n             p1.typeOf():       ' + p1.typeOf() + ' // (number, number)\n             p1.fst:            ' + p1.fst + ' // 1\n             p1.snd:            ' + p1.snd + ' // 2\n             p3.valueOf():      ' + p3.valueOf() + ' // (1, 2)\n             Tuple.isTuple(p4): ' + Tuple.isTuple(p4) + ' // true\n             Eq(p1, p3):        ' + Eq.is(p1, p3) + ' // true\n             Eq(p1, p2):        ' + Eq.is(p1, p2)); // false

// console.log(`Eq(p1, p5):       ${Eq.is(p1, p5)}`); *** Exception: (number, number) is not the same type as (number, number, number, number, number).

console.log(uncurried()); // 2
