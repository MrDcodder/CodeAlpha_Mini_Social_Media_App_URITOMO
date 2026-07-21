const jwt = require('jsonwebtoken');
const { dbGet } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'uritomo-secret-key-2024-noir';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbGet('SELECT id, username, email, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro FROM users WHERE id = ?', [decoded.id]);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbGet('SELECT id, username, email, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro FROM users WHERE id = ?', [decoded.id]);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

module.exports = { generateToken, authenticateToken, optionalAuth, JWT_SECRET };

