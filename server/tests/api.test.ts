import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

describe('API Routes', () => {
  let app: express.Application;
  let authToken: string;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);

    // Get auth token for protected routes
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        username: 'admin@geniussoftwarecore.com',
        password: 'admin123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('GET /api/services', () => {
    test('should return list of services', async () => {
      const response = await request(app)
        .get('/api/services');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const service = response.body[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('title');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('category');
    });
  });

  describe('GET /api/portfolio', () => {
    test('should return list of portfolio items', async () => {
      const response = await request(app)
        .get('/api/portfolio');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const portfolioItem = response.body[0];
      expect(portfolioItem).toHaveProperty('id');
      expect(portfolioItem).toHaveProperty('title');
      expect(portfolioItem).toHaveProperty('slug');
      expect(portfolioItem).toHaveProperty('category');
    });

    test('should filter portfolio by category', async () => {
      const response = await request(app)
        .get('/api/portfolio?category=mobile');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach((item: any) => {
        expect(item.category).toBe('mobile');
      });
    });
  });

  describe('GET /api/testimonials', () => {
    test('should return list of testimonials', async () => {
      const response = await request(app)
        .get('/api/testimonials');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const testimonial = response.body[0];
      expect(testimonial).toHaveProperty('id');
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('content');
      expect(testimonial).toHaveProperty('rating');
    });
  });

  describe('POST /api/contact', () => {
    test('should create contact submission with valid data', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        service: 'تطوير المواقع',
        message: 'أحتاج إلى موقع ويب لشركتي'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(contactData.name);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'invalid-email',
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('Security Headers', () => {
    test('should not expose sensitive information in responses', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('password');
      expect(response.headers).not.toHaveProperty('x-powered-by');
    });
  });
});