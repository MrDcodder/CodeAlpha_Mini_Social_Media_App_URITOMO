const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDatabase, dbGet, dbAll, dbRun } = require('../database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, display_name, bio, location, website, avatar_url } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (!display_name || !bio || !avatar_url) {
      return res.status(400).json({ error: 'Display name, bio, and a profile photo are required' });
    }

    // Check if user exists
    const existingUser = dbGet('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const id = uuidv4();
    const password_hash = bcrypt.hashSync(password, 10);
    const displayName = display_name || username;
    const safeBio = bio?.trim() || '';
    const safeLocation = location?.trim() || null;
    const safeWebsite = website?.trim() || null;
    const safeAvatarUrl = avatar_url?.trim() || '';

    dbRun(
      'INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, location, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, username, email, password_hash, displayName, safeBio, safeAvatarUrl, safeLocation, safeWebsite]
    );

    const user = dbGet('SELECT id, username, email, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro FROM users WHERE id = ?', [id]);
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

