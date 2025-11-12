/* ==========  FIREBASE SET-UP  ========== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxSI9jGhpYqyd9iws44LJ8y_YAf3nJHb8",
  authDomain: "kmttrading-c1193.firebaseapp.com",
  projectId: "kmttrading-c1193",
  storageBucket: "kmttrading-c1193.firebasestorage.app",
  messagingSenderId: "751962294613",
  appId: "1:751962294613:web:063b3170f78c9b764cc7dc",
  measurementId: "G-KMJXT68DWY"
};

const app       = initializeApp(firebaseConfig);
const auth      = getAuth(app);
const db        = getFirestore(app);
/* ======================================== */

/* ----------  DOM READY  ---------- */
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    const info = document.getElementById('userInfo');
    if (user) {
      if (info) {
        info.innerHTML = `Welcome, ${user.email}! <button id="logoutBtn" class="btn" onclick="handleLogout()">Logout</button>`;
        info.style.display = 'block';
      }
    } else {
      if (info) info.style.display = 'none';
    }
  });

  const regForm  = document.getElementById('registerForm');
  const loginForm= document.getElementById('loginForm');
  if (regForm)  regForm.addEventListener('submit', handleRegister);
  if (loginForm)loginForm.addEventListener('submit', handleLogin);
});

/* ----------  REGISTRATION  ---------- */
async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const name  = document.getElementById('regName').value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      name: name,
      email: email,
      createdAt: new Date()
    });
    showMessage('Registration successful! Redirecting…', 'success');
    setTimeout(() => location.href = 'login.html', 2000);
  } catch (err) {
    showMessage(err.message, 'error');
  }
}

/* ----------  LOGIN  ---------- */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage('Login successful! Redirecting…', 'success');
    setTimeout(() => location.href = 'index.html', 2000);
  } catch (err) {
    showMessage(err.message, 'error');
  }
}

/* ----------  LOGOUT  ---------- */
function handleLogout() {
  signOut(auth).then(() => location.href = 'index.html');
}

/* ----------  UTILS  ---------- */
function showMessage(msg, type) {
  const el = document.querySelector(`.${type}-message`);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
  }
}

function trackTelegramJoin(groupType) {
  console.log(`User joining ${groupType} Telegram group`);
}
