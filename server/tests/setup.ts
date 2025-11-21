import { beforeAll, afterAll } from '@jest/globals';

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  
  // Set up test database if needed
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Clean up after tests
  console.log('Cleaning up test environment...');
});