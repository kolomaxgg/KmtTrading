// KMT Trading - Authentication System

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update navigation for all pages
    updateNavigation(currentUser);
    
    // Show registration success message if coming from register.html
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showMessage('successMessage', 'Account created successfully! Please log in.');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Show login success message on index.html
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (currentUser && currentUser.name) {
            showMessage('successMessage', `Welcome back, ${currentUser.name}!`);
        }
    }
});

// Update navigation bar based on login status
function updateNavigation(currentUser) {
    const navLinks = document.querySelector('.nav-links');
    const loginLink = navLinks.querySelector('li a[href="login.html"]')?.parentElement;
    
    if (currentUser && currentUser.name) {
        // User is logged in
        if (loginLink) {
            loginLink.style.display = 'none'; // Hide Login button
        }
        
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `
                <span style="color: #2a9d8f; font-weight: bold; margin-right: 15px;">
                    Hello, ${escapeHtml(currentUser.name)}!
                </span>
                <button id="logoutBtn" class="btn-logout" onclick="logout()">Logout</button>
            `;
        }
    } else {
        // User is not logged in
        if (loginLink) {
            loginLink.style.display = 'block'; // Show Login button
        }
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }
}

// Registration Handler
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regPasswordConfirm').value;
        
        // Reset messages
        hideMessage('successMessage');
        hideMessage('errorMessage');
        
        // Validation
        if (!name || !email || !password) {
            showMessage('errorMessage', 'Please fill all fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('errorMessage', 'Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            showMessage('errorMessage', 'Password must be at least 6 characters.');
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
            showMessage('errorMessage', 'An account with this email already exists!');
            return;
        }
        
        // Create new user (DO NOT log them in automatically)
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password // In production, hash this!
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Redirect to login page with success flag
        window.location.href = 'login.html?registered=true';
    });
}

// Login Handler
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Reset messages
        hideMessage('successMessage');
        hideMessage('errorMessage');
        
        // Find user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            }));
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            showMessage('errorMessage', 'Invalid email or password!');
        }
    });
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Utility Functions
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            hideMessage(elementId);
        }, 5000); // Auto-hide after 5 seconds
    }
}

function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
