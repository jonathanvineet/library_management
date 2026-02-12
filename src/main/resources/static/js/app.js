// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Utility Functions
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || error.message || 'Request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-gradient)' : 'var(--secondary-gradient)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--glass-shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Book Management Functions
async function loadBooks(searchKeyword = '') {
    try {
        const endpoint = searchKeyword 
            ? `/books/search?keyword=${encodeURIComponent(searchKeyword)}`
            : '/books';
        return await fetchAPI(endpoint);
    } catch (error) {
        showNotification('Failed to load books', 'error');
        return [];
    }
}

async function createBook(bookData) {
    try {
        const book = await fetchAPI('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
        showNotification('Book added successfully!');
        return book;
    } catch (error) {
        showNotification('Failed to add book: ' + error.message, 'error');
        throw error;
    }
}

async function updateBook(id, bookData) {
    try {
        const book = await fetchAPI(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
        showNotification('Book updated successfully!');
        return book;
    } catch (error) {
        showNotification('Failed to update book: ' + error.message, 'error');
        throw error;
    }
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        await fetchAPI(`/books/${id}`, { method: 'DELETE' });
        showNotification('Book deleted successfully!');
        return true;
    } catch (error) {
        showNotification('Failed to delete book: ' + error.message, 'error');
        return false;
    }
}

// Member Management Functions
async function loadMembers(searchName = '') {
    try {
        const endpoint = searchName 
            ? `/members/search?name=${encodeURIComponent(searchName)}`
            : '/members';
        return await fetchAPI(endpoint);
    } catch (error) {
        showNotification('Failed to load members', 'error');
        return [];
    }
}

async function createMember(memberData) {
    try {
        const member = await fetchAPI('/members', {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
        showNotification('Member registered successfully!');
        return member;
    } catch (error) {
        showNotification('Failed to register member: ' + error.message, 'error');
        throw error;
    }
}

async function updateMember(id, memberData) {
    try {
        const member = await fetchAPI(`/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memberData)
        });
        showNotification('Member updated successfully!');
        return member;
    } catch (error) {
        showNotification('Failed to update member: ' + error.message, 'error');
        throw error;
    }
}

async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) {
        return;
    }

    try {
        await fetchAPI(`/members/${id}`, { method: 'DELETE' });
        showNotification('Member deleted successfully!');
        return true;
    } catch (error) {
        showNotification('Failed to delete member: ' + error.message, 'error');
        return false;
    }
}

// Transaction Management Functions
async function borrowBook(bookId, memberId, loanDays = 14) {
    try {
        const transaction = await fetchAPI('/transactions/borrow', {
            method: 'POST',
            body: JSON.stringify({ bookId, memberId, loanDays })
        });
        showNotification('Book borrowed successfully!');
        return transaction;
    } catch (error) {
        showNotification('Failed to borrow book: ' + error.message, 'error');
        throw error;
    }
}

async function returnBook(transactionId) {
    try {
        const transaction = await fetchAPI(`/transactions/return/${transactionId}`, {
            method: 'POST'
        });
        
        if (transaction.fineAmount && transaction.fineAmount > 0) {
            showNotification(`Book returned. Fine: $${transaction.fineAmount}`, 'error');
        } else {
            showNotification('Book returned successfully!');
        }
        
        return transaction;
    } catch (error) {
        showNotification('Failed to return book: ' + error.message, 'error');
        throw error;
    }
}

async function loadTransactions() {
    try {
        return await fetchAPI('/transactions');
    } catch (error) {
        showNotification('Failed to load transactions', 'error');
        return [];
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--accent-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--glass-border)';
        }
    });

    return isValid;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
