"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _asset = _interopRequireDefault(require("../../models/asset"));
var _wallet2 = _interopRequireDefault(require("../../userwallet/models/wallet"));
var _allowedpairs = _interopRequireDefault(require("../utilities/allowedpairs"));
var _authenticateToken = _interopRequireDefault(require("../../utils/authenticateToken"));
var _tradeOrder = _interopRequireDefault(require("../models/tradeOrder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var tradercontroller = _express["default"].Router();
tradercontroller.get('/trader/pairs', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var assetmenu, pairs, filteredpairs;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          assetmenu = req.query.assetmenu;
          if (!assetmenu) {
            _context.next = 9;
            break;
          }
          _context.next = 5;
          return (0, _allowedpairs["default"])();
        case 5:
          pairs = _context.sent;
          filteredpairs = pairs.filter(function (pair) {
            return pair.type === assetmenu;
          });
          res.status(200).send({
            pairs: filteredpairs
          });
          return _context.abrupt("return");
        case 9:
          res.status(200).send({
            pairs: _allowedpairs["default"]
          });
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 12]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/initialpair', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var baseassetinitials, pairs, initialpair;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          baseassetinitials = req.query.baseassetinitials;
          if (!baseassetinitials) {
            _context2.next = 8;
            break;
          }
          _context2.next = 5;
          return (0, _allowedpairs["default"])();
        case 5:
          pairs = _context2.sent;
          initialpair = pairs.filter(function (pair) {
            return pair.left === baseassetinitials;
          })[0];
          res.status(200).send({
            initialpair: initialpair
          });
        case 8:
          _context2.next = 14;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/getassetbyinitials', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var assetinitials, asset;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          assetinitials = req.query.assetinitials;
          _context3.next = 4;
          return _asset["default"].findOne({
            symbol: assetinitials
          });
        case 4:
          asset = _context3.sent;
          if (asset) {
            res.status(200).send({
              asset: asset
            });
          } else {
            res.status(404).send({
              asset: null,
              message: 'asset not found'
            });
          }
          _context3.next = 11;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/getpairprice', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$query, baseassetid, quoteassetid, base, quote, pairprice;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$query = req.query, baseassetid = _req$query.baseassetid, quoteassetid = _req$query.quoteassetid;
          _context4.next = 4;
          return _asset["default"].findOne({
            _id: baseassetid
          });
        case 4:
          base = _context4.sent;
          _context4.next = 7;
          return _asset["default"].findOne({
            _id: quoteassetid
          });
        case 7:
          quote = _context4.sent;
          pairprice = base.price / quote.price;
          res.status(200).send({
            pairprice: pairprice,
            baseassetpriceUSD: base.price
          });
          _context4.next = 15;
          break;
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 12]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/pairorders', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var pairprice, pairpricenumber, orders, sellorders, buyorders;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          pairprice = req.query.pairprice;
          pairpricenumber = parseFloat("".concat(pairprice).replace(/[,;]/g, ""));
          _context6.next = 5;
          return Promise.all(Array.from({
            length: 80
          }, /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(_, i) {
              var price, random, randomtwo, randomthree, randomfour, randomfive, randomsix, pricenumber, amount, side, order;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    price = "".concat(parseFloat(pairpricenumber.toFixed(4)));
                    random = generateRandomIntegerBetween(3, 8);
                    randomtwo = generateRandomIntegerBetween(3, 8);
                    randomthree = generateRandomIntegerBetween(3, 8);
                    randomfour = generateRandomIntegerBetween(3, 8);
                    randomfive = generateRandomIntegerBetween(3, 8);
                    randomsix = generateRandomIntegerBetween(3, 8);
                    pricenumber = Number("".concat(price).concat(random).concat(randomtwo));
                    amount = generateRandomIntegerBetween(1, 40);
                    side = i % 2 === 0 ? 'buy' : 'sell';
                    order = {
                      price: "".concat(price).concat(random).concat(randomtwo),
                      amount: "".concat(amount, ".").concat(randomthree).concat(randomfour).concat(randomfive).concat(randomsix),
                      total: (pricenumber * amount).toFixed(3),
                      side: side
                    };
                    return _context5.abrupt("return", order);
                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function (_x11, _x12) {
              return _ref6.apply(this, arguments);
            };
          }()));
        case 5:
          orders = _context6.sent;
          sellorders = orders.filter(function (order) {
            return order.side === 'sell';
          });
          buyorders = orders.filter(function (order) {
            return order.side === 'buy';
          });
          res.status(200).send({
            buyorders: buyorders,
            sellorders: sellorders
          });
          _context6.next = 14;
          break;
        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 14:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 11]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/markettrades', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var pairprice, pairpricenumber, marketorders;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          pairprice = req.query.pairprice;
          pairpricenumber = parseFloat("".concat(pairprice).replace(/[,;]/g, ""));
          _context8.next = 5;
          return Promise.all(Array.from({
            length: 40
          }, /*#__PURE__*/function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(_, i) {
              var price, random, randomtwo, randomthree, randomfour, randomfive, randomsix, pricenumber, amount, side, order;
              return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    price = "".concat(parseFloat(pairpricenumber.toFixed(4)));
                    random = generateRandomIntegerBetween(3, 8);
                    randomtwo = generateRandomIntegerBetween(3, 8);
                    randomthree = generateRandomIntegerBetween(3, 8);
                    randomfour = generateRandomIntegerBetween(3, 8);
                    randomfive = generateRandomIntegerBetween(3, 8);
                    randomsix = generateRandomIntegerBetween(3, 8);
                    pricenumber = Number("".concat(price).concat(random).concat(randomtwo));
                    amount = generateRandomIntegerBetween(1, 40);
                    side = Math.random() < 0.5 ? 'buy' : 'sell';
                    order = {
                      price: "".concat(price).concat(random).concat(randomtwo),
                      amount: "".concat(amount, ".").concat(randomthree).concat(randomfour).concat(randomfive).concat(randomsix),
                      total: (pricenumber * amount).toFixed(3),
                      side: side
                    };
                    return _context7.abrupt("return", order);
                  case 12:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function (_x15, _x16) {
              return _ref8.apply(this, arguments);
            };
          }()));
        case 5:
          marketorders = _context8.sent;
          res.status(200).send({
            marketorders: marketorders
          });
          _context8.next = 12;
          break;
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 9]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/headerdetails', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$query2, assetid, pairprice, min, max, baseassetvol, quoteassetvol, baseassethigh, baseassetlow, twentyfourhrchange, baseassetprice, asset;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$query2 = req.query, assetid = _req$query2.assetid, pairprice = _req$query2.pairprice;
          min = 1444.03;
          max = 25796.50;
          _context9.next = 6;
          return _asset["default"].findOne({
            _id: assetid
          });
        case 6:
          asset = _context9.sent;
          baseassetprice = asset.price;
          baseassetvol = generateRandomIntegerBetween(min, max).toFixed(2);
          quoteassetvol = generateRandomIntegerBetween(min, max).toFixed(2);
          baseassethigh = adjustNumber(pairprice, 'add');
          baseassetlow = adjustNumber(pairprice, 'subtract');
          res.status(200).send({
            baseassetprice: baseassetprice,
            baseassetvol: baseassetvol,
            quoteassetvol: quoteassetvol,
            baseassethigh: baseassethigh,
            baseassetlow: baseassetlow
          });
          _context9.next = 19;
          break;
        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).send({
            error: 'An error occurred'
          });
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 15]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
tradercontroller.post('/trader/createorder', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var _req$query3, tradetype, ordertype, _id, asset, wallet, _tradeorder, assetid, assetbalance, amountdeductable, balance, newbalance, assetbalanceupdate, update, options, marketorder, orderdetails, assetfrom, assetto, amountfrom, amountto, walletid, _wallet, balances, balancefrom, balanceto, assettobalance, _newbalance, _update, _options, _tradeorder2, tradeorder;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (!(req.user && req.user._id)) {
            _context10.next = 66;
            break;
          }
          _context10.prev = 1;
          _req$query3 = req.query, tradetype = _req$query3.tradetype, ordertype = _req$query3.ordertype;
          if (!(tradetype === 'automatic')) {
            _context10.next = 25;
            break;
          }
          _id = req.body.orderdetails.assetbalancededucted;
          _context10.next = 7;
          return _asset["default"].findOne({
            _id: _id
          });
        case 7:
          asset = _context10.sent;
          _context10.next = 10;
          return _wallet2["default"].findOne({
            _id: req.body.wallet
          });
        case 10:
          wallet = _context10.sent;
          _tradeorder = new _tradeOrder["default"](req.body);
          _tradeorder.orderdetails.totalinvestment = _tradeorder.orderdetails.total * asset.price;
          _context10.next = 15;
          return _tradeorder.save();
        case 15:
          if (!asset) {
            _context10.next = 22;
            break;
          }
          assetid = getStringFromObjectId(asset._id);
          assetbalance = wallet.balances.find(function (blc) {
            return blc.asset_id === assetid;
          });
          amountdeductable = _tradeorder.orderdetails.total;
          if (assetbalance) {
            balance = assetbalance.balance;
            newbalance = balance - parseFloat(amountdeductable);
            assetbalance.balance = newbalance;
            assetbalanceupdate = [assetbalance].concat(_toConsumableArray(wallet.balances.filter(function (blc) {
              return blc.asset_id !== assetid;
            })));
            update = {
              $set: {
                balances: assetbalanceupdate
              }
            };
            options = {
              "new": true,
              upsert: true
            };
            _wallet2["default"].findOneAndUpdate({
              _id: req.body.wallet
            }, update, options).then(function (updatedWallet) {
              if (updatedWallet) {
                //console.log('Successfully updated wallet:', updatedWallet);
                res.status(201).send({
                  message: 'order created',
                  tradeorder: _tradeorder,
                  updatedWallet: updatedWallet
                });
              } else {
                console.log('No wallet matches the provided query.');
              }
            })["catch"](function (err) {
              return console.error("Failed to find and update wallet: ".concat(err));
            });
          }
          _context10.next = 24;
          break;
        case 22:
          res.status(404).send({
            message: 'not found'
          });
          return _context10.abrupt("return");
        case 24:
          return _context10.abrupt("return");
        case 25:
          if (!(ordertype === 'Market')) {
            _context10.next = 56;
            break;
          }
          marketorder = req.body;
          orderdetails = marketorder.orderdetails;
          _context10.next = 30;
          return _asset["default"].findOne({
            _id: orderdetails.assetfrom
          });
        case 30:
          assetfrom = _context10.sent;
          _context10.next = 33;
          return _asset["default"].findOne({
            _id: orderdetails.assetto
          });
        case 33:
          assetto = _context10.sent;
          if (!(assetfrom && assetto)) {
            _context10.next = 54;
            break;
          }
          amountfrom = parseFloat(orderdetails.amountfrom);
          amountto = parseFloat(orderdetails.amountto);
          walletid = marketorder.wallet;
          _context10.next = 40;
          return _wallet2["default"].findOne({
            _id: walletid
          });
        case 40:
          _wallet = _context10.sent;
          balances = _wallet.balances.filter(function (blc) {
            return blc && blc !== null && blc.asset_id;
          });
          balancefrom = balances.find(function (blc) {
            return blc.asset_id === getStringFromObjectId(assetfrom._id);
          });
          balancefrom.balance = balancefrom.balance - amountfrom;
          balanceto = balances.find(function (blc) {
            return blc.asset_id === getStringFromObjectId(assetto._id);
          });
          if (balanceto) {
            balanceto.balance = balanceto.balance + amountto;
            assettobalance = balanceto;
            _newbalance = [].concat(_toConsumableArray(balances.filter(function (blc) {
              return blc.asset_id !== getStringFromObjectId(assetfrom._id) && blc.asset_id !== getStringFromObjectId(assetto._id);
            })), [balanceto, balancefrom]);
          } else {
            assettobalance = {
              asset_id: getStringFromObjectId(assetto._id),
              balance: amountto,
              assetname: assetto.name
            };
            _newbalance = [].concat(_toConsumableArray(balances.filter(function (blc) {
              return blc.asset_id !== getStringFromObjectId(assetfrom._id);
            })), [balancefrom, assettobalance]);
          }
          _update = {
            $set: {
              balances: _newbalance
            }
          };
          _options = {
            "new": true,
            upsert: true
          };
          _tradeorder2 = new _tradeOrder["default"](req.body);
          _context10.next = 51;
          return _tradeorder2.save();
        case 51:
          _wallet2["default"].findOneAndUpdate({
            _id: req.body.wallet
          }, _update, _options).then(function (updatedWallet) {
            if (updatedWallet) {
              //console.log('Successfully updated wallet:', updatedWallet);
              res.status(201).send({
                message: 'order created',
                tradeorder: _tradeorder2,
                updatedWallet: updatedWallet
              });
            } else {
              console.log('No wallet matches the provided query.');
            }
          })["catch"](function (err) {
            return console.error("Failed to find and update wallet: ".concat(err));
          });
          _context10.next = 55;
          break;
        case 54:
          res.status(404).send({
            message: 'assets not found'
          });
        case 55:
          return _context10.abrupt("return");
        case 56:
          tradeorder = new _tradeOrder["default"](req.body); //console.log(tradeorder);
          _context10.next = 59;
          return tradeorder.save();
        case 59:
          res.status(201).send({
            message: 'order created',
            tradeorder: tradeorder
          });
          _context10.next = 66;
          break;
        case 62:
          _context10.prev = 62;
          _context10.t0 = _context10["catch"](1);
          console.log(_context10.t0);
          res.status(500).send({
            message: 'an error occured'
          });
        case 66:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 62]]);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/gettradeorders', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var wallet, tradeorders;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          if (!(req.user && req.user._id)) {
            _context11.next = 12;
            break;
          }
          _context11.prev = 1;
          wallet = req.query.wallet;
          _context11.next = 5;
          return _tradeOrder["default"].find({
            wallet: wallet
          });
        case 5:
          tradeorders = _context11.sent;
          res.status(201).send({
            message: 'orders found',
            tradeorders: tradeorders
          });
          _context11.next = 12;
          break;
        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](1);
          console.log(_context11.t0);
        case 12:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[1, 9]]);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
tradercontroller.put('/trader/cancelorder', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var orderid, tradeorder;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!(req.user && req.user._id)) {
            _context12.next = 16;
            break;
          }
          _context12.prev = 1;
          orderid = req.query.orderid;
          _context12.next = 5;
          return _tradeOrder["default"].findOne({
            _id: orderid
          });
        case 5:
          tradeorder = _context12.sent;
          tradeorder.active = false;
          tradeorder.state = 'closed';
          _context12.next = 10;
          return tradeorder.save();
        case 10:
          res.status(201).send({
            message: 'orders closed',
            tradeorder: tradeorder
          });
          _context12.next = 16;
          break;
        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](1);
          console.log(_context12.t0);
        case 16:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 13]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
tradercontroller.get('/trader/getautotrades', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var orderid, tradeorder, assetitem, orders;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          if (!(req.user && req.user._id)) {
            _context13.next = 16;
            break;
          }
          _context13.prev = 1;
          orderid = req.query.orderid;
          _context13.next = 5;
          return _tradeOrder["default"].findOne({
            _id: orderid
          });
        case 5:
          tradeorder = _context13.sent;
          _context13.next = 8;
          return _asset["default"].findOne({
            symbol: getBaseSymbol(tradeorder.tradepair)
          });
        case 8:
          assetitem = _context13.sent;
          orders = generateOrdersDatesSixSecondsApart(tradeorder.orderdetails.total, parseFloat(assetitem.price));
          res.status(201).send({
            orders: orders
          });
          _context13.next = 16;
          break;
        case 13:
          _context13.prev = 13;
          _context13.t0 = _context13["catch"](1);
          console.log(_context13.t0);
        case 16:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[1, 13]]);
  }));
  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}());
function generateOrdersDatesSixSecondsApart(amnt, assetprice) {
  var orders = [];
  var now = new Date();
  for (var i = 0; i < 8; i++) {
    // Create a new date for each iteration, 6 seconds apart
    var date = new Date(now.getTime() - i * 6 * 1000); // 1000 milliseconds in a second
    var amount = generateRandomIntegerBetween(1, amnt);
    var price = generateRandomNumber() * amnt * assetprice;
    var side = Math.random() < 0.5 ? 'buy' : 'sell';
    var cleaneddate = new Date(date);
    var humanReadableDate = cleaneddate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    });
    orders.push({
      date: humanReadableDate,
      amount: amount,
      price: price,
      side: side
    });
  }
  return orders;
}
function generateRandomNumber() {
  var min = 0.005;
  var max = 0.8;
  return Math.random() * (max - min) + min;
}
function getBaseSymbol(pair) {
  return pair.split('/')[0];
}
function generateRandomIntegerBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function adjustNumber(number, operation) {
  // Define the proportion of the adjustment relative to the number's size
  var proportion = 0.05; // 5% for demonstration, adjust as needed

  // Calculate the adjustment amount
  var adjustment = number * proportion;
  var result;

  // Perform the operation
  if (operation === 'add') {
    result = number + adjustment;
  } else if (operation === 'subtract') {
    result = number - adjustment;
  } else {
    throw new Error('Invalid operation. Use "add" or "subtract".');
  }

  // Round the result to 4 decimal places and ensure the result is a number
  return parseFloat(result).toFixed(4);
}
function generateRandomPercentageWithDirectionAndColor() {
  // Generate a random percentage between 1 and 11
  var percentage = Math.random() * 10 + 1;

  // Randomly choose 'up' or 'down'
  var isUp = Math.random() < 0.5;
  var direction = isUp ? '#0ecb81' : 'down';

  // Format the percentage with the correct sign and precision
  var formattedPercentage = isUp ? "+".concat(percentage.toFixed(2), "%") : "-".concat(percentage.toFixed(2), "%");

  // Assign colors
  var color = isUp ? 'green' : '#f6465d';

  // Return an object with the formatted percentage, direction, and color
  return {
    percentage: formattedPercentage,
    direction: direction,
    color: color
  };
}
function getStringFromObjectId(objectId) {
  return objectId.toString();
}
var _default = exports["default"] = tradercontroller;