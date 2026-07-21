const express = require('express');
const { dbGet, dbAll } = require('../database');

const router = express.Router();

// GET /api/search?q=query
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;

    const users = dbAll(`
      SELECT id, username, display_name, avatar_url, bio, is_verified, is_pro
      FROM users
      WHERE username LIKE ? OR display_name LIKE ? OR bio LIKE ?
      LIMIT 20
    `, [searchTerm, searchTerm, searchTerm]);

    const posts = dbAll(`
      SELECT p.*, u.username, u.display_name, u.avatar_url, u.is_verified,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.content LIKE ? OR p.tags LIKE ?
      ORDER BY p.created_at DESC
      LIMIT 20
    `, [searchTerm, searchTerm]);

    res.json({ users, posts });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/trending
router.get('/trending', (req, res) => {
  try {
    const trending = dbAll('SELECT * FROM trending_topics ORDER BY post_count DESC LIMIT 10');
    res.json({ trending });
  } catch (err) {
    console.error('Get trending error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

