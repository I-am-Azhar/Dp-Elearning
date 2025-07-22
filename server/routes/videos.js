const express = require('express');
const rateLimit = require('express-rate-limit');
const { authMiddleware } = require('../middleware/auth');
const videoController = require('../controllers/videoController');

const router = express.Router();

const videoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20, // 20 requests per 10 min per IP
});

router.post('/get-url', authMiddleware, videoLimiter, videoController.getVideoUrl);

module.exports = router; 