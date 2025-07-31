require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Check required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file. See server/ENV_SETUP.md for setup instructions.');
  process.exit(1);
}

// Check optional environment variables
const optionalEnvVars = {
  'STRIPE_SECRET_KEY': 'Payment functionality will be disabled',
  'FIREBASE_PROJECT_ID': 'Google authentication will be disabled',
  'FRONTEND_URL': 'Payment redirects may not work properly'
};

Object.entries(optionalEnvVars).forEach(([varName, message]) => {
  if (!process.env[varName]) {
    console.warn(`⚠️  ${varName} is not set. ${message}`);
  }
});

// Middleware
app.use(express.json());
app.use(express.raw()); // Add express.raw middleware for Stripe webhook route

// Enable CORS for all origins (development)
app.use(cors());

// Rate Limiting (global, can override per route)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes (to be added)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const courseRoutes = require('./routes/courses');
app.use('/api/courses', courseRoutes);
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);
const videoRoutes = require('./routes/videos');
app.use('/api/videos', videoRoutes);

// Health check
app.get('/', (req, res) => res.send('API running'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Environment setup guide: server/ENV_SETUP.md`);
}); 