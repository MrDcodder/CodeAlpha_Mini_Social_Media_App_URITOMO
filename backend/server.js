const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDatabase, initializeDatabase } = require('./database');

async function startServer() {
  // Initialize DB
  await getDatabase();
  initializeDatabase();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files (if any)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // API Routes
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/users');
  const postRoutes = require('./routes/posts');
  const messageRoutes = require('./routes/messages');
  const notificationRoutes = require('./routes/notifications');
  const searchRoutes = require('./routes/search');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api', searchRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '..', 'frontend')));

  // SPA fallback - serve index.html for all non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Uritomo server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);

