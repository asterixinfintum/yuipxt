"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _asset = _interopRequireDefault(require("../../models/asset"));
var _allowedpair = _interopRequireDefault(require("../../models/allowedpair"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var allowedpairs = [{
  type: 'crypto',
  pairlabel: "MEXC:UNIUSDT",
  pair: "UNI/USDT"
}, {
  type: 'crypto',
  pairlabel: "MEXC:UNIETH",
  pair: "UNI/ETH"
}, {
  type: 'crypto',
  pairlabel: "MEXC:UNIUSDC",
  pair: "UNI/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:UNIBTC",
  pair: "UNI/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:UNIBNB",
  pair: "UNI/BNB"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XRPUSDT",
  pair: "XRP/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XRPBTC",
  pair: "XRP/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XRPUSD",
  pair: "XRP/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XRPBNB",
  pair: "XRP/BNB"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XRPETH",
  pair: "XRP/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BTCUSD",
  pair: "BTC/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BTCUSDT",
  pair: "BTC/USDT"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:BTCBNB",
  pair: "BTC/BNB"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ETHUSD",
  pair: "ETH/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ETHUSDT",
  pair: "ETH/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ETHUSDC",
  pair: "ETH/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ETHBTC",
  pair: "ETH/BTC"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:ETHTRX",
  pair: "ETH/TRX"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:XMRBTC",
  pair: "XMR/BTC"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:XMRUSD",
  pair: "XMR/USD"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:XMRUSDT",
  pair: "XMR/USDT"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:XMRUSDC",
  pair: "XMR/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XMRETH",
  pair: "XMR/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XMRBNB",
  pair: "XMR/BNB"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:DOGEUSDT",
  pair: "DOGE/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:DOGEUSD",
  pair: "DOGE/USD"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:DOGEBTC",
  pair: "DOGE/BTC"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:DOGEUSDC",
  pair: "DOGE/USDC"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:POLYUSD",
  pair: "POLY/USD"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:POLYUSDT",
  pair: "POLY/USDT"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:POLYBTC",
  pair: "POLY/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ADAUSDT",
  pair: "ADA/USDT"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:ADAUSD",
  pair: "ADA/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ADABTC",
  pair: "ADA/BTC"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:ADAETH",
  pair: "ADA/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:ADABNB",
  pair: "ADA/BNB"
}, {
  type: 'crypto',
  pairlabel: "BITTREX:ADAUSDC",
  pair: "ADA/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BATUSDT",
  pair: "BAT/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITSTAMP:BATUSD",
  pair: "BAT/USD"
}, {
  type: 'crypto',
  pairlabel: "GEMINI:BATBTC",
  pair: "BAT/BTC"
}, {
  type: 'crypto',
  pairlabel: "GEMINI:BATETH",
  pair: "BAT/ETH"
}, {
  type: 'crypto',
  pairlabel: "KRAKEN:BATUSD",
  pair: "BAT/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:TRXUSDT",
  pair: "TRX/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:TRXUSD",
  pair: "TRX/USD"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:TRXETH",
  pair: "TRX/ETH"
}, {
  type: 'crypto',
  pairlabel: "OKX:TRXBTC",
  pair: "TRX/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:TRXXRP",
  pair: "TRX/XRP"
}, {
  type: 'crypto',
  pairlabel: "BITRUE:TRXADA",
  pair: "TRX/ADA"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BNBUSDT",
  pair: "BNB/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BNBUSD",
  pair: "BNB/USD"
}, {
  type: 'crypto',
  pairlabel: "OKX:BNBUSDC",
  pair: "BNB/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BNBETH",
  pair: "BNB/ETH"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:BNBTRX",
  pair: "BNB/TRX"
}, {
  type: 'crypto',
  pairlabel: "KUCOIN:BNBBTC",
  pair: "BNB/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:EOSUSDT",
  pair: "EOS/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:EOSUSD",
  pair: "EOS/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:EOSUSDT",
  pair: "EOS/USDT"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:EOSBTC",
  pair: "EOS/BTC"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:EOSETH",
  pair: "EOS/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:DASHUSDT",
  pair: "DASH/USDT"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:DASHBTC",
  pair: "DASH/BTC"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:DASHUSD",
  pair: "DASH/USDT"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:DASHUSDC",
  pair: "DASH/USDC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:DASHETH",
  pair: "DASH/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:MKRUSDT",
  pair: "MKR/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:MKRUSD",
  pair: "MKR/USD"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:MKRBTC",
  pair: "MKR/BTC"
}, {
  type: 'crypto',
  pairlabel: "KUCOIN:MKRETH",
  pair: "MKR/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:NEOUSDT",
  pair: "NEO/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:NEOUSD",
  pair: "NEO/USD"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:NEOBTC",
  pair: "NEO/BTC"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:NEOETH",
  pair: "NEO/ETH"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:NEOTRX",
  pair: "NEO/TRX"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:LINKUSD",
  pair: "LINK/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:LINKUSDT",
  pair: "LINK/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:LINKBTC",
  pair: "LINK/BTC"
}, {
  type: 'crypto',
  pairlabel: "GEMINI:LINKETH",
  pair: "LINK/ETH"
}, {
  type: 'crypto',
  pairlabel: "POLONIEX:LINKTRX",
  pair: "LINK/TRX"
}, {
  type: 'crypto',
  pairlabel: "KRAKEN:BCHUSDZ2023",
  pair: "BCH/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:BCHUSDT",
  pair: "BCH/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITTREX:BCHBTC",
  pair: "BCH/BTC"
}, {
  type: 'crypto',
  pairlabel: "BITTREX:BCHETH",
  pair: "BCH/ETH"
}, {
  type: 'crypto',
  pairlabel: "COINBASE:LTCUSD",
  pair: "LTC/USD"
}, {
  type: 'crypto',
  pairlabel: "BYBIT:LTCUSDT",
  pair: "LTC/USDT"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:LTCBTC",
  pair: "LTC/BTC"
}, {
  type: 'crypto',
  pairlabel: "GEMINI:LTCETH",
  pair: "LTC/ETH"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:SNXUSD",
  pair: "SNX/USD"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:SNXUSDT",
  pair: "SNX/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:SNXBTC",
  pair: "SNX/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:SNXETH",
  pair: "SNX/ETH"
}, {
  type: 'crypto',
  pairlabel: "BITRUE:XLMXRP",
  pair: "XLM/XRP"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:XLMUSD",
  pair: "XLM/USD"
}, {
  type: 'crypto',
  pairlabel: "KUCOIN:XLMUSDT",
  pair: "XLM/USDT"
}, {
  type: 'crypto',
  pairlabel: "BITFINEX:XLMBTC",
  pair: "XLM/BTC"
}, {
  type: 'crypto',
  pairlabel: "BINANCE:XLMETH",
  pair: "XLM/ETH"
}, {
  type: 'stock',
  pairlabel: "NYSE:T",
  pair: "T/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:TSLA",
  pair: "TSLA/USD"
}, {
  type: 'stock',
  pairlabel: "BCS:FB",
  pair: "FB/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:JPM",
  pair: "JPM/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:VALE",
  pair: "VALE/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:C",
  pair: "C/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:GE",
  pair: "GE/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:MSFT",
  pair: "MSFT/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:GM",
  pair: "GM/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:NIO",
  pair: "NIO/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:INTC",
  pair: "INTC/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:NOK",
  pair: "NOK/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:NVDA",
  pair: "NVDA/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:KO",
  pair: "KO/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:AAL",
  pair: "AAL/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:WFC",
  pair: "WFC/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:F",
  pair: "F/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:AAPL",
  pair: "AAPL/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:BAC",
  pair: "BAC/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:CCL",
  pair: "CCL/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:BA",
  pair: "BA/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:UBER",
  pair: "UBER/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:M",
  pair: "M/USD"
}, {
  type: 'stock',
  pairlabel: "NASDAQ:AMD",
  pair: "AMD/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:DIS",
  pair: "DIS/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:PFE",
  pair: "PFE/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:SNAP",
  pair: "SNAP/USD"
}, {
  type: 'stock',
  pairlabel: "NYSE:XOM",
  pair: "XOM/USD"
}, {
  type: 'commodity',
  pairlabel: "ACTIVTRADES:WHEATH2024",
  pair: "WHEAT/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:NATURALGAS",
  pair: "NATURAL_GAS/USD"
}, {
  type: 'commodity',
  pairlabel: "BLACKBULL:BRENT",
  pair: "BRENT/USD"
}, {
  type: 'commodity',
  pairlabel: "NCDEX:COTTON",
  pair: "COTTON/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:COPPER",
  pair: "COPPER/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:ALUMINUM",
  pair: "ALUMINUM/USD"
}, {
  type: 'commodity',
  pairlabel: "PEPPERSTONE:COFFEE",
  pair: "COFFEE/USD"
}, {
  type: 'commodity',
  pairlabel: "AMEX:CORN",
  pair: "CORN/USD"
}, {
  type: 'commodity',
  pairlabel: "OANDA:SUGARUSD",
  pair: "SUGAR/USD"
}, {
  type: 'commodity',
  pairlabel: "BLACKBULL:WTI",
  pair: "WTI/USD"
}, {
  type: 'commodity',
  pairlabel: "TSXV:TIN",
  pair: "Tin/USD"
}, {
  type: 'commodity',
  pairlabel: "MEXC:TINUSDT",
  pair: "Tin/USDT"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:GOLD",
  pair: "Gold/USD"
}, {
  type: 'commodity',
  pairlabel: "SKILLING:NICKEL",
  pair: "Nickel/USD"
}, {
  type: 'commodity',
  pairlabel: "CBOT:EH1!",
  pair: "Ethanol/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:PALLADIUM",
  pair: "Palladium/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:SILVER",
  pair: "Silver/USD"
}, {
  type: 'commodity',
  pairlabel: "SWB:OD7I",
  pair: "Heating Oil/USD"
}, {
  type: 'commodity',
  pairlabel: "CAPITALCOM:PLATINUM",
  pair: "Platinum/USD"
}, {
  type: 'commodity',
  pairlabel: "IDX:COAL",
  pair: "Coal/USD"
}, {
  type: 'commodity',
  pairlabel: "TRADEGATE:B4N2",
  pair: "RBOB Gasoline/USD"
}, {
  type: 'commodity',
  pairlabel: "AMEX:UEC",
  pair: "Uranium/USD"
}, {
  type: 'commodity',
  pairlabel: "BLACKBULL:BRENT",
  pair: "Oil (Brent)/USD"
}, {
  type: 'commodity',
  pairlabel: "BLACKBULL:WTI",
  pair: "Oil (WTI)/USD"
}, {
  type: 'commodity',
  pairlabel: "PEPPERSTONE:ALUMINIUM",
  pair: "Aluminium/USD"
}, {
  type: 'commodity',
  pairlabel: "NCDEX:LEAD",
  pair: "Lead/USD"
}, {
  type: 'commodity',
  pairlabel: "FWB:NIO",
  pair: "Iron Ore/USD"
}, {
  type: 'commodity',
  pairlabel: "MIL:HOGS",
  pair: "Lean Hog/USD"
}, {
  type: 'commodity',
  pairlabel: "PEPPERSTONE:OATS",
  pair: "Oats/USD"
}, {
  type: 'commodity',
  pairlabel: "PEPPERSTONE:LUMBER",
  pair: "Lumber/USD"
}, {
  type: 'commodity',
  pairlabel: "VANTAGE:COCOA",
  pair: "Cocoa/USD"
}, {
  type: 'commodity',
  pairlabel: "NASDAQ:NQCILCER",
  pair: "Live Cattle/USD"
}, {
  type: 'commodity',
  pairlabel: "NASDAQ:NQCIFCER",
  pair: "Feeder Cattle/USD"
}, {
  type: 'commodity',
  pairlabel: "NEO:MILK",
  pair: "Milk/USD"
}, {
  type: 'commodity',
  pairlabel: "POLONIEX:MILKUSDT",
  pair: "Milk/USDT"
}, {
  type: 'commodity',
  pairlabel: "ICEUS:OJ1!",
  pair: "Orange Juice/USD"
}, {
  type: 'commodity',
  pairlabel: "SET:UVAN",
  pair: "Palm Oil/USD"
}, {
  type: 'commodity',
  pairlabel: "FRED:PROILUSDM",
  pair: "Rapeseed/USD"
}, {
  type: 'commodity',
  pairlabel: "MEXC:RICEUSDT",
  pair: "Rice/USDT"
}, {
  type: 'commodity',
  pairlabel: "CBOT:TRF1!",
  pair: "Rice/USD"
}, {
  type: 'commodity',
  pairlabel: "NCDEX:ZINC",
  pair: "Zinc/USD"
}, {
  type: 'commodity',
  pairlabel: "NASDAQ:NQCISMER",
  pair: "Soybean Meal/USD"
}, {
  type: 'commodity',
  pairlabel: "FPMARKETS:SOYBEANS",
  pair: "Soybeans/USD"
}, {
  type: 'commodity',
  pairlabel: "TRADEGATE:OD7P",
  pair: "Soybean Oil/USD"
}];
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
function getSanitizedPairs(_x) {
  return _getSanitizedPairs.apply(this, arguments);
}
function _getSanitizedPairs() {
  _getSanitizedPairs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(allowedpairs) {
    var processDBData, allowedPairsFromDB, dbDataProcessed, allAllowedPairs, sanitizedPromises, sanitized;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          processDBData = function _processDBData(inputData) {
            return inputData.map(function (item) {
              return {
                type: item.type,
                pairlabel: item.pairlabel,
                pair: item.pair
              };
            });
          };
          _context2.next = 3;
          return _allowedpair["default"].find();
        case 3:
          allowedPairsFromDB = _context2.sent;
          dbDataProcessed = processDBData(allowedPairsFromDB);
          allAllowedPairs = [].concat(_toConsumableArray(allowedpairs), _toConsumableArray(dbDataProcessed));
          sanitizedPromises = allAllowedPairs.map( /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(pair) {
              var _pair$pair$split, _pair$pair$split2, left, right, base, quote, price, leftid, rightid, lefttype, righttype;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _pair$pair$split = pair.pair.split('/'), _pair$pair$split2 = _slicedToArray(_pair$pair$split, 2), left = _pair$pair$split2[0], right = _pair$pair$split2[1];
                    _context.next = 3;
                    return _asset["default"].findOne({
                      symbol: left
                    });
                  case 3:
                    base = _context.sent;
                    _context.next = 6;
                    return _asset["default"].findOne({
                      symbol: right
                    });
                  case 6:
                    quote = _context.sent;
                    if (base && quote) {
                      price = (base.price / quote.price).toFixed(3);
                      leftid = base._id;
                      rightid = quote._id;
                      lefttype = base.assetType;
                      righttype = quote.assetType;
                    } else {
                      price = 0;
                      leftid = null;
                      rightid = null;
                      lefttype = null;
                      righttype = null;
                    }
                    return _context.abrupt("return", _objectSpread(_objectSpread({}, pair), {}, {
                      left: left,
                      right: right,
                      leftid: leftid,
                      rightid: rightid,
                      lefttype: lefttype,
                      righttype: righttype,
                      price: price,
                      change: generateRandomPercentageWithDirectionAndColor()
                    }));
                  case 9:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x2) {
              return _ref.apply(this, arguments);
            };
          }());
          _context2.next = 9;
          return Promise.all(sanitizedPromises);
        case 9:
          sanitized = _context2.sent;
          return _context2.abrupt("return", sanitized);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getSanitizedPairs.apply(this, arguments);
}
function processPairs() {
  return _processPairs.apply(this, arguments);
}
function _processPairs() {
  _processPairs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var sanitizedPairs;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return getSanitizedPairs(allowedpairs);
        case 3:
          sanitizedPairs = _context3.sent;
          return _context3.abrupt("return", sanitizedPairs);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error processing pairs:', _context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return _processPairs.apply(this, arguments);
}
var _default = exports["default"] = processPairs;