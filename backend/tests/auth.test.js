const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

const TEST_USER = {
  name: 'Test User',
  email: 'test@cricconnect.com',
  password: 'password123',
};

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('POST /api/auth/register - registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/register - rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login - logs in successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('POST /api/auth/login - rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/auth/me - returns current user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it('GET /api/auth/me - rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});