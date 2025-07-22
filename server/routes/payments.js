const express = require('express');
const rateLimit = require('express-rate-limit');
const { authMiddleware } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Rate limit purchase initiation
const purchaseLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 5 purchases per 10 min per IP
});

router.post('/initiate', authMiddleware, purchaseLimiter, paymentController.initiatePurchase);

// Stripe webhook (must use raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 