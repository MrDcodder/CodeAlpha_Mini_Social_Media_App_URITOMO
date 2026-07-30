const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDatabase, initializeDatabase, dbGet, dbAll, dbRun, saveDatabase } = require('./database');

async function seed() {
  // Initialize database
  await getDatabase();
  initializeDatabase();

  console.log('Seeding database...');

  // Clear existing data
  dbRun('DELETE FROM notifications');
  dbRun('DELETE FROM messages');
  dbRun('DELETE FROM bookmarks');
  dbRun('DELETE FROM likes');
  dbRun('DELETE FROM comments');
  dbRun('DELETE FROM followers');
  dbRun('DELETE FROM posts');
  dbRun('DELETE FROM trending_topics');
  dbRun('DELETE FROM users');

  // Create users - 1 admin + 5 user profiles
  const users = [
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@uritomo.io',
      password_hash: bcrypt.hashSync('admin123', 10),
      display_name: 'Uritomo Admin',
      bio: 'Administrator of Uritomo. Welcome to the grid.',
      avatar_url: '',
      location: 'Neo-Tokyo',
      is_verified: 1,
      is_pro: 1
    },
    {
      id: uuidv4(),
      username: 'alex_chen',
      email: 'alex@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Alex Chen',
      bio: 'Digital artist & photographer. Capturing neon dreams.',
      avatar_url: '',
      location: 'Shibuya, Tokyo',
      is_verified: 1
    },
    {
      id: uuidv4(),
      username: 'maya_ross',
      email: 'maya@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Maya Ross',
      bio: 'Writer & storyteller. Exploring the space between code and consciousness.',
      avatar_url: '',
      location: 'Neo Berlin'
    },
    {
      id: uuidv4(),
      username: 'kai_nakamura',
      email: 'kai@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Kai Nakamura',
      bio: 'UI/UX designer. Obsessed with pixel-perfect dark interfaces.',
      avatar_url: '',
      location: 'Osaka'
    },
    {
      id: uuidv4(),
      username: 'elena_voss',
      email: 'elena@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Elena Voss',
      bio: 'Musician & sound designer. Creating sonic landscapes for the digital age.',
      avatar_url: '',
      location: 'London'
    },
    {
      id: uuidv4(),
      username: 'marcus_wei',
      email: 'marcus@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Marcus Wei',
      bio: 'Full-stack developer. Building the future one commit at a time.',
      avatar_url: '',
      location: 'San Francisco'
    }
  ];

  for (const u of users) {
    dbRun(
      'INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(?), ?, ?)',
      [u.id, u.username, u.email, u.password_hash, u.display_name, u.bio || null, u.avatar_url, u.location || null, u.website || null, `-${Math.floor(Math.random() * 365)} days`, u.is_verified || 0, u.is_pro || 0]
    );
  }
  console.log(`Created ${users.length} users`);

  // Create trending topics
  const trendingTopics = [
    { name: '#NeuralLink2', category: 'Technology', count: 45200 },
    { name: 'NeoTokyo Elections', category: 'Politics', count: 12800 },
    { name: 'Glassmorphism2025', category: 'Design', count: 8100 },
    { name: 'Noir Night Live', category: 'Entertainment', count: 32400 },
    { name: '#ObsidianUI', category: 'Design', count: 23100 },
    { name: '#Cyberpunk2077', category: 'Gaming', count: 56700 },
    { name: 'TechnoNoir', category: 'Art', count: 18900 },
    { name: '#DigitalFashion', category: 'Fashion', count: 14300 },
    { name: 'AI Art Debate', category: 'Technology', count: 28900 },
    { name: '#NeonNights', category: 'Photography', count: 41200 }
  ];

  for (const t of trendingTopics) {
    dbRun(
      'INSERT INTO trending_topics (id, name, category, post_count) VALUES (?, ?, ?, ?)',
      [uuidv4(), t.name, t.category, t.count]
    );
  }
  console.log('Created trending topics');

  saveDatabase();

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📝 Test accounts:');
  console.log('  Email: admin@uritomo.io   | Password: admin123  (Admin)');
  console.log('  Email: alex@uritomo.io     | Password: password123');
  console.log('  Email: maya@uritomo.io     | Password: password123');
  console.log('  Email: kai@uritomo.io      | Password: password123');
  console.log('  Email: elena@uritomo.io    | Password: password123');
  console.log('  Email: marcus@uritomo.io   | Password: password123');
  console.log('\nNo posts seeded. You can create posts manually.');
}

seed().catch(console.error);
