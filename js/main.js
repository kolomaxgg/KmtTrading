/* ==========  FIREBASE SET-UP  ========== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = { /* PASTE YOUR CONFIG HERE */ };
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
/* ======================================== */

/* ----------  UTILS  ---------- */
function showMessage(msg, type) {               // type = 'success' | 'error'
  const el = document.querySelector(`.${type}-message`);
  if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(()=>el.style.display='none',5000); }
}

/* ----------  REGISTRATION  ---------- */
async function handleRegister(e) {
  e.preventDefault();
  const name            = document.getElementById('regName').value.trim();
  const email           = document.getElementById('regEmail').value.trim();
  const password        = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;

  if (password !== passwordConfirm) { showMessage('Passwords do not match.', 'error'); return; }
  if (password.length < 6) { showMessage('Password must be ≥ 6 characters.', 'error'); return; }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // store extra info
    await setDoc(doc(db, 'users', userCred.user.uid), { name, email, createdAt: new Date() });
    // update displayName so auth.currentUser.displayName works
    await updateProfile(userCred.user, { displayName: name });

    showMessage('Registration successful! Redirecting…', 'success');
    setTimeout(() => location.href = 'login.html', 2000);
  } catch (err) {
    showMessage(err.message, 'error');
  }
}

/* ----------  LOGIN  ---------- */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pwd   = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, pwd);
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

/* ----------  AUTH STATE  ---------- */
onAuthStateChanged(auth, user => {
  const info = document.getElementById('userInfo');
  if (user) {
    const displayName = user.displayName || user.email.split('@')[0]; // fallback to first part of email
    info.innerHTML = `Welcome, ${displayName}! <button id="logoutBtn" class="btn" style="margin-left:8px;padding:4px 12px;font-size:0.85rem;">Logout</button>`;
    info.style.display = 'block';
    document.getElementById('logoutBtn').onclick = handleLogout; // re-attach after DOM insert
  } else {
    info.style.display = 'none';
  }
});

/* ----------  BIND EVENTS  ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
});
