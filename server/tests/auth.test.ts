import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import { DatabaseStorage } from '../database-storage';
import { generateToken, verifyToken } from '../auth';

describe('Authentication', () => {
  let app: express.Application;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('POST /api/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin@geniussoftwarecore.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('admin@geniussoftwarecore.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin@geniussoftwarecore.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should require username and password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required');
    });
  });

  describe('POST /api/register', () => {
    test('should register new user with valid data', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'newuser@test.com',
          password: 'password123',
          name: 'Test User',
          email: 'newuser@test.com',
          role: 'client'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('newuser@test.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    test('should reject duplicate username', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send({
          username: 'duplicate@test.com',
          password: 'password123',
          name: 'Test User'
        });

      // Second registration with same username
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'duplicate@test.com',
          password: 'password123',
          name: 'Another User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already exists');
    });

    test('should validate password length', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'shortpass@test.com',
          password: '12345',  // Too short
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/me', () => {
    test('should return user data with valid token', async () => {
      // Login first to get token
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          username: 'admin@geniussoftwarecore.com',
          password: 'admin123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('admin@geniussoftwarecore.com');
      expect(response.body).not.toHaveProperty('password');
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });

  describe('JWT Token Functions', () => {
    test('should generate and verify valid tokens', () => {
      const user = {
        id: 'test-id',
        username: 'test@example.com',
        role: 'admin'
      };

      const token = generateToken(user);
      expect(token).toBeTruthy();

      const decoded = verifyToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded!.userId).toBe(user.id);
      expect(decoded!.username).toBe(user.username);
      expect(decoded!.role).toBe(user.role);
    });

    test('should reject invalid tokens', () => {
      const result = verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });
});