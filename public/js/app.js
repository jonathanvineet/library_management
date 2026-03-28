/* ============================================
   LIBRARY MANAGEMENT SYSTEM — API & UI UTILITIES
   ============================================ */

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = (() => {
    const h = window.location.hostname;
    const p = window.location.port;
    if ((h === '127.0.0.1' || h === 'localhost') && p === '5500') return 'http://localhost:8080/api';
    return '/api';
})();

// ============================================
// AUTH HELPERS
// ============================================
function getAuthCredentials() { return sessionStorage.getItem('authCredentials'); }
function getUserRole() { return sessionStorage.getItem('userRole'); }
function getUsername() { return sessionStorage.getItem('username'); }
function getFullName() { return sessionStorage.getItem('fullName') || getUsername(); }
function getUserId() { return sessionStorage.getItem('userId'); }
function getUserEmail() { return sessionStorage.getItem('email'); }
function isLibrarian() { return getUserRole() === 'LIBRARIAN'; }
function isMember() { return getUserRole() === 'MEMBER'; }

function checkAuth() {
    if (!getAuthCredentials()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

function logout() {
    sessionStorage.clear();
    window.location.href = '/login.html';
}

// ============================================
// API FETCH WRAPPER
// ============================================
async function fetchAPI(endpoint, options = {}) {
    let url = (endpoint || '').trim();
    if (!url.startsWith('/')) url = '/' + url;
    if (url === '/api') url = '';
    else if (url.startsWith('/api/')) url = url.substring(4);

    const credentials = getAuthCredentials();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (credentials) headers['Authorization'] = 'Basic ' + credentials;

    const response = await fetch(`${API_BASE_URL}${url}`, { headers, ...options });

    if (response.status === 401 || response.status === 403) {
        showNotification('Session expired. Redirecting to login...', 'error');
        setTimeout(logout, 1500);
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || err.message || 'Request failed');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'success') {
    const icon = type === 'success' ? '✓' : '✕';
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<span style="font-weight:700;font-size:1rem;">${icon}</span> ${message}`;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.animation = 'notifOut 0.3s ease forwards';
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

// ============================================
// DATE FORMATTING
// ============================================
function formatDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysFromNow(dateString) {
    if (!dateString) return 0;
    const diff = new Date(dateString) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ============================================
// MODAL HELPERS
// ============================================
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// ANIMATED COUNTER
// ============================================
function animateCounter(el, target, duration = 600) {
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    if (diff === 0) { el.textContent = target; return; }
    const startTime = performance.now();
    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + diff * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ============================================
// SIDEBAR / NAV SETUP
// ============================================
function buildSidebar(activePage) {
    const role = getUserRole();
    const name = getFullName();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const navItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard', href: 'index.html', roles: ['LIBRARIAN', 'MEMBER'] },
        { id: 'books', icon: '📚', label: 'Books', href: 'books.html', roles: ['LIBRARIAN', 'MEMBER'] },
        { id: 'members', icon: '👥', label: 'Members', href: 'members.html', roles: ['LIBRARIAN'] },
        { id: 'transactions', icon: '📋', label: 'Transactions', href: 'transactions.html', roles: ['LIBRARIAN', 'MEMBER'] },
    ];

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <div class="brand-icon">📖</div>
            <div class="brand-text">LibraryHub</div>
        </div>
        <nav class="sidebar-nav">
            ${navItems.filter(n => n.roles.includes(role)).map(n => `
                <a href="${n.href}" class="nav-item ${n.id === activePage ? 'active' : ''}">
                    <span class="nav-icon">${n.icon}</span>
                    <span class="nav-text">${n.label}</span>
                </a>
            `).join('')}
        </nav>
        <div class="sidebar-footer">
            <div class="user-card" onclick="logout()" title="Click to logout">
                <div class="user-avatar">${initials}</div>
                <div class="user-meta">
                    <div class="user-name">${name}</div>
                    <div class="user-role">${role}</div>
                </div>
            </div>
        </div>
    `;
}

// Mobile menu
function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== btn) {
            sidebar.classList.remove('open');
        }
    });
}

// ============================================
// BOOK COVER IMAGES (Unsplash)
// ============================================
const BOOK_COVERS = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop',
];

function getBookCover(book) {
    if (book.coverImageUrl) return book.coverImageUrl;
    // Deterministic based on title hash
    let hash = 0;
    const s = book.title || '';
    for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i);
    return BOOK_COVERS[Math.abs(hash) % BOOK_COVERS.length];
}

// ============================================
// STATUS HELPERS
// ============================================
function getStatusBadge(status) {
    const map = {
        'BORROWED': 'info',
        'RETURNED': 'success',
        'OVERDUE': 'danger',
        'LOST': 'danger',
        'ACTIVE': 'success',
        'INACTIVE': 'warning',
        'SUSPENDED': 'danger',
        'PENDING': 'warning',
        'APPROVED': 'success',
        'REJECTED': 'danger',
    };
    return map[status] || 'primary';
}
