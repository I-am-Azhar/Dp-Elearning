require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 