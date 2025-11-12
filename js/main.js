// KMT Trading - Main JavaScript

// Firebase Config - TODO: Replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  checkAuthState();

  // Forms
  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
});

// Authentication
function checkAuthState() {
  const loggedInUser = localStorage.getItem('kmtUser');
  const userInfo = document.getElementById('userInfo');
  const loginLink = document.getElementById('loginLink');
  
  if (loggedInUser) {
    if (userInfo) {
      userInfo.innerHTML = `Welcome, ${loggedInUser}! <button id="logoutBtn" class="btn" onclick="handleLogout()">Logout</button>`;
      userInfo.style.display = 'block';
    }
    if (loginLink) loginLink.style.display = 'none';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  localStorage.setItem('kmtUser', email);
  showMessage('Registration successful! (Demo mode)', 'success');
  setTimeout(() => window.location.href = 'login.html', 2000);
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  localStorage.setItem('kmtUser', email);
  showMessage('Login successful! (Demo mode)', 'success');
  setTimeout(() => window.location.href = 'index.html', 2000);
}

function handleLogout() {
  localStorage.removeItem('kmtUser');
  window.location.href = 'index.html';
}

function showMessage(message, type) {
  const messageEl = document.querySelector(`.${type}-message`);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    setTimeout(() => messageEl.style.display = 'none', 5000);
  }
}

function trackTelegramJoin(groupType) {
  console.log(`User joining ${groupType} Telegram group`);
}