// Uritomo - Shared API Client & Auth Logic

const API_BASE = '/api';

// ============== AUTH ==============
function getToken() {
  return localStorage.getItem('uritomo_token');
}

function getUser() {
  const data = localStorage.getItem('uritomo_user');
  return data ? JSON.parse(data) : null;
}

function setAuth(token, user) {
  localStorage.setItem('uritomo_token', token);
  localStorage.setItem('uritomo_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('uritomo_token');
  localStorage.removeItem('uritomo_user');
}

function isAuthenticated() {
  return !!getToken();
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/auth.html';
    return false;
  }
  return true;
}

function redirectIfAuth() {
  if (isAuthenticated()) {
    window.location.href = '/';
    return true;
  }
  return false;
}

// ============== API CLIENT ==============
async function apiRequest(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

async function apiGet(path) {
  return apiRequest('GET', path);
}

async function apiPost(path, body) {
  return apiRequest('POST', path, body);
}

async function apiPut(path, body) {
  return apiRequest('PUT', path, body);
}

async function apiDelete(path) {
  return apiRequest('DELETE', path);
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

function getProfileCompletionStatus(user) {
  const missing = [];
  if (!user?.display_name) missing.push('display name');
  if (!user?.bio) missing.push('bio');
  if (!user?.avatar_url) missing.push('profile photo');
  return { isComplete: missing.length === 0, missing };
}

// ============== AUTH API ==============
async function login(email, password) {
  const data = await apiPost('/auth/login', { email, password });
  setAuth(data.token, data.user);
  return data;
}

async function register(username, email, password, display_name, profileData = {}) {
  const data = await apiPost('/auth/register', {
    username,
    email,
    password,
    display_name,
    bio: profileData.bio || '',
    location: profileData.location || '',
    website: profileData.website || '',
    avatar_url: profileData.avatar_url || ''
  });
  setAuth(data.token, data.user);
  return data;
}

async function getMe() {
  return apiGet('/auth/me');
}

function logout() {
  clearAuth();
  window.location.href = '/auth.html';
}

// ============== POSTS API ==============
async function getPosts(type = null, page = 1, limit = 10) {
  let path = `/posts?page=${page}&limit=${limit}`;
  if (type) path += `&type=${type}`;
  return apiGet(path);
}

async function getPost(id) {
  return apiGet(`/posts/${id}`);
}

async function createPost(content, type = 'multimedia', media_url = null, tags = null) {
  return apiPost('/posts', { content, type, media_url, tags });
}

async function deletePost(id) {
  return apiDelete(`/posts/${id}`);
}

async function likePost(id) {
  return apiPost(`/posts/${id}/like`);
}

async function unlikePost(id) {
  return apiDelete(`/posts/${id}/like`);
}

async function bookmarkPost(id) {
  return apiPost(`/posts/${id}/bookmark`);
}

async function unbookmarkPost(id) {
  return apiDelete(`/posts/${id}/bookmark`);
}

async function getComments(postId) {
  return apiGet(`/posts/${postId}/comments`);
}

async function createComment(postId, content) {
  return apiPost(`/posts/${postId}/comments`, { content });
}

// ============== USERS API ==============
async function getUserProfile(id) {
  return apiGet(`/users/${id}`);
}

async function updateProfile(id, data) {
  return apiPut(`/users/${id}`, data);
}

async function getUserPosts(id) {
  return apiGet(`/users/${id}/posts`);
}

async function getFollowers(id) {
  return apiGet(`/users/${id}/followers`);
}

async function getFollowing(id) {
  return apiGet(`/users/${id}/following`);
}

async function followUser(id) {
  return apiPost(`/users/${id}/follow`);
}

async function unfollowUser(id) {
  return apiDelete(`/users/${id}/follow`);
}

// ============== MESSAGES API ==============
async function getConversations() {
  return apiGet('/messages');
}

async function getMessages(userId) {
  return apiGet(`/messages/${userId}`);
}

async function sendMessage(userId, content) {
  return apiPost(`/messages/${userId}`, { content });
}

// ============== NOTIFICATIONS API ==============
async function getNotifications() {
  return apiGet('/notifications');
}

async function markAllNotificationsRead() {
  return apiPut('/notifications/read-all');
}

// ============== SEARCH API ==============
async function search(query) {
  return apiGet(`/search?q=${encodeURIComponent(query)}`);
}

async function getTrending() {
  return apiGet('/trending');
}

// ============== UI HELPERS ==============
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl font-label-bold text-label-bold shadow-2xl transition-all duration-500 ${
    type === 'success' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'
  }`;
  toast.style.transform = 'translateY(-100px)';
  toast.style.opacity = '0';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(-100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function formatTime(dateString) {
  const date = new Date(dateString + 'Z');
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

