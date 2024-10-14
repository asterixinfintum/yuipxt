"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("regenerator-runtime/runtime.js");
var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _nodeCron = _interopRequireDefault(require("node-cron"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _asset = _interopRequireDefault(require("./models/asset"));
var _signup = _interopRequireDefault(require("./routes/signup"));
var _login = _interopRequireDefault(require("./routes/login"));
var _logout = _interopRequireDefault(require("./routes/logout"));
var _client = _interopRequireDefault(require("./routes/client"));
var _asset2 = _interopRequireDefault(require("./routes/asset"));
var _wllt = _interopRequireDefault(require("./wallet/routes/wllt"));
var _routes = _interopRequireDefault(require("./admin/routes"));
var _fileupload = _interopRequireDefault(require("./routes/fileupload.js"));
var _imageupload = _interopRequireDefault(require("./routes/imageupload.js"));
var _videoupload = _interopRequireDefault(require("./routes/videoupload.js"));
var _pairs = _interopRequireDefault(require("./trade/routes/pairs.js"));
var _orders = _interopRequireDefault(require("./trade/routes/orders.js"));
var _assets = _interopRequireDefault(require("./trade/routes/assets.js"));
var _dailyreport = _interopRequireDefault(require("./userdashboard/dailyreport"));
var _transactions = _interopRequireDefault(require("./wallet/routes/transactions.js"));
var _seedAssets = _interopRequireDefault(require("./functions/seedAssets"));
var _getBitcoinBalances = _interopRequireDefault(require("./wallet/functions/getBitcoinBalances"));
var _getprices = _interopRequireDefault(require("./trade/getprices.js"));
var _updatecommoditiesprices = _interopRequireDefault(require("./trade/commodities/updatecommoditiesprices.js"));
var _setonlineuser = _interopRequireDefault(require("./functions/setonlineuser"));
var _setofflineuser = _interopRequireDefault(require("./functions/setofflineuser"));
var _setpairinview = _interopRequireDefault(require("./functions/setpairinview"));
var _setpairoutofview = _interopRequireDefault(require("./functions/setpairoutofview"));
var _admin = _interopRequireDefault(require("./userwallet/controllers/admin"));
var _user = _interopRequireDefault(require("./userwallet/controllers/user"));
var _controller = _interopRequireDefault(require("./userdashboard/controller"));
var _admin2 = _interopRequireDefault(require("./userdashboard/controller/admin"));
var _controllers = _interopRequireDefault(require("./swaps/controllers"));
var _controllers2 = _interopRequireDefault(require("./transfer/controllers"));
var _controllers3 = _interopRequireDefault(require("./trader/controllers"));
var _controller2 = _interopRequireDefault(require("./assets/controller"));
var _usersettings = _interopRequireDefault(require("./routes/usersettings"));
require("./userdashboard");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var allowlist = ['https://tradexquant.com', 'https://www.tradexquant.com', 'https://app.tradexquant.com'];
var corsOptionsDelegate = function corsOptionsDelegate(req, callback) {
  var corsOptions;
  var isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;
  if (isDomainAllowed) {
    corsOptions = {
      origin: true
    };
  } else {
    corsOptions = {
      origin: false
    };
  }
  callback(null, corsOptions);
};
app.use((0, _cors["default"])(corsOptionsDelegate));

/*const io = socket(server, {
  cors: {
    origin: [`${process.env.baseurl}`, `${process.env.wwwbaseurl}`],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

let ioInstance;*/

//import fileretrieveRoute from './routes/fileretrieve.js';

/*function initSocketIO() {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');

      if (socket.user) {
        setofflineuser(socket.user._id)
      }
    });

    socket.on('pairinview', (data) => {

      setpairinview(data.pairid);
    });

    socket.on('pairoutofview', (data) => {

      setpairoutofview(data.pairid);
    });
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      const actualToken = token.split(' ')[1];

      const onlineuser = await setonlineuser(actualToken);

      if (onlineuser) {
        socket.user = {
          _id: onlineuser._id,
          firstname: onlineuser.firstname,
          lastname: onlineuser.lastname,
          email: onlineuser.email
        };
      }

      //console.log(socket.user )

      next();
    }
  });

  ioInstance = io;
}*/

function getCurrentDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are zero-based
  var day = ('0' + now.getDate()).slice(-2);
  var hours = ('0' + now.getHours()).slice(-2);
  var minutes = ('0' + now.getMinutes()).slice(-2);
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}
_nodeCron["default"].schedule("*/1 * * * *", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  var date;
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        date = getCurrentDateTime(); //await getprices(date);
      case 1:
      case "end":
        return _context.stop();
    }
  }, _callee);
})));
_nodeCron["default"].schedule('0 */5 * * *', function () {
  (0, _updatecommoditiesprices["default"])();
});
var staticPath = _path["default"].join(__dirname, '../public');
app.use(_express["default"]["static"](staticPath));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public/ui')));
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
var PORT = process.env.PORT || 8082;
app.use(_signup["default"]);
app.use(_login["default"]);
app.use(_logout["default"]);
app.use(_client["default"]);
app.use(_wllt["default"]);
app.use(_routes["default"]);
app.use(_asset2["default"]);
app.use(_pairs["default"]);
app.use(_orders["default"]);
app.use(_assets["default"]);
app.use(_transactions["default"]);
app.use(_fileupload["default"]);
app.use(_imageupload["default"]);
app.use(_videoupload["default"]);
app.use(_dailyreport["default"]);
app.use(_admin["default"]);
app.use(_user["default"]);
app.use(_controller2["default"]);
app.use(_controller["default"]);
app.use(_admin2["default"]);
app.use(_controllers["default"]);
app.use(_controllers2["default"]);
app.use(_controllers3["default"]);
app.use(_usersettings["default"]);
var publicPath = _path["default"].join(__dirname, '..', 'public');
var pagesPath = _path["default"].join(publicPath, 'pages');
app.use(_express["default"]["static"](publicPath));
app.get('/accounts', function (req, res) {
  res.sendFile(_path["default"].join(pagesPath, 'accounts.html'));
});
app.get('/market', function (req, res) {
  res.sendFile(_path["default"].join(pagesPath, 'market.html'));
});
app.get('/platform', function (req, res) {
  res.sendFile(_path["default"].join(pagesPath, 'platform.html'));
});
app.get('*', function (req, res) {
  res.sendFile(_path["default"].join(pagesPath, 'index.html'));
});
_mongoose["default"].connect("".concat(process.env.DB), {
  //mongodb://db:27017/traderapiv2 =====> production
  //mongodb://127.0.0.1:27017/traderapiv2 ===> development

  useNewUrlParser: true,
  useUnifiedTopology: true
}).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
  var assets;
  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        console.log('connected to database');
        _context3.next = 3;
        return _asset["default"].find();
      case 3:
        assets = _context3.sent;
        if (!assets.length) {
          (0, _seedAssets["default"])({
            assetType: 'crypto'
          });
          (0, _seedAssets["default"])({
            assetType: 'stock'
          });
          (0, _seedAssets["default"])({
            assetType: 'commodity'
          });
          (0, _seedAssets["default"])({
            assetType: 'fiat'
          });
        }
        server.listen(PORT, /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(error) {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!error) {
                    _context2.next = 2;
                    break;
                  }
                  return _context2.abrupt("return", error);
                case 2:
                  return _context2.abrupt("return", console.log("server started on port here now ".concat(PORT)));
                case 3:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }));
          return function (_x) {
            return _ref3.apply(this, arguments);
          };
        }());
      case 6:
      case "end":
        return _context3.stop();
    }
  }, _callee3);
})));