import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Set test environment
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-key';
