const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testAIModerate = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/ai/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test moderation text' }),
    });

    if (!response.ok) {
      console.error('AI moderation failed with status:', response.status);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }

    const data = await response.json();
    console.log('AI moderation result:', data);
  } catch (error) {
    console.error('Error during AI moderation test:', error);
  }
};

testAIModerate();
