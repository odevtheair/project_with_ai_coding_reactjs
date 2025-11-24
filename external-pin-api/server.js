import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const VALID_PIN = process.env.VALID_PIN || '123456';

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'External PIN Verification API is running',
    timestamp: new Date().toISOString(),
    service: 'PIN Verification',
    version: '1.0.0'
  });
});

// PIN verification endpoint
app.post('/api/verify-pin', (req, res) => {
  try {
    const { pin } = req.body;
    const timestamp = new Date().toISOString();

    // Validate input
    if (!pin) {
      console.log(`[${timestamp}] ❌ PIN verification failed: PIN not provided`);
      return res.status(400).json({
        success: false,
        message: 'PIN is required',
        code: 'PIN_REQUIRED'
      });
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      console.log(`[${timestamp}] ❌ PIN verification failed: Invalid format - ${pin}`);
      return res.status(400).json({
        success: false,
        message: 'PIN must be exactly 6 digits',
        code: 'INVALID_FORMAT'
      });
    }

    // Simulate processing delay (realistic API behavior)
    setTimeout(() => {
      if (pin === VALID_PIN) {
        console.log(`[${timestamp}] ✅ PIN verification successful: ${pin}`);
        return res.json({
          success: true,
          message: 'PIN is valid',
          code: 'PIN_VALID',
          verified: true,
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`[${timestamp}] ❌ PIN verification failed: Invalid PIN - ${pin}`);
        return res.status(401).json({
          success: false,
          message: 'PIN is invalid',
          code: 'PIN_INVALID',
          verified: false
        });
      }
    }, 300); // 300ms delay to simulate network latency

  } catch (error) {
    console.error('Error in PIN verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Get statistics (for monitoring)
let totalRequests = 0;
let successfulVerifications = 0;
let failedVerifications = 0;

app.use((req, res, next) => {
  if (req.path === '/api/verify-pin') {
    totalRequests++;
  }

  const originalJson = res.json;
  res.json = function(data) {
    if (req.path === '/api/verify-pin') {
      if (data.success) {
        successfulVerifications++;
      } else if (res.statusCode === 401) {
        failedVerifications++;
      }
    }
    return originalJson.call(this, data);
  };

  next();
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRequests,
      successfulVerifications,
      failedVerifications,
      successRate: totalRequests > 0
        ? ((successfulVerifications / totalRequests) * 100).toFixed(2) + '%'
        : '0%',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Reset statistics (for testing)
app.post('/api/stats/reset', (req, res) => {
  totalRequests = 0;
  successfulVerifications = 0;
  failedVerifications = 0;

  res.json({
    success: true,
    message: 'Statistics reset successfully'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'SERVER_ERROR',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🔐 External PIN Verification API');
  console.log('═══════════════════════════════════════');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Valid PIN: ${VALID_PIN}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log('\n📚 Available Endpoints:');
  console.log(`   GET    /api/health           - Health check`);
  console.log(`   POST   /api/verify-pin       - Verify PIN code`);
  console.log(`   GET    /api/stats            - Get statistics`);
  console.log(`   POST   /api/stats/reset      - Reset statistics`);
  console.log('═══════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
