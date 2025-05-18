// Auth state management
const authState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

// Check if user is already authenticated
function checkAuthState() {
  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('user')

  if (token && user) {
    authState.isAuthenticated = true
    authState.token = token
    authState.user = JSON.parse(user)
    redirectToDashboard()
  }
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const remember = document.getElementById('remember').checked

  if (!email || !password) {
    alert('Please enter both email and password.')
    return
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()

    // Store auth state
    authState.isAuthenticated = true
    authState.user = { email }
    authState.token = data.token

    if (remember) {
      localStorage.setItem('auth_token', authState.token)
      localStorage.setItem('user', JSON.stringify(authState.user))
    }

    redirectToDashboard()
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials and try again.')
  }
})

// Handle logout
function handleLogout() {
  // Clear auth state
  authState.isAuthenticated = false
  authState.user = null
  authState.token = null

  // Clear localStorage
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')

  // Redirect to login
  window.location.href = 'login.html'
}

// Redirect to dashboard
function redirectToDashboard() {
  window.location.href = 'dashboard.html'
}

// Initialize auth state check
checkAuthState()

// Export functions for use in other files
window.handleLogout = handleLogout
