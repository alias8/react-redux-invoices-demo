import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { login, logout } from './authSlice';

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      id: null,
      loggedIn: false,
      username: null,
      error: null,
      meta: {},
    });
  });

  it('should handle login', () => {
    const initialState = {
      id: null,
      loggedIn: false,
      username: null,
      error: null,
      meta: {},
    };

    const actual = authReducer(
      initialState,
      login({ id: '123', username: 'testuser' })
    );

    expect(actual.loggedIn).toBe(true);
    expect(actual.username).toBe('testuser');
    expect(actual.id).toBe('123');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth',
      expect.stringContaining('testuser')
    );
  });

  it('should handle logout', () => {
    const loggedInState = {
      id: '123',
      loggedIn: true,
      username: 'testuser',
      error: null,
      meta: {},
    };

    const actual = authReducer(loggedInState, logout());

    expect(actual.loggedIn).toBe(false);
    expect(actual.username).toBe(null);
    expect(actual.id).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth');
  });

  it('should persist state to localStorage on login', () => {
    const initialState = {
      id: null,
      loggedIn: false,
      username: null,
      error: null,
      meta: {},
    };

    authReducer(initialState, login({ id: '456', username: 'john' }));

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    const savedData = (localStorage.setItem as any).mock.calls[0][1];
    const parsed = JSON.parse(savedData);
    expect(parsed.username).toBe('john');
    expect(parsed.id).toBe('456');
    expect(parsed.loggedIn).toBe(true);
  });
});
