// server.js (updated)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const scammerRoutes = require('./routes/scammer');
const verificationRoutes = require('./routes/verification');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/scammer', scammerRoutes);
app.use('/api/verification', verificationRoutes);

// Health check
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        success: true,
        message: 'SafayPay API is running',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected',
        version: '1.0.0'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`🚀 SafayPay Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Test database connection
    await testConnection();
    
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
    console.log(`👤 Users: http://localhost:${PORT}/api/users`);
    console.log(`💳 Transactions: http://localhost:${PORT}/api/transactions`);
    console.log(`🛡️ Scammer Reports: http://localhost:${PORT}/api/scammer`);
    console.log(`✅ Verification: http://localhost:${PORT}/api/verification`);
});