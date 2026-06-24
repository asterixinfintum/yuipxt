import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8005;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public path
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/btc_transactions';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  seedDatabase();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Seed database with sample data if empty
async function seedDatabase() {
  try {
    const count = await Transaction.countDocuments();
    if (count === 0) {
      console.log('📝 No transactions found. Creating sample data...');
      
      const sampleTx = new Transaction({
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
      
      await sampleTx.save();
      console.log('✅ Sample transaction created with hash:', sampleTx.txHash);
    }
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

// ============ ROUTES ============

// GET transaction data - FIXED
app.get('/api/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching transaction: ${id}`);
    
    // Check if id is a valid ObjectId before trying to query with it
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    let transaction = null;
    
    // First try to find by txHash (string)
    transaction = await Transaction.findOne({ txHash: id });
    
    // If not found and id is a valid ObjectId, try by _id
    if (!transaction && isValidObjectId) {
      transaction = await Transaction.findById(id);
    }
    
    if (!transaction) {
      console.log(`❌ Transaction not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    console.log(`✅ Transaction found: ${transaction.txHash}`);
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('❌ Error fetching all:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE transaction data - FIXED
app.put('/api/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    let transaction = null;
    
    // First try by txHash
    transaction = await Transaction.findOneAndUpdate(
      { txHash: id },
      updateData,
      { new: true, runValidators: true }
    );
    
    // If not found and valid ObjectId, try by _id
    if (!transaction && isValidObjectId) {
      transaction = await Transaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new transaction
app.post('/api/transaction', async (req, res) => {
  try {
    // Check if transaction with this hash already exists
    const existing = await Transaction.findOne({ txHash: req.body.txHash });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Transaction with this hash already exists'
      });
    }
    
    const transaction = new Transaction(req.body);
    await transaction.save();
    
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE transaction
app.delete('/api/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    let transaction = null;
    
    // First try by txHash
    transaction = await Transaction.findOneAndDelete({ txHash: id });
    
    // If not found and valid ObjectId, try by _id
    if (!transaction && isValidObjectId) {
      transaction = await Transaction.findByIdAndDelete(id);
    }
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
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
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving: ${publicPath}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/transaction/0x8088fc966eda77adf803f9d061f59da65a6e66452d10d822c598f433ae106feb`);
});

export default app;