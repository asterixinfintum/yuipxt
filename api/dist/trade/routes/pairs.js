"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _pair = _interopRequireDefault(require("../../models/pair"));
var _updatetradingpairsorders = _interopRequireDefault(require("../updatetradingpairsorders.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var pairs = _express["default"].Router();
function specifichours(dataArray, hrs) {
  // Check if the array is empty
  if (dataArray.length === 0) return [];

  // Convert the first datetime to a Unix timestamp
  var startTime = Date.parse(dataArray[0].datetime) / 1000;
  var endTime = startTime + hrs * 3600; // 24 hours later in seconds

  // Filter and transform the data
  return dataArray.map(function (data) {
    return {
      time: Date.parse(data.datetime) / 1000,
      value: data.price
    };
  }).filter(function (item) {
    return item.time >= startTime && item.time < endTime;
  });
}
function getFirst15MinutesData(dataArray) {
  if (dataArray.length === 0) return [];

  // Convert the first datetime to a Unix timestamp
  var startTime = Date.parse(dataArray[0].datetime) / 1000;
  var endTime = startTime + 15 * 60; // 15 minutes later in seconds

  // Filter and transform the data
  return dataArray.map(function (data) {
    return {
      time: Date.parse(data.datetime) / 1000,
      value: data.price
    };
  }).filter(function (item) {
    return item.time >= startTime && item.time < endTime;
  });
}
function filterHourlyItems(dataArray) {
  if (dataArray.length === 0) return [];
  var result = [];
  var lastTimestamp = dataArray[0].time;

  // Always include the first item
  result.push(dataArray[0]);
  dataArray.forEach(function (item) {
    if (item.time >= lastTimestamp + 3600) {
      result.push(item);
      lastTimestamp = item.time;
    }
  });
  return result;
}
pairs.get('/pairs', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$query, baseAssetId, quoteAssetId, query, _pairs;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, baseAssetId = _req$query.baseAssetId, quoteAssetId = _req$query.quoteAssetId;
          query = {};
          if (!baseAssetId) {
            _context.next = 6;
            break;
          }
          if (mongoose.Types.ObjectId.isValid(baseAssetId)) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", res.status(400).send({
            error: 'Invalid baseAssetId'
          }));
        case 5:
          query.baseAssetId = baseAssetId;
        case 6:
          if (!quoteAssetId) {
            _context.next = 10;
            break;
          }
          if (mongoose.Types.ObjectId.isValid(quoteAssetId)) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", res.status(400).send({
            error: 'Invalid quoteAssetId'
          }));
        case 9:
          query.quoteAssetId = quoteAssetId;
        case 10:
          _context.prev = 10;
          _context.next = 13;
          return _pair["default"].find(query);
        case 13:
          _pairs = _context.sent;
          res.status(200).send({
            pairs: _pairs
          });
          _context.next = 21;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](10);
          console.error('Error fetching pairs:', _context.t0);
          res.status(500).send({
            error: 'An error occurred while fetching pairs.'
          });
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[10, 17]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
pairs.get('/pairs/by-base-vtwo', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var baseAsset, pairitems, result, _iterator, _step, pairitem, pairprice, pricedifference, item;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          baseAsset = req.query.baseAsset;
          if (baseAsset) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context2.next = 5;
          return _pair["default"].find({
            listed: true
          });
        case 5:
          pairitems = _context2.sent;
          result = []; //console.log(pairitems.length, 'check here')
          _iterator = _createForOfIteratorHelper(pairitems);
          _context2.prev = 8;
          _iterator.s();
        case 10:
          if ((_step = _iterator.n()).done) {
            _context2.next = 22;
            break;
          }
          pairitem = _step.value;
          _context2.next = 14;
          return pairitem.calculatePrice();
        case 14:
          pairprice = _context2.sent;
          _context2.next = 17;
          return pairitem.calculatepricedifference();
        case 17:
          pricedifference = _context2.sent;
          item = {
            _id: pairitem._id,
            pair: pairitem.pair,
            price: pairprice,
            pricedifference: pricedifference,
            baseAssetType: pairitem.baseAssetType,
            quoteAssetType: pairitem.quoteAssetType,
            listed: pairitem.listed
          };
          if (pairitem.pair.includes(baseAsset)) {
            result.unshift(item);
          } else {
            result.push(item);
          }
        case 20:
          _context2.next = 10;
          break;
        case 22:
          _context2.next = 27;
          break;
        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](8);
          _iterator.e(_context2.t0);
        case 27:
          _context2.prev = 27;
          _iterator.f();
          return _context2.finish(27);
        case 30:
          res.status(200).send({
            pairs: result
          });

          //console.log(pairitems, 'here');
        case 31:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[8, 24, 27, 30]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
pairs.get('/pairs/by-base', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$query2, baseAsset, assetType, _pairs2, quoteAssetType, pairsPromises, pairslist;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$query2 = req.query, baseAsset = _req$query2.baseAsset, assetType = _req$query2.assetType;
          console.log(baseAsset, 'say hello');

          // Check if baseCurrency is provided
          if (baseAsset) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 4:
          _context4.prev = 4;
          if (assetType) {
            _context4.next = 9;
            break;
          }
          _context4.next = 8;
          return _pair["default"].find({
            baseAsset: baseAsset
          });
        case 8:
          _pairs2 = _context4.sent;
        case 9:
          if (!assetType) {
            _context4.next = 14;
            break;
          }
          quoteAssetType = assetType;
          _context4.next = 13;
          return _pair["default"].find({
            baseAsset: baseAsset,
            quoteAssetType: quoteAssetType
          });
        case 13:
          _pairs2 = _context4.sent;
        case 14:
          if (!(_pairs2.length === 0)) {
            _context4.next = 16;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: 'No pairs found for the specified base currency'
          }));
        case 16:
          pairsPromises = _pairs2.map( /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(pair) {
              var pairprice, pricedifference;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return pair.calculatePrice();
                  case 2:
                    pairprice = _context3.sent;
                    _context3.next = 5;
                    return pair.calculatepricedifference();
                  case 5:
                    pricedifference = _context3.sent;
                    return _context3.abrupt("return", {
                      _id: pair._id,
                      pair: pair.pair,
                      price: pairprice,
                      pricedifference: pricedifference,
                      baseAssetType: pair.baseAssetType,
                      quoteAssetType: pair.quoteAssetType,
                      listed: pair.listed,
                      inview: pair.inview
                    });
                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x7) {
              return _ref4.apply(this, arguments);
            };
          }());
          _context4.next = 19;
          return Promise.all(pairsPromises);
        case 19:
          pairslist = _context4.sent;
          res.status(200).send({
            pairs: pairslist
          });
          _context4.next = 27;
          break;
        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](4);
          console.error('Error fetching pairs by base currency:', _context4.t0);
          res.status(500).send({
            error: 'An error occurred while fetching pairs.'
          });
        case 27:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[4, 23]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
pairs.get('/pairs/by-quote', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$query3, quoteAsset, assetType, _pairs3;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _req$query3 = req.query, quoteAsset = _req$query3.quoteAsset, assetType = _req$query3.assetType; // Check if baseCurrency is provided
          if (quoteAsset) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context5.prev = 3;
          if (assetType) {
            _context5.next = 8;
            break;
          }
          _context5.next = 7;
          return _pair["default"].find({
            quoteAsset: quoteAsset
          });
        case 7:
          _pairs3 = _context5.sent;
        case 8:
          if (!(_pairs3.length === 0)) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", res.status(404).send({
            message: 'No pairs found for the specified base currency'
          }));
        case 10:
          res.status(200).send({
            pairs: _pairs3
          });
          _context5.next = 17;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](3);
          console.error('Error fetching pairs by base currency:', _context5.t0);
          res.status(500).send({
            error: 'An error occurred while fetching pairs.'
          });
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[3, 13]]);
  }));
  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}());
pairs.get('/pair/orders', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var pairid, orders;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          pairid = req.query.pairid;
          if (pairid) {
            _context6.next = 3;
            break;
          }
          return _context6.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return (0, _updatetradingpairsorders["default"])(pairid);
        case 6:
          orders = _context6.sent;
          //console.log(orders);

          //const { orders } = pairitem;

          res.status(200).send({
            orders: orders
          });
          _context6.next = 13;
          break;
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair orders.'
          });
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[3, 10]]);
  }));
  return function (_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/hours', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var pairid, pairitem, getpricehistory, first24hours, hours;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          pairid = req.query.pairid;
          if (pairid) {
            _context7.next = 3;
            break;
          }
          return _context7.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context7.sent;
          _context7.next = 9;
          return pairitem.getpricehistory();
        case 9:
          getpricehistory = _context7.sent;
          first24hours = specifichours(getpricehistory, 24);
          hours = filterHourlyItems(first24hours);
          res.status(200).send({
            hours: hours
          });
          _context7.next = 18;
          break;
        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching price history.'
          });
        case 18:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[3, 15]]);
  }));
  return function (_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/fourhours', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var pairid, pairitem, getpricehistory, first4hours, hours;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          pairid = req.query.pairid;
          if (pairid) {
            _context8.next = 3;
            break;
          }
          return _context8.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context8.prev = 3;
          _context8.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context8.sent;
          _context8.next = 9;
          return pairitem.getpricehistory();
        case 9:
          getpricehistory = _context8.sent;
          first4hours = specifichours(getpricehistory, 4);
          hours = filterHourlyItems(first4hours);
          res.status(200).send({
            hours: hours
          });
          _context8.next = 18;
          break;
        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair price history.'
          });
        case 18:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[3, 15]]);
  }));
  return function (_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/onehour', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var pairid, pairitem, getpricehistory, mins;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          pairid = req.query.pairid;
          if (pairid) {
            _context9.next = 3;
            break;
          }
          return _context9.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context9.prev = 3;
          _context9.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context9.sent;
          _context9.next = 9;
          return pairitem.getpricehistory();
        case 9:
          getpricehistory = _context9.sent;
          mins = specifichours(getpricehistory, 1);
          res.status(200).send({
            mins: mins
          });
          _context9.next = 17;
          break;
        case 14:
          _context9.prev = 14;
          _context9.t0 = _context9["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair price history.'
          });
        case 17:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[3, 14]]);
  }));
  return function (_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/fifteenmin', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var pairid, pairitem, getpricehistory, mins;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          pairid = req.query.pairid;
          if (pairid) {
            _context10.next = 3;
            break;
          }
          return _context10.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context10.prev = 3;
          _context10.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context10.sent;
          _context10.next = 9;
          return pairitem.getpricehistory();
        case 9:
          getpricehistory = _context10.sent;
          mins = getFirst15MinutesData(getpricehistory);
          res.status(200).send({
            mins: mins
          });
          _context10.next = 17;
          break;
        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair price history.'
          });
        case 17:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[3, 14]]);
  }));
  return function (_x18, _x19) {
    return _ref10.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/hours/candlestick', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _req$query4, pairid, candlestickdatalength, pairitem, getpricehistory, candlestickdata;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _req$query4 = req.query, pairid = _req$query4.pairid, candlestickdatalength = _req$query4.candlestickdatalength;
          if (pairid) {
            _context11.next = 3;
            break;
          }
          return _context11.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context11.prev = 3;
          _context11.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context11.sent;
          _context11.next = 9;
          return pairitem.getpricehistorycandlestick();
        case 9:
          getpricehistory = _context11.sent;
          candlestickdata = getpricehistory.splice(-candlestickdatalength);
          res.status(200).send({
            candlestickdata: candlestickdata
          });
          _context11.next = 17;
          break;
        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair price history.'
          });
        case 17:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[3, 14]]);
  }));
  return function (_x20, _x21) {
    return _ref11.apply(this, arguments);
  };
}());
pairs.get('/pair/pricehistory/mins/candlestick', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var _req$query5, pairid, candlestickdatalength, pairitem, getpricehistory, candlestickdata;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _req$query5 = req.query, pairid = _req$query5.pairid, candlestickdatalength = _req$query5.candlestickdatalength;
          if (pairid) {
            _context12.next = 3;
            break;
          }
          return _context12.abrupt("return", res.status(400).send({
            error: 'Base currency is required'
          }));
        case 3:
          _context12.prev = 3;
          _context12.next = 6;
          return _pair["default"].findOne({
            _id: pairid
          });
        case 6:
          pairitem = _context12.sent;
          _context12.next = 9;
          return pairitem.getpricehistorycandlestickMins();
        case 9:
          getpricehistory = _context12.sent;
          candlestickdata = getpricehistory.splice(-candlestickdatalength); //console.log(candlestickdata)
          res.status(200).send({
            candlestickdata: candlestickdata
          });
          _context12.next = 17;
          break;
        case 14:
          _context12.prev = 14;
          _context12.t0 = _context12["catch"](3);
          res.status(500).send({
            error: 'An error occurred while fetching pair price history.'
          });
        case 17:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[3, 14]]);
  }));
  return function (_x22, _x23) {
    return _ref12.apply(this, arguments);
  };
}());
var _default = exports["default"] = pairs;