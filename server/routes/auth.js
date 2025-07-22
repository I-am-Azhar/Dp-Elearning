const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Get current user info
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only test route
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Hello, admin!' });
});

module.exports = router; 