"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _user = _interopRequireDefault(require("../../models/user"));
var _admin = _interopRequireDefault(require("../../models/admin"));
var _tokentracker = _interopRequireDefault(require("../../models/tokentracker"));
var _wllt = _interopRequireDefault(require("../../wallet/models/wllt"));
var _asset = _interopRequireDefault(require("../../models/asset"));
var _assetblc = _interopRequireDefault(require("../../wallet/models/assetblc"));
var _pair = _interopRequireDefault(require("../../models/pair"));
var _wallet = _interopRequireDefault(require("../../userwallet/models/wallet"));
var _tradeOrder = _interopRequireDefault(require("../../trader/models/tradeOrder"));
var _generatetradingpairs = _interopRequireDefault(require("../../functions/generatetradingpairs"));
var _addpairquotes = _interopRequireDefault(require("../../functions/addpairquotes"));
var _updatecommodities = _interopRequireDefault(require("../../trade/commodities/updatecommodities"));
var _authenticateToken = _interopRequireDefault(require("../../utils/authenticateToken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = require('date-fns'),
  formatDistanceToNow = _require.formatDistanceToNow;
var admin = _express["default"].Router();
var pairstrings = ['UNI/ETH', 'UNI/USDC', 'UNI/BTC', 'UNI/BNB', 'XRP/USDT', 'XRP/BTC', 'XRP/USD', 'XRP/BNB', 'XRP/ETH', 'BTC/USD', 'BTC/USDT', 'BTC/BNB', 'ETH/USD', 'ETH/USDT', 'ETH/USDC', 'ETH/BTC', 'ETH/TRX', 'XMR/BTC', 'XMR/USD', 'XMR/USDT', 'XMR/USDC', 'XMR/ETH', 'XMR/BNB', 'DOGE/USDT', 'DOGE/USD', 'DOGE/BTC', 'DOGE/USDC', 'POLY/USD', 'POLY/USDT', 'POLY/BTC', 'ADA/USDT', 'ADA/USD', 'ADA/BTC', 'ADA/ETH', 'ADA/BNB', 'ADA/USDC', 'BAT/USDT', 'BAT/USD', 'BAT/BTC', 'BAT/ETH', 'BAT/USD', 'TRX/USDT', 'TRX/USD', 'TRX/ETH', 'TRX/BTC', 'TRX/XRP', 'TRX/ADA', 'BNB/USDT', 'BNB/USD', 'BNB/USDC', 'BNB/ETH', 'BNB/TRX', 'BNB/BTC', 'EOS/USDT', 'EOS/USD', 'EOS/USDT', 'EOS/BTC', 'EOS/ETH', 'DASH/USDT', 'DASH/BTC', 'DASH/USDT', 'DASH/USDC', 'DASH/ETH', 'MKR/USDT', 'MKR/USD', 'MKR/BTC', 'MKR/ETH', 'NEO/USDT', 'NEO/USD', 'NEO/BTC', 'NEO/ETH', 'NEO/TRX', 'LINK/USD', 'LINK/USDT', 'LINK/BTC', 'LINK/ETH', 'LINK/TRX', 'BCH/USD', 'BCH/USDT', 'BCH/BTC', 'BCH/ETH', 'LTC/USD', 'LTC/USDT', 'LTC/BTC', 'LTC/ETH', 'SNX/USD', 'SNX/USDT', 'SNX/BTC', 'SNX/ETH', 'XLM/XRP', 'XLM/USD', 'XLM/USDT', 'XLM/BTC', 'XLM/ETH', 'T/USD', 'TSLA/USD', 'FB/USD', 'JPM/USD', 'VALE/USD', 'C/USD', 'GE/USD', 'MSFT/USD', 'GM/USD', 'NIO/USD', 'INTC/USD', 'NOK/USD', 'NVDA/USD', 'KO/USD', 'AAL/USD', 'WFC/USD', 'F/USD', 'AAPL/USD', 'BAC/USD', 'CCL/USD', 'BA/USD', 'UBER/USD', 'M/USD', 'AMD/USD', 'DIS/USD', 'PFE/USD', 'SNAP/USD', 'XOM/USD', 'WHEAT/USD', 'NATURAL_GAS/USD', 'BRENT/USD', 'COTTON/USD', 'COPPER/USD', 'ALUMINIUM/USD', 'COFFEE/USD', 'CORN/USD', 'SUGAR/USD', 'WTI/USD', "Tin/USD", "Tin/USDT", "Gold/USD", "Nickel/USD", "Ethanol/USD", "Palladium/USD", "Silver/USD", "Heating Oil/USD", "Platinum/USD", "Coal/USD", "RBOB Gasoline/USD", "Uranium/USD", "Oil (Brent)/USD", "Oil (WTI)/USD", "Aluminium/USD", "Lead/USD", "Iron Ore/USD", "Lean Hog/USD", "Oats/USD", "Lumber/USD", "Cocoa/USD", "Live Cattle/USD", "Feeder Cattle/USD", "Milk/USD", "Milk/USDT", "Orange Juice/USD", "Palm Oil/USD", "Rapeseed/USD", "Rice/USDT", "Rice/USD", "Zinc/USD", "Soybean Meal/USD", "Soybeans/USD", "Soybean Oil/USD", "Soybean Oil/USD"];
function relistpairs() {
  return _relistpairs.apply(this, arguments);
}
function _relistpairs() {
  _relistpairs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {
    var _iterator6, _step6, pairstring, pair;
    return _regeneratorRuntime().wrap(function _callee27$(_context27) {
      while (1) switch (_context27.prev = _context27.next) {
        case 0:
          _iterator6 = _createForOfIteratorHelper(pairstrings);
          _context27.prev = 1;
          _iterator6.s();
        case 3:
          if ((_step6 = _iterator6.n()).done) {
            _context27.next = 11;
            break;
          }
          pairstring = _step6.value;
          _context27.next = 7;
          return _pair["default"].findOne({
            pair: pairstring
          });
        case 7:
          pair = _context27.sent;
          if (pair) {
            pair.listed = true;
            pair.save();
          }
        case 9:
          _context27.next = 3;
          break;
        case 11:
          _context27.next = 16;
          break;
        case 13:
          _context27.prev = 13;
          _context27.t0 = _context27["catch"](1);
          _iterator6.e(_context27.t0);
        case 16:
          _context27.prev = 16;
          _iterator6.f();
          return _context27.finish(16);
        case 19:
        case "end":
          return _context27.stop();
      }
    }, _callee27, null, [[1, 13, 16, 19]]);
  }));
  return _relistpairs.apply(this, arguments);
}
admin.post('/admin/create', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var receivedCredentials, newagent;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          receivedCredentials = req.body;
          newagent = new _admin["default"](receivedCredentials);
          _context.next = 5;
          return newagent.save();
        case 5:
          res.json({
            message: 'Agent saved successfully.',
            newagent: newagent
          });
          _context.next = 11;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: 'An error occurred during registration.'
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
admin.post('/admin/login', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, username, password, agent, payload, token, newtokentracker;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          _context2.next = 4;
          return _admin["default"].findOne({
            username: username,
            password: password
          });
        case 4:
          agent = _context2.sent;
          if (agent) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.sendStatus(401));
        case 7:
          payload = {
            _id: agent._id,
            username: agent.username
          };
          token = _jsonwebtoken["default"].sign(payload, process.env.secretKeyJWT);
          newtokentracker = new _tokentracker["default"]({
            token: token,
            type: 'agent',
            unid: agent._id
          });
          _context2.next = 12;
          return newtokentracker.save();
        case 12:
          agent.token = token;
          _context2.next = 15;
          return agent.save();
        case 15:
          res.status(200).json({
            message: 'Login successful.',
            token: token,
            agentdata: {
              username: agent.username,
              _id: agent._id
            }
          });
          _context2.next = 21;
          break;
        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: 'An error occurred during login.'
          });
        case 21:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 18]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
admin.get('/admin/all', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var master, agents;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          master = req.query.master;
          if (!(master !== process.env.masterKey)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", res.sendStatus(401));
        case 4:
          _context3.next = 6;
          return _admin["default"].find();
        case 6:
          agents = _context3.sent;
          res.status(200).json({
            agents: agents
          });
          _context3.next = 13;
          break;
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: 'An error occurred during agents fetch.'
          });
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
admin.put('/admin/edit', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$query, master, agentid, password, agent, tokentracker, _iterator, _step, tracker, updatedagent;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$query = req.query, master = _req$query.master, agentid = _req$query.agentid;
          password = req.body.password;
          if (!(master !== process.env.masterKey)) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", res.sendStatus(401));
        case 5:
          if (!password) {
            _context4.next = 42;
            break;
          }
          _context4.next = 8;
          return _admin["default"].findOne({
            _id: agentid
          });
        case 8:
          agent = _context4.sent;
          if (!agent) {
            _context4.next = 41;
            break;
          }
          _context4.next = 12;
          return _tokentracker["default"].find({
            token: agent.token,
            unid: agent._id
          });
        case 12:
          tokentracker = _context4.sent;
          if (!tokentracker.length) {
            _context4.next = 31;
            break;
          }
          _iterator = _createForOfIteratorHelper(tokentracker);
          _context4.prev = 15;
          _iterator.s();
        case 17:
          if ((_step = _iterator.n()).done) {
            _context4.next = 23;
            break;
          }
          tracker = _step.value;
          _context4.next = 21;
          return _tokentracker["default"].deleteToken(tracker.token);
        case 21:
          _context4.next = 17;
          break;
        case 23:
          _context4.next = 28;
          break;
        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](15);
          _iterator.e(_context4.t0);
        case 28:
          _context4.prev = 28;
          _iterator.f();
          return _context4.finish(28);
        case 31:
          agent.password = password;
          agent.token = '';
          _context4.next = 35;
          return agent.save();
        case 35:
          _context4.next = 37;
          return _admin["default"].findOne({
            _id: agentid
          });
        case 37:
          updatedagent = _context4.sent;
          res.json({
            message: 'Agent updated successfully.',
            updatedagent: updatedagent
          });
          _context4.next = 42;
          break;
        case 41:
          res.status(404).json({
            message: 'Agent not found.'
          });
        case 42:
          _context4.next = 47;
          break;
        case 44:
          _context4.prev = 44;
          _context4.t1 = _context4["catch"](0);
          res.status(500).json({
            error: 'An error occurred during update.'
          });
        case 47:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 44], [15, 25, 28, 31]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
admin["delete"]('/admin/deleteall', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var master;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          master = req.query.master;
          if (!(master !== process.env.masterKey)) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.sendStatus(401));
        case 4:
          _context5.next = 6;
          return _admin["default"].deleteMany({});
        case 6:
          _context5.next = 8;
          return _tokentracker["default"].deleteTokensByType('agent');
        case 8:
          res.json({
            message: 'Agent deleted successfully.'
          });
          _context5.next = 14;
          break;
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: 'An error occurred during delete.'
          });
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
admin.get('/allusers', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var users, useritems;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _user["default"].find();
        case 3:
          users = _context6.sent;
          useritems = [];
          users.forEach(function (user) {
            var userObject = user.toObject();
            if (userObject.lastOnline) {
              var lastseen = formatDistanceToNow(new Date(user.lastOnline), {
                addSuffix: true
              });
              userObject.lastseen = lastseen;
            }
            useritems.push(userObject); //
          });
          res.status(200).send({
            users: useritems
          });
          _context6.next = 13;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).send('An error occurred');
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
admin.get('/user', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id, user, userObject, lastseen;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.query.id;
          _context7.next = 4;
          return _user["default"].findOne({
            _id: id
          });
        case 4:
          user = _context7.sent;
          userObject = user.toObject();
          if (userObject.lastOnline) {
            lastseen = formatDistanceToNow(new Date(user.lastOnline), {
              addSuffix: true
            });
            userObject.lastseen = lastseen;
          }
          res.status(200).send({
            user: userObject
          });
          _context7.next = 14;
          break;
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).send('An error occurred');
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 10]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
admin.get('/userwallets', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, userwallets;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          id = req.query.id;
          _context8.next = 4;
          return _wllt["default"].find({
            ownerId: id
          });
        case 4:
          userwallets = _context8.sent;
          res.status(200).send({
            userwallets: userwallets
          });
          _context8.next = 12;
          break;
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).send('An error occurred');
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
admin.get('/user/assets', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _req$query2, id, wallet, crypto, commodities, stocks, fiat, userwallet, processAssets, cryptoblc, commoditiesblc, stocksblc, fiatblc;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _req$query2 = req.query, id = _req$query2.id, wallet = _req$query2.wallet;
          _context11.prev = 1;
          _context11.next = 4;
          return _asset["default"].find({
            assetType: 'crypto'
          });
        case 4:
          crypto = _context11.sent;
          _context11.next = 7;
          return _asset["default"].find({
            assetType: 'commodity'
          });
        case 7:
          commodities = _context11.sent;
          _context11.next = 10;
          return _asset["default"].find({
            assetType: 'stock'
          });
        case 10:
          stocks = _context11.sent;
          _context11.next = 13;
          return _asset["default"].find({
            assetType: 'fiat'
          });
        case 13:
          fiat = _context11.sent;
          _context11.next = 16;
          return _wllt["default"].findOne({
            _id: wallet
          });
        case 16:
          userwallet = _context11.sent;
          processAssets = /*#__PURE__*/function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(assets) {
              var assetPromises;
              return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                  case 0:
                    assetPromises = assets.map( /*#__PURE__*/function () {
                      var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(asset) {
                        var assetid, asstBlc;
                        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                          while (1) switch (_context9.prev = _context9.next) {
                            case 0:
                              assetid = asset._id.toString();
                              _context9.next = 3;
                              return _assetblc["default"].findOne({
                                assetid: assetid,
                                wallet: userwallet._id
                              });
                            case 3:
                              asstBlc = _context9.sent;
                              return _context9.abrupt("return", _objectSpread(_objectSpread({}, asset._doc), {}, {
                                asstBlc: asstBlc ? asstBlc.balance : 0
                              }));
                            case 5:
                            case "end":
                              return _context9.stop();
                          }
                        }, _callee9);
                      }));
                      return function (_x20) {
                        return _ref11.apply(this, arguments);
                      };
                    }());
                    _context10.next = 3;
                    return Promise.all(assetPromises);
                  case 3:
                    return _context10.abrupt("return", _context10.sent);
                  case 4:
                  case "end":
                    return _context10.stop();
                }
              }, _callee10);
            }));
            return function processAssets(_x19) {
              return _ref10.apply(this, arguments);
            };
          }();
          _context11.next = 20;
          return processAssets(crypto);
        case 20:
          cryptoblc = _context11.sent;
          _context11.next = 23;
          return processAssets(commodities);
        case 23:
          commoditiesblc = _context11.sent;
          _context11.next = 26;
          return processAssets(stocks);
        case 26:
          stocksblc = _context11.sent;
          _context11.next = 29;
          return processAssets(fiat);
        case 29:
          fiatblc = _context11.sent;
          // Send response back to client
          res.status(200).json({
            crypto: cryptoblc,
            commodities: commoditiesblc,
            stocks: stocksblc,
            fiat: fiatblc,
            userwallet: userwallet
          });
          _context11.next = 37;
          break;
        case 33:
          _context11.prev = 33;
          _context11.t0 = _context11["catch"](1);
          console.error(_context11.t0);
          res.status(500).send('Error processing request');
        case 37:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[1, 33]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
admin.post('/user/asset/add', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var balanceupdate, _req$query3, wallet, assetid, userwallet;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          balanceupdate = req.body.balanceupdate;
          _req$query3 = req.query, wallet = _req$query3.wallet, assetid = _req$query3.assetid;
          _context12.next = 5;
          return _wllt["default"].findOne({
            _id: wallet
          });
        case 5:
          userwallet = _context12.sent;
          _context12.next = 8;
          return userwallet.deposit(balanceupdate, assetid);
        case 8:
          res.status(200).json({
            message: 'done'
          });
          _context12.next = 15;
          break;
        case 11:
          _context12.prev = 11;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          res.status(500).send('Error processing request');
        case 15:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 11]]);
  }));
  return function (_x21, _x22) {
    return _ref12.apply(this, arguments);
  };
}());
admin.post('/user/asset/subtract', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var balanceupdate, _req$query4, wallet, assetid, userwallet;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          balanceupdate = req.body.balanceupdate;
          _req$query4 = req.query, wallet = _req$query4.wallet, assetid = _req$query4.assetid;
          _context13.next = 5;
          return _wllt["default"].findOne({
            _id: wallet
          });
        case 5:
          userwallet = _context13.sent;
          _context13.next = 8;
          return userwallet.withdraw(balanceupdate, assetid);
        case 8:
          res.status(200).json({
            message: 'done'
          });
          _context13.next = 15;
          break;
        case 11:
          _context13.prev = 11;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          res.status(500).send('Error processing request');
        case 15:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 11]]);
  }));
  return function (_x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}());
admin.post('/user/accounttypeupdate/update', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var id, accounttypeupdate, user;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          id = req.query.id;
          accounttypeupdate = req.body.accounttypeupdate;
          _context14.next = 5;
          return _user["default"].findOne({
            _id: id
          });
        case 5:
          user = _context14.sent;
          user.accountplan = accounttypeupdate;
          _context14.next = 9;
          return user.save();
        case 9:
          res.status(200).json({
            message: 'done'
          });
          _context14.next = 15;
          break;
        case 12:
          _context14.prev = 12;
          _context14.t0 = _context14["catch"](0);
          res.status(500).send('Error processing request');
        case 15:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 12]]);
  }));
  return function (_x25, _x26) {
    return _ref14.apply(this, arguments);
  };
}());
admin.post('/user/spotbtcaddress/update', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var id, spotbtcaddress, user;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          id = req.query.id;
          spotbtcaddress = req.body.spotbtcaddress;
          _context15.next = 5;
          return _user["default"].findOne({
            _id: id
          });
        case 5:
          user = _context15.sent;
          user.spotbtcaddress = spotbtcaddress;
          _context15.next = 9;
          return user.save();
        case 9:
          res.status(200).json({
            message: 'done'
          });
          _context15.next = 15;
          break;
        case 12:
          _context15.prev = 12;
          _context15.t0 = _context15["catch"](0);
          res.status(500).send('Error processing request');
        case 15:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 12]]);
  }));
  return function (_x27, _x28) {
    return _ref15.apply(this, arguments);
  };
}());
admin.post('/user/marginbtcaddress/update', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var id, marginbtcaddress, user;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          id = req.query.id;
          marginbtcaddress = req.body.marginbtcaddress;
          _context16.next = 5;
          return _user["default"].findOne({
            _id: id
          });
        case 5:
          user = _context16.sent;
          user.marginbtcaddress = marginbtcaddress;
          _context16.next = 9;
          return user.save();
        case 9:
          res.status(200).json({
            message: 'done'
          });
          _context16.next = 15;
          break;
        case 12:
          _context16.prev = 12;
          _context16.t0 = _context16["catch"](0);
          res.status(500).send('Error processing request');
        case 15:
        case "end":
          return _context16.stop();
      }
    }, _callee16, null, [[0, 12]]);
  }));
  return function (_x29, _x30) {
    return _ref16.apply(this, arguments);
  };
}());
admin.get('/jhgchdh/generatetradingpair', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return (0, _generatetradingpairs["default"])();
        case 3:
          res.status(200).json({
            message: 'trading pairs generated'
          });
          _context17.next = 9;
          break;
        case 6:
          _context17.prev = 6;
          _context17.t0 = _context17["catch"](0);
          res.status(500).send('Error processing request');
        case 9:
        case "end":
          return _context17.stop();
      }
    }, _callee17, null, [[0, 6]]);
  }));
  return function (_x31, _x32) {
    return _ref17.apply(this, arguments);
  };
}());
admin.get('/jhgchdh/addpairquotes', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(req, res) {
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return (0, _addpairquotes["default"])();
        case 3:
          res.status(200).json({
            message: 'pair quotes generated'
          });
          _context18.next = 9;
          break;
        case 6:
          _context18.prev = 6;
          _context18.t0 = _context18["catch"](0);
          res.status(500).send('Error processing request');
        case 9:
        case "end":
          return _context18.stop();
      }
    }, _callee18, null, [[0, 6]]);
  }));
  return function (_x33, _x34) {
    return _ref18.apply(this, arguments);
  };
}());
admin.get('/jhgchdh/updatecommoditydatabase', /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return (0, _updatecommodities["default"])();
        case 3:
          res.status(200).json({
            message: 'commodity database updated successfully'
          });
          _context19.next = 9;
          break;
        case 6:
          _context19.prev = 6;
          _context19.t0 = _context19["catch"](0);
          res.status(500).send('error in commodity database update');
        case 9:
        case "end":
          return _context19.stop();
      }
    }, _callee19, null, [[0, 6]]);
  }));
  return function (_x35, _x36) {
    return _ref19.apply(this, arguments);
  };
}());
admin.post('/jhgchdh/pair/delist', /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(req, res) {
    var pairid, pairitems, _iterator2, _step2, pairitem;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          pairid = req.query.pairid;
          _context20.next = 4;
          return _pair["default"].find({
            _id: pairid
          });
        case 4:
          pairitems = _context20.sent;
          if (!(pairitems.length === 0)) {
            _context20.next = 7;
            break;
          }
          return _context20.abrupt("return", res.status(404).json({
            message: 'No matching pairs found to update'
          }));
        case 7:
          _iterator2 = _createForOfIteratorHelper(pairitems);
          _context20.prev = 8;
          _iterator2.s();
        case 10:
          if ((_step2 = _iterator2.n()).done) {
            _context20.next = 17;
            break;
          }
          pairitem = _step2.value;
          pairitem.listed = false;
          _context20.next = 15;
          return pairitem.save();
        case 15:
          _context20.next = 10;
          break;
        case 17:
          _context20.next = 22;
          break;
        case 19:
          _context20.prev = 19;
          _context20.t0 = _context20["catch"](8);
          _iterator2.e(_context20.t0);
        case 22:
          _context20.prev = 22;
          _iterator2.f();
          return _context20.finish(22);
        case 25:
          res.status(200).json({
            message: "".concat(pairitems.length, " pair delisted successfully")
          });
          _context20.next = 32;
          break;
        case 28:
          _context20.prev = 28;
          _context20.t1 = _context20["catch"](0);
          console.error(_context20.t1); // It's often useful to log the error for debugging
          res.status(500).send('Error in pair database update');
        case 32:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[0, 28], [8, 19, 22, 25]]);
  }));
  return function (_x37, _x38) {
    return _ref20.apply(this, arguments);
  };
}());
admin.post('/jhgchdh/pair/relist', /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
    var pairid, pairitems, _iterator3, _step3, pairitem;
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          pairid = req.query.pairid;
          _context21.next = 4;
          return _pair["default"].find({
            _id: pairid
          });
        case 4:
          pairitems = _context21.sent;
          if (!(pairitems.length === 0)) {
            _context21.next = 7;
            break;
          }
          return _context21.abrupt("return", res.status(404).json({
            message: 'No matching pairs found to update'
          }));
        case 7:
          _iterator3 = _createForOfIteratorHelper(pairitems);
          _context21.prev = 8;
          _iterator3.s();
        case 10:
          if ((_step3 = _iterator3.n()).done) {
            _context21.next = 17;
            break;
          }
          pairitem = _step3.value;
          pairitem.listed = true;
          _context21.next = 15;
          return pairitem.save();
        case 15:
          _context21.next = 10;
          break;
        case 17:
          _context21.next = 22;
          break;
        case 19:
          _context21.prev = 19;
          _context21.t0 = _context21["catch"](8);
          _iterator3.e(_context21.t0);
        case 22:
          _context21.prev = 22;
          _iterator3.f();
          return _context21.finish(22);
        case 25:
          res.status(200).json({
            message: "".concat(pairitems.length, " pair relisted successfully")
          });
          _context21.next = 32;
          break;
        case 28:
          _context21.prev = 28;
          _context21.t1 = _context21["catch"](0);
          console.error(_context21.t1); // It's often useful to log the error for debugging
          res.status(500).send('Error in pair database update');
        case 32:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[0, 28], [8, 19, 22, 25]]);
  }));
  return function (_x39, _x40) {
    return _ref21.apply(this, arguments);
  };
}());
admin.post('/jhgchdh/asset/delist', /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
    var assetid, assets, _iterator4, _step4, asset;
    return _regeneratorRuntime().wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          assetid = req.query.assetid;
          _context22.next = 4;
          return _asset["default"].find({
            _id: assetid
          });
        case 4:
          assets = _context22.sent;
          if (!(assets.length === 0)) {
            _context22.next = 7;
            break;
          }
          return _context22.abrupt("return", res.status(404).json({
            message: 'No matching pairs found to update'
          }));
        case 7:
          _iterator4 = _createForOfIteratorHelper(assets);
          _context22.prev = 8;
          _iterator4.s();
        case 10:
          if ((_step4 = _iterator4.n()).done) {
            _context22.next = 17;
            break;
          }
          asset = _step4.value;
          asset.listed = false;
          _context22.next = 15;
          return asset.save();
        case 15:
          _context22.next = 10;
          break;
        case 17:
          _context22.next = 22;
          break;
        case 19:
          _context22.prev = 19;
          _context22.t0 = _context22["catch"](8);
          _iterator4.e(_context22.t0);
        case 22:
          _context22.prev = 22;
          _iterator4.f();
          return _context22.finish(22);
        case 25:
          res.status(200).json({
            message: "".concat(assets.length, " asset delisted successfully")
          });
          _context22.next = 31;
          break;
        case 28:
          _context22.prev = 28;
          _context22.t1 = _context22["catch"](0);
          res.status(500).send('error in asset database update');
        case 31:
        case "end":
          return _context22.stop();
      }
    }, _callee22, null, [[0, 28], [8, 19, 22, 25]]);
  }));
  return function (_x41, _x42) {
    return _ref22.apply(this, arguments);
  };
}());
admin.post('/jhgchdh/asset/relist', /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
    var assetid, assets, _iterator5, _step5, asset;
    return _regeneratorRuntime().wrap(function _callee23$(_context23) {
      while (1) switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          assetid = req.query.assetid;
          _context23.next = 4;
          return _asset["default"].find({
            _id: assetid
          });
        case 4:
          assets = _context23.sent;
          if (!(assets.length === 0)) {
            _context23.next = 7;
            break;
          }
          return _context23.abrupt("return", res.status(404).json({
            message: 'No matching pairs found to update'
          }));
        case 7:
          _iterator5 = _createForOfIteratorHelper(assets);
          _context23.prev = 8;
          _iterator5.s();
        case 10:
          if ((_step5 = _iterator5.n()).done) {
            _context23.next = 17;
            break;
          }
          asset = _step5.value;
          asset.listed = true;
          _context23.next = 15;
          return asset.save();
        case 15:
          _context23.next = 10;
          break;
        case 17:
          _context23.next = 22;
          break;
        case 19:
          _context23.prev = 19;
          _context23.t0 = _context23["catch"](8);
          _iterator5.e(_context23.t0);
        case 22:
          _context23.prev = 22;
          _iterator5.f();
          return _context23.finish(22);
        case 25:
          res.status(200).json({
            message: "".concat(assets.length, " asset relisted successfully")
          });
          _context23.next = 31;
          break;
        case 28:
          _context23.prev = 28;
          _context23.t1 = _context23["catch"](0);
          res.status(500).send('error in asset database update');
        case 31:
        case "end":
          return _context23.stop();
      }
    }, _callee23, null, [[0, 28], [8, 19, 22, 25]]);
  }));
  return function (_x43, _x44) {
    return _ref23.apply(this, arguments);
  };
}());
admin.post('/jhgchdh/pairs/relistings', /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
    return _regeneratorRuntime().wrap(function _callee24$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          try {
            relistpairs();
            res.status(200).json({
              message: "relistings done"
            });
          } catch (error) {
            res.status(500).send('error triggering relistings');
          }
        case 1:
        case "end":
          return _context24.stop();
      }
    }, _callee24);
  }));
  return function (_x45, _x46) {
    return _ref24.apply(this, arguments);
  };
}());
admin.put('/jhgchdh/tradeorder/update', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(req, res) {
    var orderid, _req$body2, filled, profit, loss, active, state, filter, update, options;
    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          try {
            orderid = req.query.orderid;
            _req$body2 = req.body, filled = _req$body2.filled, profit = _req$body2.profit, loss = _req$body2.loss, active = _req$body2.active, state = _req$body2.state;
            filter = {
              _id: orderid
            };
            update = {
              filled: parseFloat(filled),
              profit: parseFloat(profit),
              loss: parseFloat(loss),
              active: toBoolean(active),
              state: state
            };
            options = {
              "new": true
            };
            _tradeOrder["default"].findOneAndUpdate(filter, update, options, function (err, doc) {
              if (err) {
                res.status(500).send('error updating tradeorder');
              }
              res.status(200).send({
                message: 'order updated'
              });
            });
          } catch (error) {
            res.status(500).send('error updating tradeorder');
          }
        case 1:
        case "end":
          return _context25.stop();
      }
    }, _callee25);
  }));
  return function (_x47, _x48) {
    return _ref25.apply(this, arguments);
  };
}());
admin.put('/jhgchdh/assetitem/update', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26(req, res) {
    var assetid, priceupdate, filter, update, options;
    return _regeneratorRuntime().wrap(function _callee26$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          try {
            assetid = req.query.assetid;
            priceupdate = req.body.priceupdate;
            filter = {
              _id: assetid
            };
            update = {
              price: priceupdate
            };
            options = {
              "new": true
            };
            _asset["default"].findOneAndUpdate(filter, update, options, function (err, doc) {
              if (err) {
                res.status(500).send('error updating asset');
              }
              res.status(200).send({
                message: 'asset updated'
              });
            });
          } catch (error) {
            res.status(500).send('error updating asset');
          }
        case 1:
        case "end":
          return _context26.stop();
      }
    }, _callee26);
  }));
  return function (_x49, _x50) {
    return _ref26.apply(this, arguments);
  };
}());
function toBoolean(input) {
  if (typeof input === 'string') {
    if (input.toLowerCase() === 'true') return true;
    if (input.toLowerCase() === 'false') return false;
  }
  return !!input;
}
var _default = exports["default"] = admin;