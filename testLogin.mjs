import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    });

    if (!response.ok) {
      console.error('Login failed with status:', response.status);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }

    const data = await response.json();
    console.log('Login successful, token:', data.token);
  } catch (error) {
    console.error('Error during login test:', error);
  }
};

await testLogin();
