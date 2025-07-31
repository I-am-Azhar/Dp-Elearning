const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('Registration error:', err); // <--- Add this line
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, photoURL } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, update Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user with Google data
      user = new User({
        name: name || email.split('@')[0],
        email,
        googleId,
        photoURL,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password for Google users
      });
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        photoURL: user.photoURL 
      }, 
      token 
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 