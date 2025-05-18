// Auth state management
let authState = {
    isAuthenticated: false,
    user: null,
    token: null
};

// Check if user is already authenticated
function checkAuthState() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        authState.isAuthenticated = true;
        authState.token = token;
        authState.user = JSON.parse(user);
        redirectToDashboard();
    }
}

// Google Sign-In callback
function handleCredentialResponse(response) {
    // Decode the JWT token
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Store auth state
    authState.isAuthenticated = true;
    authState.user = {
        email: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture
    };
    authState.token = response.credential;

    // Save to localStorage
    localStorage.setItem('auth_token', response.credential);
    localStorage.setItem('user', JSON.stringify(authState.user));

    // Log success and redirect
    console.log('Google Sign-In successful');
    redirectToDashboard();
}

// Decode JWT token
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        // Simulate API call
        await simulateAuth(email, password);

        // Store auth state
        authState.isAuthenticated = true;
        authState.user = { email };
        authState.token = 'mock_token_' + Date.now();

        if (remember) {
            localStorage.setItem('auth_token', authState.token);
            localStorage.setItem('user', JSON.stringify(authState.user));
        }

        redirectToDashboard();
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
    }
});


// Simulate authentication API call
async function simulateAuth(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation
    if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid credentials');
    }
    
    return true;
}

// Handle logout
function handleLogout() {
    // Clear auth state
    authState.isAuthenticated = false;
    authState.user = null;
    authState.token = null;

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Redirect to login
    window.location.href = 'login.html';
}

// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Initialize auth state check
checkAuthState();

// Export functions for use in other files
window.handleCredentialResponse = handleCredentialResponse;
window.handleLogout = handleLogout;
