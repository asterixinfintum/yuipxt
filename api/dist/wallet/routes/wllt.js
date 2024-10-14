"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _wllt = _interopRequireDefault(require("../models/wllt"));
var _asset = _interopRequireDefault(require("../../models/asset"));
var _withdrawalrequest = _interopRequireDefault(require("../models/withdrawalrequest"));
var _authenticateToken = _interopRequireDefault(require("../../utils/authenticateToken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var walletroute = _express["default"].Router();
walletroute.get('/wallets', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var ownerId, wallets, walletsPromises, wllts;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!req.user || !req.user._id)) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", res.status(404).send({
            message: 'Not allowed'
          }));
        case 2:
          _context2.prev = 2;
          ownerId = req.user._id;
          _context2.next = 6;
          return _wllt["default"].find({
            ownerId: ownerId
          });
        case 6:
          wallets = _context2.sent;
          walletsPromises = wallets.map( /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
              var bitcoinAddress, _id, walletType, balance, totalblc, blcs, transactions, assetblcs;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    bitcoinAddress = _ref2.bitcoinAddress, _id = _ref2._id, walletType = _ref2.walletType, balance = _ref2.balance;
                    _context.next = 3;
                    return _wllt["default"].returnTotalBlc(_id);
                  case 3:
                    totalblc = _context.sent;
                    _context.next = 6;
                    return _wllt["default"].returnBlcs(_id);
                  case 6:
                    blcs = _context.sent;
                    _context.next = 9;
                    return _wllt["default"].getTransactions(_id);
                  case 9:
                    transactions = _context.sent;
                    _context.next = 12;
                    return _wllt["default"].returnAssetBlcs(_id);
                  case 12:
                    assetblcs = _context.sent;
                    return _context.abrupt("return", {
                      bitcoinAddress: bitcoinAddress,
                      _id: _id,
                      walletType: walletType,
                      totalblc: totalblc,
                      blcs: blcs,
                      transactions: transactions,
                      assetblcs: assetblcs,
                      balance: balance
                    });
                  case 14:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref3.apply(this, arguments);
            };
          }());
          _context2.next = 10;
          return Promise.all(walletsPromises);
        case 10:
          wllts = _context2.sent;
          res.status(200).send({
            wllts: wllts
          });
          _context2.next = 18;
          break;
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](2);
          console.error('Error retrieving wallets:', _context2.t0);
          res.status(500).send({
            error: 'An error occurred while retrieving wallets.'
          });
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[2, 14]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
walletroute.post('/withdraw', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body, asset, amount, usdamount, Bank, Account, wallet, wallettype, withdrawrequest;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(!req.user || !req.user._id)) {
            _context3.next = 2;
            break;
          }
          return _context3.abrupt("return", res.status(404).send({
            message: 'Not allowed'
          }));
        case 2:
          _context3.prev = 2;
          _req$body = req.body, asset = _req$body.asset, amount = _req$body.amount, usdamount = _req$body.usdamount, Bank = _req$body.Bank, Account = _req$body.Account, wallet = _req$body.wallet, wallettype = _req$body.wallettype;
          withdrawrequest = new _withdrawalrequest["default"]({
            userid: req.user._id,
            asset: asset,
            amount: amount,
            usdamount: usdamount,
            Bank: Bank,
            Account: Account,
            wallet: wallet,
            wallettype: wallettype
          });
          _context3.next = 7;
          return withdrawrequest.save();
        case 7:
          res.status(200).send({
            message: 'Request sent successfully.'
          });
          _context3.next = 14;
          break;
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](2);
          console.error('Error processing withdrawal request:', _context3.t0);
          res.status(500).send({
            error: 'An error occurred while processing the withdrawal request.'
          });
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[2, 10]]);
  }));
  return function (_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}());
walletroute.get('/balance', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _id, wallet, blc;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!req.user || !req.user._id)) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: 'Not allowed'
          }));
        case 2:
          _context4.prev = 2;
          _id = req.query.walletid;
          _context4.next = 6;
          return _wllt["default"].findOne({
            _id: _id
          });
        case 6:
          wallet = _context4.sent;
          if (wallet) {
            _context4.next = 9;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            message: 'Wallet not found'
          }));
        case 9:
          _context4.next = 11;
          return _wllt["default"].returnTotalBlc(_id);
        case 11:
          blc = _context4.sent;
          res.status(200).send({
            balance: blc
          });
          _context4.next = 19;
          break;
        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](2);
          console.error('Error retrieving balance:', _context4.t0);
          res.status(500).send({
            error: 'An error occurred while retrieving the balance.'
          });
        case 19:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 15]]);
  }));
  return function (_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());
walletroute.get('/balances', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _id, wallet, blcs;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!(!req.user || !req.user._id)) {
            _context5.next = 2;
            break;
          }
          return _context5.abrupt("return", res.status(404).send({
            message: 'Not allowed'
          }));
        case 2:
          _context5.prev = 2;
          _id = req.query.walletid;
          _context5.next = 6;
          return _wllt["default"].findOne({
            _id: _id
          });
        case 6:
          wallet = _context5.sent;
          if (wallet) {
            _context5.next = 9;
            break;
          }
          return _context5.abrupt("return", res.status(404).send({
            message: 'Wallet not found'
          }));
        case 9:
          _context5.next = 11;
          return _wllt["default"].returnBlcs(_id);
        case 11:
          blcs = _context5.sent;
          res.status(200).send({
            balances: blcs
          });
          _context5.next = 19;
          break;
        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](2);
          console.error('Error retrieving balances:', _context5.t0);
          res.status(500).send({
            error: 'An error occurred while retrieving balances.'
          });
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 15]]);
  }));
  return function (_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}());
walletroute.get('/transactions', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _id, wallet, transactions;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!(req.user && req.user._id)) {
            _context6.next = 15;
            break;
          }
          _id = req.query.walletid;
          _context6.next = 4;
          return _wllt["default"].findOne({
            _id: _id
          });
        case 4:
          wallet = _context6.sent;
          if (!wallet) {
            _context6.next = 12;
            break;
          }
          _context6.next = 8;
          return _wllt["default"].getTransactions(_id);
        case 8:
          transactions = _context6.sent;
          res.status(200).send({
            transactions: transactions
          });
          _context6.next = 13;
          break;
        case 12:
          res.status(404).send({
            message: 'not allowed'
          });
        case 13:
          _context6.next = 16;
          break;
        case 15:
          res.status(404).send({
            message: 'not allowed'
          });
        case 16:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}());
walletroute.get('/wallet/assets', _authenticateToken["default"], /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var roundUpToWholeNumber, numberToArray, _req$query, wallettype, assetType, pageSize, currentPage, limit, startIndex, total, ownerId, paginator, wallets, userwallet, assetlist, blcs, assets;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          numberToArray = function _numberToArray(num) {
            return Array.from({
              length: num
            }, function (_, i) {
              return i + 1;
            });
          };
          roundUpToWholeNumber = function _roundUpToWholeNumber(num) {
            return Math.ceil(num);
          };
          if (!(!req.user || !req.user._id)) {
            _context7.next = 4;
            break;
          }
          return _context7.abrupt("return", res.status(404).send({
            message: 'Not allowed'
          }));
        case 4:
          _req$query = req.query, wallettype = _req$query.wallettype, assetType = _req$query.assetType, pageSize = _req$query.pageSize, currentPage = _req$query.currentPage;
          if (!(req.user && req.user._id)) {
            _context7.next = 34;
            break;
          }
          _context7.prev = 6;
          limit = pageSize;
          startIndex = (currentPage - 1) * limit;
          _context7.next = 11;
          return _asset["default"].countDocuments({
            assetType: assetType
          }).exec();
        case 11:
          total = _context7.sent;
          ownerId = req.user._id;
          paginator = roundUpToWholeNumber(total / limit);
          _context7.next = 16;
          return _wllt["default"].find({
            ownerId: ownerId
          });
        case 16:
          wallets = _context7.sent;
          userwallet = wallets.find(function (wallet) {
            return wallet.walletType === wallettype;
          });
          assetlist = [];
          if (!userwallet) {
            _context7.next = 24;
            break;
          }
          _context7.next = 22;
          return _wllt["default"].returnBlcs(userwallet._id);
        case 22:
          blcs = _context7.sent;
          if (blcs.length) {
            blcs.forEach(function (blc) {
              var blcitem = _objectSpread({}, blc.asset.toObject());
              blcitem.usdblc = blc.usdblc;
              blcitem.btcblc = blc.btcblc;
              blcitem.assetblc = blc.assetblc;
              if (blc.asset.toObject().assetType === assetType) {
                assetlist.push(blcitem);
              }
            });
          }
        case 24:
          _context7.next = 26;
          return _asset["default"].find({
            assetType: assetType
          }).limit(limit).skip(startIndex).exec();
        case 26:
          assets = _context7.sent;
          assets.forEach(function (_ref9) {
            var _id = _ref9._id,
              name = _ref9.name,
              coin = _ref9.coin,
              symbol = _ref9.symbol,
              assetType = _ref9.assetType,
              price = _ref9.price,
              image = _ref9.image,
              listed = _ref9.listed;
            var foundasset = assetlist.filter(function (asset) {
              return asset.coin === coin;
            });
            if (listed && !foundasset.length) {
              assetlist.push({
                _id: _id,
                name: name,
                coin: coin,
                symbol: symbol,
                assetType: assetType,
                price: price,
                image: image,
                listed: listed
              });
            }
          });
          res.status(200).json({
            assets: assetlist,
            paginator: numberToArray(paginator)
          });
          _context7.next = 34;
          break;
        case 31:
          _context7.prev = 31;
          _context7.t0 = _context7["catch"](6);
          throw _context7.t0;
        case 34:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[6, 31]]);
  }));
  return function (_x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}());

/*walletroute.post('/swap', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const _id = req.query.walletid;
        const wallet = await Wallet.findOne({ _id });
        let fee = 0;

        const { quantity, assetFrom, assetTo } = req.body;

        if (wallet) {
            const swap = await wallet.swap(quantity, fee, assetFrom, assetTo);
            res.status(200).send({ swap });
        } else {
            res.status(404).send({ message: 'not allowed' })
        }
    } else {
        res.status(404).send({ message: 'not allowed' })
    }
});*/
var _default = exports["default"] = walletroute;