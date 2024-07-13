document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleSignup = document.getElementById('toggle-signup');
    const toggleLogin = document.getElementById('toggle-login');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (response.status === 200) {
                    window.location.href = '/recipe';
                } else {
                    const message = await response.text();
                    document.getElementById('message').textContent = message;
                }
            } catch (error) {
                document.getElementById('message').textContent = 'Error logging in';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (response.status === 200) {
                    window.location.href = '/';
                } else {
                    const message = await response.text();
                    document.getElementById('message').textContent = message;
                }
            } catch (error) {
                document.getElementById('message').textContent = 'Error signing up';
            }
        });
    }

    if (toggleSignup) {
        toggleSignup.addEventListener('click', () => {
            window.location.href = '/sign-up-form';
        });
    }

    if (toggleLogin) {
        toggleLogin.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
});
