const request = require('supertest');
let app;

beforeAll(() => {
  process.env.PORT = 4000; // Use a different port for testing to avoid conflicts
  // Import app and server after setting PORT to ensure it uses the correct port
  const serverModule = require('../server.js');
  app = serverModule.app;
  // Optionally, you can close the server after tests if needed
});

describe('Integration Tests', () => {
  test('Create social media post and verify via API', async () => {
    const newPost = { content: 'Integration test post' };
    const createResponse = await request(app).post('/api/social/posts').send(newPost);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.content).toBe(newPost.content);

    const getResponse = await request(app).get('/api/social/posts');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.some(post => post.content === newPost.content)).toBe(true);
  });

  test('AI moderation endpoint rejects inappropriate content', async () => {
    const badContent = { text: 'This is inappropriate content' };
    const response = await request(app).post('/api/ai/moderate').send(badContent);
    expect(response.status).toBe(200);
    expect(response.body.moderationResult).toBeDefined();
    // Add more assertions based on moderation logic
  });

  test('Music upload and retrieval', async () => {
    const uploadResponse = await request(app)
      .post('/api/music/upload')
      .attach('track', Buffer.from('dummy audio data'), 'test.mp3');
    expect(uploadResponse.status).toBe(201);
    expect(uploadResponse.body.trackId).toBeDefined();

    const trackId = uploadResponse.body.trackId;
    const getResponse = await request(app).get(`/api/music/${trackId}`);
    expect(getResponse.status).toBe(200);
    // Additional checks for track data
  });

  test('User authentication and access protected route', async () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    const loginResponse = await request(app).post('/api/auth/login').send(credentials);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    const token = loginResponse.body.token;
    const protectedResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(protectedResponse.status).toBe(200);
  });
});
