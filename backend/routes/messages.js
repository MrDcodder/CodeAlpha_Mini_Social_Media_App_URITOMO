const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbGet, dbAll, dbRun } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages - Get conversations for the current user
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique conversation partners with last message
    const conversations = dbAll(`
      SELECT 
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id 
          ELSE m.sender_id 
        END as user_id,
        u.username, u.display_name, u.avatar_url, u.is_verified,
        m.content as last_message,
        m.created_at as last_message_at,
        m.sender_id as last_sender_id,
        (SELECT COUNT(*) FROM messages WHERE 
          ((sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)) 
          AND is_read = 0 AND sender_id != ?
        ) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY user_id
      ORDER BY m.created_at DESC
    `, [userId, userId, userId, userId, userId, userId]);

    res.json({ conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/:userId - Get messages between current user and another user
router.get('/:userId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = dbAll(`
      SELECT m.*, u.username, u.display_name, u.avatar_url
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `, [userId, otherUserId, otherUserId, userId]);

    // Mark messages as read
    dbRun('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0', [otherUserId, userId]);

    // Get other user info
    const otherUser = dbGet('SELECT id, username, display_name, avatar_url, is_verified FROM users WHERE id = ?', [otherUserId]);

    res.json({ messages, otherUser });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages/:userId - Send a message
router.post('/:userId', authenticateToken, (req, res) => {
  try {
    const { content, media_url } = req.body;

    if (!content && !media_url) {
      return res.status(400).json({ error: 'Content or media URL is required' });
    }

    const id = uuidv4();

    dbRun('INSERT INTO messages (id, sender_id, receiver_id, content, media_url) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, req.params.userId, content, media_url]);

    const message = dbGet(`
      SELECT m.*, u.username, u.display_name, u.avatar_url
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.id = ?
    `, [id]);

    res.status(201).json({ message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

