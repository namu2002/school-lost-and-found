document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const error = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Simple admin check (proposal-level security)
        if (email === 'admin@test.com' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
        } else {
            error.textContent = 'Invalid admin credentials';
        }
    });
});
