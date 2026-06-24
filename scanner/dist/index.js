function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Public path
var publicPath = path.join(__dirname, '..', 'public');
app.use(express["static"](publicPath));

// MongoDB Connection
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/btc_transactions';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', function () {
  console.log('✅ MongoDB connected');
  seedDatabase();
});
mongoose.connection.on('error', function (err) {
  console.error('❌ MongoDB error:', err);
});

// Seed database with sample data if empty
function seedDatabase() {
  return _seedDatabase.apply(this, arguments);
} // ============ ROUTES ============
// GET transaction data - FIXED
function _seedDatabase() {
  _seedDatabase = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var count, sampleTx, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return Transaction.countDocuments();
        case 1:
          count = _context6.v;
          if (!(count === 0)) {
            _context6.n = 3;
            break;
          }
          console.log('📝 No transactions found. Creating sample data...');
          sampleTx = new Transaction({
            accountName: 'Harold Luthor',
            platform: 'Binance US',
            btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            fromAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            toAddress: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
            amountUSD: 140000,
            amountBTC: 2.1458,
            exchangeRate: 65245,
            gasFee: 10500,
            estimatedFeeUSD: 10500,
            estimatedFeeBTC: 0.00045,
            baseFee: 25.42,
            priorityFee: 3.94,
            txHash: '0x8088fc966eda77adf803f9d061f59da65a6e66452d10d822c598f433ae106feb',
            blockNumber: 865432,
            confirmations: 74,
            status: 'confirmed',
            timestamp: new Date()
          });
          _context6.n = 2;
          return sampleTx.save();
        case 2:
          console.log('✅ Sample transaction created with hash:', sampleTx.txHash);
        case 3:
          _context6.n = 5;
          break;
        case 4:
          _context6.p = 4;
          _t6 = _context6.v;
          console.error('❌ Seed error:', _t6);
        case 5:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 4]]);
  }));
  return _seedDatabase.apply(this, arguments);
}
app.get('/api/transaction/:id', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var id, isValidObjectId, transaction, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          id = req.params.id;
          console.log("\uD83D\uDD0D Fetching transaction: ".concat(id));

          // Check if id is a valid ObjectId before trying to query with it
          isValidObjectId = mongoose.Types.ObjectId.isValid(id);
          transaction = null; // First try to find by txHash (string)
          _context.n = 1;
          return Transaction.findOne({
            txHash: id
          });
        case 1:
          transaction = _context.v;
          if (!(!transaction && isValidObjectId)) {
            _context.n = 3;
            break;
          }
          _context.n = 2;
          return Transaction.findById(id);
        case 2:
          transaction = _context.v;
        case 3:
          if (transaction) {
            _context.n = 4;
            break;
          }
          console.log("\u274C Transaction not found: ".concat(id));
          return _context.a(2, res.status(404).json({
            success: false,
            message: 'Transaction not found'
          }));
        case 4:
          console.log("\u2705 Transaction found: ".concat(transaction.txHash));
          res.json({
            success: true,
            data: transaction
          });
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.error('❌ API Error:', _t);
          res.status(500).json({
            success: false,
            message: _t.message,
            stack: process.env.NODE_ENV === 'development' ? _t.stack : undefined
          });
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[0, 5]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// GET all transactions
app.get('/api/transactions', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var transactions, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return Transaction.find().sort({
            createdAt: -1
          });
        case 1:
          transactions = _context2.v;
          res.json({
            success: true,
            count: transactions.length,
            data: transactions
          });
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.error('❌ Error fetching all:', _t2);
          res.status(500).json({
            success: false,
            message: _t2.message
          });
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// UPDATE transaction data - FIXED
app.put('/api/transaction/:id', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var id, updateData, isValidObjectId, transaction, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          id = req.params.id;
          updateData = req.body;
          isValidObjectId = mongoose.Types.ObjectId.isValid(id);
          transaction = null; // First try by txHash
          _context3.n = 1;
          return Transaction.findOneAndUpdate({
            txHash: id
          }, updateData, {
            "new": true,
            runValidators: true
          });
        case 1:
          transaction = _context3.v;
          if (!(!transaction && isValidObjectId)) {
            _context3.n = 3;
            break;
          }
          _context3.n = 2;
          return Transaction.findByIdAndUpdate(id, updateData, {
            "new": true,
            runValidators: true
          });
        case 2:
          transaction = _context3.v;
        case 3:
          if (transaction) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, res.status(404).json({
            success: false,
            message: 'Transaction not found'
          }));
        case 4:
          res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
          });
          _context3.n = 6;
          break;
        case 5:
          _context3.p = 5;
          _t3 = _context3.v;
          console.error('❌ Update error:', _t3);
          res.status(500).json({
            success: false,
            message: _t3.message
          });
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 5]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

// CREATE new transaction
app.post('/api/transaction', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var existing, transaction, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return Transaction.findOne({
            txHash: req.body.txHash
          });
        case 1:
          existing = _context4.v;
          if (!existing) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(400).json({
            success: false,
            message: 'Transaction with this hash already exists'
          }));
        case 2:
          transaction = new Transaction(req.body);
          _context4.n = 3;
          return transaction.save();
        case 3:
          res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
          });
          _context4.n = 5;
          break;
        case 4:
          _context4.p = 4;
          _t4 = _context4.v;
          console.error('❌ Create error:', _t4);
          res.status(400).json({
            success: false,
            message: _t4.message
          });
        case 5:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 4]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

// DELETE transaction
app["delete"]('/api/transaction/:id', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var id, isValidObjectId, transaction, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          id = req.params.id;
          isValidObjectId = mongoose.Types.ObjectId.isValid(id);
          transaction = null; // First try by txHash
          _context5.n = 1;
          return Transaction.findOneAndDelete({
            txHash: id
          });
        case 1:
          transaction = _context5.v;
          if (!(!transaction && isValidObjectId)) {
            _context5.n = 3;
            break;
          }
          _context5.n = 2;
          return Transaction.findByIdAndDelete(id);
        case 2:
          transaction = _context5.v;
        case 3:
          if (transaction) {
            _context5.n = 4;
            break;
          }
          return _context5.a(2, res.status(404).json({
            success: false,
            message: 'Transaction not found'
          }));
        case 4:
          res.json({
            success: true,
            message: 'Transaction deleted successfully',
            data: transaction
          });
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t5 = _context5.v;
          console.error('❌ Delete error:', _t5);
          res.status(500).json({
            success: false,
            message: _t5.message
          });
        case 6:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 5]]);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}());

// Health check
app.get('/api/health', function (req, res) {
  var dbState = mongoose.connection.readyState;
  var states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      state: states[dbState],
      ready: dbState === 1
    }
  });
});

// Serve HTML
app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404 handler
app.use(function (req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use(function (err, req, res, next) {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
  console.log("\uD83D\uDCC1 Serving: ".concat(publicPath));
  console.log("\uD83D\uDCCA MongoDB: ".concat(MONGODB_URI));
  console.log("\uD83D\uDD17 Test API: http://localhost:".concat(PORT, "/api/transaction/0x8088fc966eda77adf803f9d061f59da65a6e66452d10d822c598f433ae106feb"));
});
export default app;