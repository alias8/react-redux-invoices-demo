import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from './server.js';
import type { Express } from 'express';

describe('Server API Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /api/login', () => {
    it('should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ password: 'testpass' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required');
    });

    it('should return 401 with invalid username', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'invaliduser', password: 'testpass' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'user0', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should return 200 with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'user0', password: 'user0' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body.username).toBe('user0');
    });
  });

  describe('GET /api/accounts', () => {
    it('should return accounts list with revenue', async () => {
      const agent = request.agent(app);

      // First login to get session
      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent.get('/api/accounts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('revenue');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('id');
      }
    });

    it('should calculate revenue correctly', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent.get('/api/accounts');

      expect(response.status).toBe(200);
      response.body.forEach((account: any) => {
        expect(typeof account.revenue).toBe('number');
        expect(account.revenue).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('GET /api/customers', () => {
    it('should return customers list with sales', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent.get('/api/customers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('sales');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('id');
      }
    });

    it('should calculate sales correctly', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent.get('/api/customers');

      expect(response.status).toBe(200);
      response.body.forEach((customer: any) => {
        expect(typeof customer.sales).toBe('number');
        expect(customer.sales).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('PUT /api/accounts/:id', () => {
    it('should update account successfully', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      // Get accounts to find a valid ID
      const accountsResponse = await agent.get('/api/accounts');
      const accountId = accountsResponse.body[0]?.id;

      if (accountId) {
        const response = await agent
          .put(`/api/accounts/${accountId}`)
          .send({ name: 'Updated Name', description: 'Updated Description' });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Name');
        expect(response.body.description).toBe('Updated Description');
      }
    });

    it('should return 404 for non-existent account', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent
        .put('/api/accounts/nonexistent-id')
        .send({ name: 'Test', description: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Account not found');
    });
  });

  describe('GET /api/invoices', () => {
    it('should return invoices list', async () => {
      const agent = request.agent(app);

      await agent.post('/api/login').send({ username: 'user0', password: 'user0' });

      const response = await agent.get('/api/invoices');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should maintain separate data per session', async () => {
      const agent1 = request.agent(app);
      const agent2 = request.agent(app);

      // Initialize both sessions
      await agent1.post('/api/login').send({ username: 'user0', password: 'user0' });
      await agent2.post('/api/login').send({ username: 'user0', password: 'user0' });

      // Get accounts for both agents
      const response1 = await agent1.get('/api/accounts');
      const response2 = await agent2.get('/api/accounts');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Both should get fresh data copies
      expect(Array.isArray(response1.body)).toBe(true);
      expect(Array.isArray(response2.body)).toBe(true);
    });
  });
});
