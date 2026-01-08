import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  it('should redirect to login when not authenticated', () => {
    const { container } = renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            id: null,
            loggedIn: false,
            username: null,
            error: null,
            meta: {},
          },
          accounts: { accounts: [], loading: false, error: null },
          customers: { customers: [], loading: false, error: null },
          invoices: { invoices: [], loading: false, error: null },
          users: { users: [], loading: false, error: null },
        },
      }
    );

    // When not authenticated, the component redirects, so protected content shouldn't render
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            id: '123',
            loggedIn: true,
            username: 'testuser',
            error: null,
            meta: {},
          },
          accounts: { accounts: [], loading: false, error: null },
          customers: { customers: [], loading: false, error: null },
          invoices: { invoices: [], loading: false, error: null },
          users: { users: [], loading: false, error: null },
        },
      }
    );

    // When authenticated, protected content should render
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render Navigation component when authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            id: '123',
            loggedIn: true,
            username: 'john_doe',
            error: null,
            meta: {},
          },
          accounts: { accounts: [], loading: false, error: null },
          customers: { customers: [], loading: false, error: null },
          invoices: { invoices: [], loading: false, error: null },
          users: { users: [], loading: false, error: null },
        },
      }
    );

    // Navigation should show the username
    expect(screen.getByText(/john_doe/i)).toBeInTheDocument();
  });
});
