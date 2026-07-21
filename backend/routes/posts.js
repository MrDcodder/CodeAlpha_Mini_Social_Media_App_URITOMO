const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbGet, dbAll, dbRun } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - Get feed posts
router.get('/', (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT p.*, u.username, u.display_name, u.avatar_url, u.is_verified,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
    `;

    const params = [];

    if (type && (type === 'multimedia' || type === 'literature')) {
      query += ' WHERE p.type = ?';
      params.push(type);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const posts = dbAll(query, params);

    // If user is authenticated, check which posts they liked/bookmarked
    if (req.user) {
      const userLikes = dbAll('SELECT post_id FROM likes WHERE user_id = ?', [req.user.id]);
      const likedPostIds = new Set(userLikes.map(l => l.post_id));
      const userBookmarks = dbAll('SELECT post_id FROM bookmarks WHERE user_id = ?', [req.user.id]);
      const bookmarkedPostIds = new Set(userBookmarks.map(b => b.post_id));

      posts.forEach(post => {
        post.is_liked = likedPostIds.has(post.id);
        post.is_bookmarked = bookmarkedPostIds.has(post.id);
      });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM posts';
    const countParams = [];
    if (type && (type === 'multimedia' || type === 'literature')) {
      countQuery += ' WHERE type = ?';
      countParams.push(type);
    }
    const total = dbGet(countQuery, countParams);

    res.json({ posts, total: total.total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  try {
    const post = dbGet(`
      SELECT p.*, u.username, u.display_name, u.avatar_url, u.is_verified,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get comments
    const comments = dbAll(`
      SELECT c.*, u.username, u.display_name, u.avatar_url, u.is_verified
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [req.params.id]);

    res.json({ post, comments });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts - Create a post
router.post('/', authenticateToken, (req, res) => {
  try {
    const { content, type, media_url, tags } = req.body;

    if (!content && !media_url) {
      return res.status(400).json({ error: 'Content or media URL is required' });
    }

    const id = uuidv4();
    const postType = type || 'multimedia';
    const tagStr = tags ? (Array.isArray(tags) ? tags.join(',') : tags) : null;

    dbRun(
      'INSERT INTO posts (id, user_id, content, type, media_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.user.id, content, postType, media_url, tagStr]
    );

    const post = dbGet(`
      SELECT p.*, u.username, u.display_name, u.avatar_url, u.is_verified,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `, [id]);

    res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const post = dbGet('SELECT * FROM posts WHERE id = ?', [req.params.id]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    dbRun('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const post = dbGet('SELECT id, user_id FROM posts WHERE id = ?', [req.params.id]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existing = dbGet('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);
    if (existing) {
      return res.status(409).json({ error: 'Already liked this post' });
    }

    const id = uuidv4();
    dbRun('INSERT INTO likes (id, user_id, post_id) VALUES (?, ?, ?)', [id, req.user.id, req.params.id]);

    // Create notification for post owner
    if (post.user_id !== req.user.id) {
      const notifId = uuidv4();
      dbRun('INSERT INTO notifications (id, user_id, from_user_id, type, reference_id) VALUES (?, ?, ?, ?, ?)',
        [notifId, post.user_id, req.user.id, 'like', req.params.id]);
    }

    const likeCount = dbGet('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [req.params.id]);

    res.status(201).json({ message: 'Post liked', like_count: likeCount.count });
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id/like
router.delete('/:id/like', authenticateToken, (req, res) => {
  try {
    dbRun('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);

    const likeCount = dbGet('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [req.params.id]);
    res.json({ message: 'Like removed', like_count: likeCount.count });
  } catch (err) {
    console.error('Unlike post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/bookmark
router.post('/:id/bookmark', authenticateToken, (req, res) => {
  try {
    const existing = dbGet('SELECT id FROM bookmarks WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);
    if (existing) {
      return res.status(409).json({ error: 'Already bookmarked' });
    }

    const id = uuidv4();
    dbRun('INSERT INTO bookmarks (id, user_id, post_id) VALUES (?, ?, ?)', [id, req.user.id, req.params.id]);
    res.status(201).json({ message: 'Post bookmarked' });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id/bookmark
router.delete('/:id/bookmark', authenticateToken, (req, res) => {
  try {
    dbRun('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error('Remove bookmark error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  try {
    const comments = dbAll(`
      SELECT c.*, u.username, u.display_name, u.avatar_url, u.is_verified
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [req.params.id]);

    res.json({ comments });
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/comments
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = dbGet('SELECT id, user_id FROM posts WHERE id = ?', [req.params.id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const id = uuidv4();
    dbRun('INSERT INTO comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)',
      [id, req.params.id, req.user.id, content]);

    // Create notification
    if (post.user_id !== req.user.id) {
      const notifId = uuidv4();
      dbRun('INSERT INTO notifications (id, user_id, from_user_id, type, reference_id) VALUES (?, ?, ?, ?, ?)',
        [notifId, post.user_id, req.user.id, 'comment', req.params.id]);
    }

    const comment = dbGet(`
      SELECT c.*, u.username, u.display_name, u.avatar_url, u.is_verified
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `, [id]);

    res.status(201).json({ comment });
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

