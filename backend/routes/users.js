const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbGet, dbAll, dbRun } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:id - Get user profile
router.get('/:id', (req, res) => {
  try {
    const user = dbGet('SELECT id, username, email, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro FROM users WHERE id = ?', [req.params.id]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get counts
    const followerCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [req.params.id]);
    const followingCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', [req.params.id]);
    const postCount = dbGet('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [req.params.id]);

    res.json({
      user: {
        ...user,
        follower_count: followerCount.count,
        following_count: followingCount.count,
        post_count: postCount.count
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id - Update profile
router.put('/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { display_name, bio, location, website, avatar_url } = req.body;

    dbRun(
      'UPDATE users SET display_name = COALESCE(?, display_name), bio = COALESCE(?, bio), location = COALESCE(?, location), website = COALESCE(?, website), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
      [display_name, bio, location, website, avatar_url, req.params.id]
    );

    const user = dbGet('SELECT id, username, email, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro FROM users WHERE id = ?', [req.params.id]);

    res.json({ user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id/followers
router.get('/:id/followers', (req, res) => {
  try {
    const followers = dbAll(`
      SELECT u.id, u.username, u.display_name, u.avatar_url, u.is_verified, f.created_at as followed_at
      FROM followers f
      JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.id]);

    res.json({ followers });
  } catch (err) {
    console.error('Get followers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id/following
router.get('/:id/following', (req, res) => {
  try {
    const following = dbAll(`
      SELECT u.id, u.username, u.display_name, u.avatar_url, u.is_verified, f.created_at as followed_at
      FROM followers f
      JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.id]);

    res.json({ following });
  } catch (err) {
    console.error('Get following error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', authenticateToken, (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existing = dbGet('SELECT id FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
    if (existing) {
      return res.status(409).json({ error: 'Already following this user' });
    }

    const id = uuidv4();
    dbRun('INSERT INTO followers (id, follower_id, following_id) VALUES (?, ?, ?)', [id, followerId, followingId]);

    // Create notification
    const notifId = uuidv4();
    dbRun('INSERT INTO notifications (id, user_id, from_user_id, type, reference_id) VALUES (?, ?, ?, ?, ?)',
      [notifId, followingId, followerId, 'follow', followerId]);

    const followerCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [followingId]);

    res.status(201).json({ message: 'Followed successfully', follower_count: followerCount.count });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id/follow
router.delete('/:id/follow', authenticateToken, (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    dbRun('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);

    const followerCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [followingId]);

    res.json({ message: 'Unfollowed successfully', follower_count: followerCount.count });
  } catch (err) {
    console.error('Unfollow error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id/posts
router.get('/:id/posts', (req, res) => {
  try {
    const posts = dbAll(`
      SELECT p.*, u.username, u.display_name, u.avatar_url, u.is_verified,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [req.params.id]);

    res.json({ posts });
  } catch (err) {
    console.error('Get user posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

