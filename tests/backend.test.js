const request = require('supertest');
const { app, server } = require('../server.js');

describe('Backend API Tests', () => {
  test('GET /api/social/posts returns posts', async () => {
    const response = await request(app).get('/api/social/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/social/posts creates a post', async () => {
    const newPost = { content: 'Test post content' };
    const response = await request(app).post('/api/social/posts').send(newPost);
    expect(response.status).toBe(201);
    expect(response.body.content).toBe(newPost.content);
  });

  test('POST /api/ai/moderate returns moderation result', async () => {
    const content = { text: 'Some content to moderate' };
    const response = await request(app).post('/api/ai/moderate').send(content);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('moderationResult');
  });

  test('POST /api/music/upload uploads a track', async () => {
    const response = await request(app)
      .post('/api/music/upload')
      .attach('track', Buffer.from('dummy audio data'), 'test.mp3');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('trackId');
  });

  test('POST /api/auth/login authenticates user', async () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    const response = await request(app).post('/api/auth/login').send(credentials);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

afterAll((done) => {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});
