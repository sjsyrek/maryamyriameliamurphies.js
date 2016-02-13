'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tuple = undefined;

var _ord = require('./ord');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Tuple.js

var Tuple = exports.Tuple = function (_Ord) {
  _inherits(Tuple, _Ord);

  function Tuple() {
    _classCallCheck(this, Tuple);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tuple).call(this));

    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    values.forEach(function (value, i) {
      return _this[i + 1] = value;
    });return _this;
  }

  _createClass(Tuple, [{
    key: 'isType',
    value: function isType(y) {
      return Tuple.isTuple(y) ? this.typeOf() === y.typeOf() : false;
    }
  }, {
    key: 'eq',
    value: function eq(y) {
      return this.isType(y) && this.values().every(function (x, i) {
        return x === y.values()[i];
      });
    }
  }, {
    key: 'compare',
    value: function compare(y) {
      if (this.eq(y)) {
        return Ordering.EQ;
      }
      for (var i = 0; i < this.values().length; i += 1) {
        if (this.values()[i] < y.values()[i]) {
          return Ordering.LT;
        }
        if (this.values()[i] > y.values()[i]) {
          return Ordering.GT;
        }
      }
    }
  }, {
    key: 'uncurry',
    value: function uncurry(f) {
      return f.bind(f, this.fst, this.snd);
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
      var _this2 = this;

      return '(' + Reflect.ownKeys(this).map(function (key) {
        return _typeof(_this2[key]);
      }).join(', ') + ')';
    }
  }, {
    key: 'values',

    // Deprecate in ES7
    value: function values() {
      var _this3 = this;

      return Reflect.ownKeys(this).map(function (key) {
        return _this3[key];
      });
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      var _this4 = this;

      return '(' + Reflect.ownKeys(this).map(function (key) {
        return typeof _this4[key] === 'string' ? '\'' + _this4[key] + '\'' : _this4[key];
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
    key: 'isTuple',
    value: function isTuple(x) {
      return x.constructor === Tuple ? true : false;
    }
  }, {
    key: 'from',
    value: function from(arrayLike) {
      var _Array;

      return Reflect.construct(this, (_Array = Array).from.apply(_Array, arguments));
    }
  }, {
    key: 'tuple',
    value: function tuple() {
      for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
      }

      if (values.length === 0) {
        return {};
      }
      if (values.length === 1) {
        return values[0];
      }
      return new (Function.prototype.bind.apply(Tuple, [null].concat(values)))();
    }
  }, {
    key: 'curry',
    value: function curry(f, x, y) {
      return f.bind(f, Reflect.construct(Tuple, [x, y]));
    }
  }]);

  return Tuple;
}(_ord.Ord);
