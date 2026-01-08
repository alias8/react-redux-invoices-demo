import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('should render login form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should have default values in inputs', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/username/i)).toHaveValue('user0');
    expect(screen.getByLabelText(/password/i)).toHaveValue('user0');
  });

  it('should update input values on change', () => {
    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });

    expect(usernameInput).toHaveValue('newuser');
    expect(passwordInput).toHaveValue('newpass');
  });

  it('should display error message on failed login', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid username or password/i)
      ).toBeInTheDocument();
    });
  });

  it('should call API with correct credentials on submit', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123', username: 'user0' }),
    });

    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'user0', password: 'user0' }),
      });
    });
  });

  it('should dispatch login action on successful login', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123', username: 'user0' }),
    });

    const { store } = renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loggedIn).toBe(true);
      expect(state.auth.username).toBe('user0');
      expect(state.auth.id).toBe('123');
    });
  });

  it('should show error message on network error', async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred during login/i)
      ).toBeInTheDocument();
    });
  });
});
