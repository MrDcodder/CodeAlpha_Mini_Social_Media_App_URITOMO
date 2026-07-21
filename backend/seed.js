const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDatabase, initializeDatabase, dbGet, dbAll, dbRun, saveDatabase } = require('./database');

async function seed() {
  // Initialize database
  await getDatabase();
  initializeDatabase();

  const db = require('./database');
  
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

  // Create users
  const users = [
    {
      id: uuidv4(),
      username: 'cyber_junkie',
      email: 'cyber@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'CYBER_JUNKIE',
      bio: 'Rainy nights in the grid. The neon pulse never stops. #technonoir #cyberpunk #neon',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jNGvfj7jDC7ss0tbK1sVYXGKmiffP6UQPsAL6sDC11CH0e2a7D1TemFIEYNYHFcX8QFaj4qdX5TSx9P1fhFSSlJSfcbhpGs_X4Wk4qx94OYXxn06hihcLAlHnq4bcZ_IQUr7pKyMTyFt5-qSd8PNec7hm96OzMV_VXe74w1FjOIbat8CwSodF_wfFc05hIDNmSg2odF6s8moMlXZRsOteq3PTykUol4y4dNL8pxfqBUQJJMIfNqC',
      location: 'Shibuya, Tokyo',
      is_verified: 1,
      is_pro: 1
    },
    {
      id: uuidv4(),
      username: 'luna_designs',
      email: 'luna@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Luna Designs',
      bio: 'Architecture for the year 2099. Structured chaos in obsidian. #future #design',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjWGhTUhwcCGJFgKVIKNMdtqXvgqRJmKtcK7F-uqrIvL_DYxKwaj23W_bDpKuM7cKWUWoV_bLFFTgLl8NRiE0xUDuCOjZFHNBt-e4CTV_yM8V05KwXl_MNvY8oKowRJET4NnU6dpXfKKkI9O84czvx9y8ylLTF9wveQimuz4L36Uwbj-By0CrH8m4Gx21nyNobxRMnkm0VSUQZlqlS9DVDVNUtCcS6HXsibEPaZU-1Lvb89ogr95df',
      location: 'Neo Berlin',
      is_verified: 1
    },
    {
      id: uuidv4(),
      username: 'archivist_x',
      email: 'archivist@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Archivist_X',
      bio: 'Pushing the boundaries of techno-noir aesthetics through code and cinema. Curator of the Late Night Feed.',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBerR5g4k1H0VqonXjXP0gM4P36wzREXTI-YrS2T_BensYgaVckZQMIAvhX39LhkTIlUidS6ddbLtMjanufoDHp4eC5Qe8h3ZJLoD7gKVOtlfFhkFYnDJMhZSi2Haw_zyTpodMw-XsrJyfkwbX5moJzDTsr_pXS8gktp5WWtWvq1Iw9gQ7W6n7kkwIWgXX0QHRdlkaNXXOaPx9HgVq16bGZGwtIQr45DdfsQqBW810yyLPW9SBOD0Jr',
      is_verified: 1,
      is_pro: 1
    },
    {
      id: uuidv4(),
      username: 'nexus_insight',
      email: 'nexus@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Nexus_Insight',
      bio: 'Why does the eye crave the dark? The science behind our obsession with deep interfaces.',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJOy5pZyal1oDbK1P6xZKv66zPsfj7WtM4-8GKgYN5kS5--YIwrmQrdmFHJMgPpnhizCXhcOjlw_E73VWCrAI8pnacwzD9Ho8OaOzFPfUFsHb89ZvlCTkoC8C4pnkTCJ2g3rSC3Azvq315Wp3N360HEhOPYggdGCP0640omZIBOsNVwpIsM9p5tv71dGfIE3yNioUKziARBc-0mlsvYMuvpsCcE-FsAqScfMb4hsRhAjcvV172nHv7'
    },
    {
      id: uuidv4(),
      username: 'vance_noir',
      email: 'vance@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Alex "Obsidian" Vance',
      bio: 'Pushing the boundaries of techno-noir aesthetics through code and cinema. Curator of the Late Night Feed. We build in the dark to see the light clearly. #DigitalAvantGarde #NoirSystems',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDFDEkt_usYTJ6c80DLbzn1noSHZMe7-SJlw6DAXqHeAHnDuuu0cv5sGnDCbA0DDULstlKDky1uGY34-NMrsDveMT1yhzYUdckDu87n7dO4MPbInzKDYOpVVyQfllkrJ2Yu6iPwN1Ulncf7XthdnAbQhl__ACk-CPTDCQEVQhCvLvw7J_SwtgTGU82U7e09DRtQfCuBpES7kmlUHiq1uEvBc8CqDVbXkl9AwRIrNEH84gfm5rWHSGB',
      location: 'Neo-Tokyo / Berlin',
      website: 'https://noir.vance.io',
      is_verified: 1,
      is_pro: 1
    },
    {
      id: uuidv4(),
      username: 'evelyn_vora',
      email: 'evelyn@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Evelyn Vora',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgcs_DMDxDvtksCaw2UKdkYvID9hssIB0J3dzEjhtWrP3y2ZSr76lDF4iRSawLWlupXOE3cyhPxWuN-AuhH6lEfPhaCuDtbc-hLROVkcezVHIj_LZcyHV1MGw2_iK-DUr5DStDNAwUFmles5CBYn492_aCXhZlLWg1fmFVaqX0SDrhDv1jGJ4tOvG3kwwWhTndNBoPB8nSUkVgipPNiB3e9ooD2Sha9srkQAgkauVQfiUdwpszOR6y',
      is_pro: 1
    },
    {
      id: uuidv4(),
      username: 'marcus_chen',
      email: 'marcus@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Marcus Chen',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOsC-dn5Ki5LB00dJ26uYKZ2Fd4zBGrwRA9vdSZRQjefCkn0o4RaqtujbCc6DAGcrZg7Ns1L2BuaDLPojWPkk4vbsBhPwQA_KfazpFR2SPl3xXd2BqHTvtMPG2W9qIC9bypFS0Pbd0sB6HV38aOLzWt8Y8bQuuebf4I6boZVGDussvD3_btBWnQAZ3OLhddH7S_5QQ5_oBTrAudNzQ72eOBgpnahywUPNlruG_OUfkf9eqwA8pvwIU'
    },
    {
      id: uuidv4(),
      username: 'sora_digital',
      email: 'sora@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Sora Digital',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtFYjXbxJfLkj8qWqCM55a4riwBmgizbPtBhxR0iUR_wm-gbDTj1DNvgLxCfxR3lndpneGXMXfaVDekIewR_QPhiW_dUOA1yt79eRYxCKiDGxwanO8RG2lcfSwYEpKpUTRhXgQKd_70leVT0BR47FoKGDwrQKcBN3R8nQH-hT575VjRAgRzidGPRVV5JmHL4E6l2AMTzAMDGqnWjsubtwTVzPbhWDjbx1q_CLqxuiePYlir0lrD7La'
    },
    {
      id: uuidv4(),
      username: 'elena_rossi',
      email: 'elena@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'Elena Rossi',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn-jjIAOXYoFh42xfLotli8lWcZnIZFeVguxUXgIHYQZWcW78bi4_gqLNkqCpviyM5djurEmdWuGVjjS8k5wZ-CWFMU8wMJz4xAzdATGhfTerdOhA0Gpj8Q9C4up5SDBAbcHmVuitV7C7oRoxItPwlAEbK74DbstLc1ttu1jWZ6SGEeZiyiiqcI2BEDdfB1vijd547YHYXqlRRoYc4Z8oS8Y15zdX5Vj0_XT7zHjTC5b1StD359K2V'
    },
    {
      id: uuidv4(),
      username: 'neon_architect',
      email: 'neon@uritomo.io',
      password_hash: bcrypt.hashSync('password123', 10),
      display_name: 'NeonArchitect',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg-GPUhvBl4bxBzao48XGahpnxJkRuv5zlG_BYxu_erHRegGihI2ttwQj_HVbdSKEzAmzfL8veyDocA95QCSE1H1Hd78QkgAAOLasp5hcOVkQW8xKiCcMvvKXlAhuKqJ3bX_JiPlxeFuuiPtXFCPgkutrmcpAOyMfLfLLgkoNR3k3Xi1gCXxz4uDR3H2MY-LajZYvRxtaaZIc46qC_74xg_3DqyCFdP0tEUjFceaJaaX_pAkDOdYve'
    }
  ];

  for (const u of users) {
    dbRun(
      'INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, location, website, joined_date, is_verified, is_pro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(?), ?, ?)',
      [u.id, u.username, u.email, u.password_hash, u.display_name, u.bio || null, u.avatar_url, u.location || null, u.website || null, `-${Math.floor(Math.random() * 365)} days`, u.is_verified || 0, u.is_pro || 0]
    );
  }
  console.log(`Created ${users.length} users`);

  // Create posts
  const posts = [
    { user: users[0], content: 'Rainy nights in the grid. The neon pulse never stops. #technonoir #cyberpunk #neon', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOY0GpKAqHyEFvcXPolnbH49hwe-fcwUvYMa4vbeUt32TjSgdmUW_BlC7dk-GSuT-a9JY2BG5vxnOw3LUW6acI3w8iSLaFjNl4XxpwsoF6IoueFOQpUsJj2OzqkhjgMUqIzulbFVqrjfZ5mABr8Qek6uoMTLAsH9Xe1LZLGKGO_6MT-TJj-OiHveZwUa3f5e3cWX9V1lvNTrIqjBWVPY4teqqIZUCRUJcvP3SXDwYad0r3kWNO_hrf' },
    { user: users[1], content: 'Architecture for the year 2099. Structured chaos in obsidian. #future #design', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtIP2Z9c9MxkmaszMpIyuWiKgO1-jKytWzgiYa0Y-W1KvGhP-uUldM_Jr7IdHx1WM_7GPv_de5Re_eoSuKoKZy1qRmdtyGMOWWQUVfWPI3kJZ7F_s-b1GulNu9fsjb7KslIhk3mENSbW2E0VXXJFmw8yTNDyFfzd2DRKBZpuLhha399aJKwFRIRVmulgQqVRAAJj8Vfa5aKq7XkRYZ6k_MiOCzxPFR07RqHP-SUFlIRHzDLoLew2yR' },
    { user: users[2], content: 'In the age of hyper-connectivity, the space between the data and the user has vanished. We no longer observe the machine; we inhabit it. The obsidian interface is not a barrier—it is a reflection of our collective late-night consciousness...', type: 'literature' },
    { user: users[3], content: 'Why does the eye crave the dark? The science behind our obsession with deep interfaces and vibrant accents reveals more about our cognitive load than we think. Explore the psychology of techno-noir...', type: 'literature' },
    { user: users[4], content: 'The new motion design assets for the NOIR project are ready. High-contrast obsidian palette integrated.', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEUpLfnpmt5pTAkI0sGm_ImIQjiNxspPIo03TLzdFlHx0FWFPXNEGTk7IMzmoAI9ZxI3ApOvsPRPgR9u_iclRY7ZTQQP_P5R8BmTcZy3QzWluukz4XaeBhpsXhrIoiUmWuAzuD2WJ0vnre3r-10XlTTcyMzvSDIM7iK0zGNcpubasQShT89ynkV-2EK1YfSorKlGiv_P8eSNKz580uor1IuMGI4yOqovn8j_C3GGwUSjGLDqEgLxtY' },
    { user: users[4], content: 'Minimalist brutalist architecture at twilight. Single violet window.', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8ihrxrmbNSQM2xRDup63xWNF95sYs7f8OU7411ftQNljDbbNBwUpVLikPPA-MoI1c3iTdfbUl8RHgWQxpyzb2bJ7q4ctBU-99wvyvGhauAlSrv7svxAGUrCKbER06eCLw125oTUuemktBmdk09W6aSGV6HL-dXQjVYSmftN9B1tf0cYde4i5mHOxtSKiFi8ScmKz4oOGPAbrjTRbk_pcAAVKH_9qxig4DGPK2voE2Mf40KKQPP2dA' },
    { user: users[4], content: 'Macro shot of a high-tech circuit board with light flowing through like liquid neon.', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg-GPUhvBl4bxBzao48XGahpnxJkRuv5zlG_BYxu_erHRegGihI2ttwQj_HVbdSKEzAmzfL8veyDocA95QCSE1H1Hd78QkgAAOLasp5hcOVkQW8xKiCcMvvKXlAhuKqJ3bX_JiPlxeFuuiPtXFCPgkutrmcpAOyMfLfLLgkoNR3k3Xi1gCXxz4uDR3H2MY-LajZYvRxtaaZIc46qC_74xg_3DqyCFdP0tEUjFceaJaaX_pAkDOdYve' },
    { user: users[5], content: 'The layout looks incredible. Can we push the glassmorphism blur intensity?', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYC9TXYOSyNvWhODBQU25PRslQkObz8kwXsnnvkKN6uGvoGXoGlNgzDTeurUjuQUrsHg8YTj0_QNdUH8tZ0L4dgCWGG58ifJu08qbdO__y18r8TW14CuX63oICuHqBm6n9Jiaxs9Wro4C1fbkjIuJ-rvnn94cWWtzBIKxK0_Ieb0Q0-hghde2x12iFk3GCjcHS4gnFxGvkRRb-ExS-2ES9QQJlDNjm1ZIqZcChVCDrIHjKjUKT9RN3' },
    { user: users[6], content: 'Dark silhouette before a massive digital screen displaying glitch art in purple and white.', type: 'multimedia', media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALat6ks195xuJmsRqOL1J2DGpcDK4shimJJ88P-UGsqdkTgeEFHcwfr5jPst-_RglSUBUu0tlNAsFEscOf6C_uoRnhsp5HzhMd2doxqEgspmotseP2KJaimoZmYv3AdT5xgXJLrjIJWoc87_oORIIMc6KgFsd-9UPTqYtLG2pQmLAC1w23WaUcNLfCqyZEl717z4A2kFOFmN6HvWR4H3yaRdGz0en-M17DUuwd7tuBFPpvgBZSBQ5s' }
  ];

  const postIds = [];
  for (const p of posts) {
    const id = uuidv4();
    postIds.push(id);
    dbRun(
      'INSERT INTO posts (id, user_id, content, type, media_url, created_at) VALUES (?, ?, ?, ?, ?, datetime(?))',
      [id, p.user.id, p.content, p.type, p.media_url || null, `-${Math.floor(Math.random() * 72)} hours`]
    );
  }
  console.log(`Created ${posts.length} posts`);

  // Create likes
  for (let i = 0; i < postIds.length; i++) {
    const likeCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < likeCount; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      dbRun(
        'INSERT OR IGNORE INTO likes (id, user_id, post_id, created_at) VALUES (?, ?, ?, datetime(?))',
        [uuidv4(), randomUser.id, postIds[i], `-${Math.floor(Math.random() * 48)} hours`]
      );
    }
  }
  console.log('Created likes');

  // Create followers
  for (const user of users) {
    const followCount = Math.floor(Math.random() * 5) + 1;
    const shuffled = users.filter(u => u.id !== user.id).sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(followCount, shuffled.length); i++) {
      dbRun(
        'INSERT OR IGNORE INTO followers (id, follower_id, following_id, created_at) VALUES (?, ?, ?, datetime(?))',
        [uuidv4(), user.id, shuffled[i].id, `-${Math.floor(Math.random() * 168)} hours`]
      );
    }
  }
  console.log('Created followers');

  // Create comments
  const commentTexts = ['Stunning work! 🔥', 'Love the aesthetic!', 'This is incredible.', 'Obsidian vibes are unmatched.', 'Need this as wallpaper.', 'Pure art. ❤️', 'The glow effect is perfect.'];
  for (let i = 0; i < postIds.length; i++) {
    const commentCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < commentCount; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      dbRun(
        'INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, datetime(?))',
        [uuidv4(), postIds[i], randomUser.id, commentTexts[Math.floor(Math.random() * commentTexts.length)], `-${Math.floor(Math.random() * 24)} hours`]
      );
    }
  }
  console.log('Created comments');

  // Create messages
  const messageData = [
    { from: users[5], to: users[4], content: 'The new motion design assets for the NOIR project are ready for review. I\'ve integrated the high-contrast obsidian palette you suggested.', read: true },
    { from: users[4], to: users[5], content: 'Incredible. Can you send a preview of the main interface animation? I want to check the glassmorphism blur intensity.', read: true },
    { from: users[5], to: users[4], content: 'Here is the primary layout sample.', read: true },
    { from: users[6], to: users[4], content: 'The layout looks incredible...', read: true },
    { from: users[7], to: users[2], content: 'Did you see the latest drop?', read: true },
  ];

  for (const m of messageData) {
    dbRun(
      'INSERT INTO messages (id, sender_id, receiver_id, content, is_read, created_at) VALUES (?, ?, ?, ?, ?, datetime(?))',
      [uuidv4(), m.from.id, m.to.id, m.content, m.read ? 1 : 0, `-${Math.floor(Math.random() * 12)} hours`]
    );
  }
  console.log('Created messages');

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
  console.log('  Email: cyber@uritomo.io    | Password: password123');
  console.log('  Email: luna@uritomo.io     | Password: password123');
  console.log('  Email: vance@uritomo.io    | Password: password123');
  console.log('  Email: archivist@uritomo.io | Password: password123');
}

seed().catch(console.error);

