"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _asset = _interopRequireDefault(require("../../../models/asset"));
var _autotrade = _interopRequireDefault(require("../../models/autotrade"));
var _simulateprofit = _interopRequireDefault(require("./simulateprofit"));
var _simulateloss = _interopRequireDefault(require("./simulateloss"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function findGreaterValue(value1, value2) {
  if (value1 > value2) {
    return value1;
  } else if (value2 > value1) {
    return value2;
  } else {
    return "Both values are equal";
  }
}
function createmarketrade(_x, _x2) {
  return _createmarketrade.apply(this, arguments);
}
function _createmarketrade() {
  _createmarketrade = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(autotrade, i) {
    var tradeStatus, assetinhold, assetoutofhold, initialusddeposit, autotrd, usdval, buyorder, sellorder, _currentusdbalance, assetaorder, assetborder, greaterval, _greaterval, _autotrd, neworders, autotradeorders;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //the asset to buy or sell are meant to be returned based on the operation below
          tradeStatus = autotrade.tradeStatus;
          _context.next = 4;
          return _asset["default"].findOne({
            _id: autotrade.assettobuy
          });
        case 4:
          assetinhold = _context.sent;
          _context.next = 7;
          return _asset["default"].findOne({
            _id: autotrade.assettosell
          });
        case 7:
          assetoutofhold = _context.sent;
          if (!(assetinhold && assetoutofhold)) {
            _context.next = 46;
            break;
          }
          if (autotrade.initialusddeposit) {
            _context.next = 17;
            break;
          }
          initialusddeposit = autotrade.quantity * autotrade.price;
          _context.next = 13;
          return _autotrade["default"].findOne({
            _id: autotrade._id
          });
        case 13:
          autotrd = _context.sent;
          autotrd.initialusddeposit = initialusddeposit;
          _context.next = 17;
          return autotrd.save();
        case 17:
          if (!autotrade.initialusddeposit) {
            _context.next = 46;
            break;
          }
          usdval = autotrade.usdbalance ? autotrade.usdbalance : autotrade.initialusddeposit;
          if (!(tradeStatus === 'profit')) {
            _context.next = 26;
            break;
          }
          _context.next = 22;
          return (0, _simulateprofit["default"])(assetinhold, usdval);
        case 22:
          assetaorder = _context.sent;
          _context.next = 25;
          return (0, _simulateprofit["default"])(assetoutofhold, usdval);
        case 25:
          assetborder = _context.sent;
        case 26:
          if (!(tradeStatus === 'loss')) {
            _context.next = 33;
            break;
          }
          _context.next = 29;
          return (0, _simulateloss["default"])(assetinhold, usdval);
        case 29:
          assetaorder = _context.sent;
          _context.next = 32;
          return (0, _simulateloss["default"])(assetoutofhold, usdval);
        case 32:
          assetborder = _context.sent;
        case 33:
          if (assetaorder && !assetborder) {
            if (assetaorder.side === 'buy') {
              buyorder = assetaorder;
              _currentusdbalance = buyorder.total;

              //console.log(currentusdbalance);
            }
            if (assetaorder.side === 'sell') {
              sellorder = assetaorder;
            }
          }
          if (!assetaorder && assetborder) {
            if (assetborder.side === 'buy') {
              buyorder = assetborder;
              _currentusdbalance = buyorder.total;

              //console.log(currentusdbalance);
            }
            if (assetborder.side === 'sell') {
              sellorder = assetborder;
            }
          }
          if (assetaorder && assetborder) {
            if (assetaorder.side !== 'buy' && assetborder.side === 'buy') {
              buyorder = assetborder;
              sellorder = assetaorder;
              _currentusdbalance = buyorder.total;

              //console.log(currentusdbalance);
            } else if (assetaorder.side === 'buy' && assetborder.side !== 'buy') {
              buyorder = assetaorder;
              sellorder = assetborder;
              _currentusdbalance = buyorder.total;

              //console.log(currentusdbalance);
            } else if (assetaorder.side === 'buy' && assetborder.side === 'buy') {
              greaterval = findGreaterValue(assetaorder.total, assetborder.total);
              if (greaterval === assetaorder.total) {
                buyorder = assetaorder;
                sellorder = null;
                _currentusdbalance = buyorder.total;
                console.log(_currentusdbalance);
              } else if (greaterval === assetborder.total) {
                buyorder = assetborder;
                sellorder = null;
                _currentusdbalance = buyorder.total;
              } else {
                buyorder = assetborder;
                sellorder = null;
                _currentusdbalance = buyorder.total;

                //console.log(currentusdbalance);
              }
            } else if (assetaorder.side === 'sell' && assetborder.side === 'sell') {
              _greaterval = findGreaterValue(assetaorder.total, assetborder.total);
              if (_greaterval === assetaorder.total) {
                buyorder = null;
                sellorder = assetborder;
              } else if (_greaterval === assetborder.total) {
                buyorder = null;
                sellorder = assetaorder;
              } else {
                buyorder = null;
                sellorder = assetaorder;
              }
            }
          }
          _context.next = 38;
          return _autotrade["default"].findOne({
            _id: autotrade._id
          });
        case 38:
          _autotrd = _context.sent;
          neworders = [];
          if (buyorder !== null && buyorder !== undefined) {
            neworders.push(buyorder);
          }
          if (sellorder !== null && sellorder !== undefined) {
            neworders.push(sellorder);
          }
          autotradeorders = [].concat(neworders, _toConsumableArray(_autotrd.orders));
          _autotrd.orders = autotradeorders;
          if (_currentusdbalance) {
            _autotrd.usdbalance = _currentusdbalance;
          }
          _autotrd.save();

          //console.log(autotrd, currentusdbalance);
        case 46:
          _context.next = 52;
          break;
        case 48:
          _context.prev = 48;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          console.log(currentusdbalance, 'see err');
        case 52:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 48]]);
  }));
  return _createmarketrade.apply(this, arguments);
}
var _default = exports["default"] = createmarketrade;