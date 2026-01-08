import { describe, it, expect } from 'vitest';
import accountsReducer, {
  setAccounts,
  setLoading,
  setError,
} from './accountsSlice';
import { IAccount } from '../../server/serverData.js';

describe('accountsSlice', () => {
  const mockAccounts: IAccount[] = [
    {
      id: '1',
      name: 'Test Account',
      description: 'Test Description',
      customerIDs: ['c1', 'c2'],
      ownedBy: 'user1',
      revenue: 1000,
    },
    {
      id: '2',
      name: 'Another Account',
      description: 'Another Description',
      customerIDs: ['c3'],
      ownedBy: 'user1',
      revenue: 500,
    },
  ];

  it('should handle initial state', () => {
    expect(accountsReducer(undefined, { type: 'unknown' })).toEqual({
      accounts: [],
      loading: false,
      error: null,
    });
  });

  it('should handle setAccounts', () => {
    const actual = accountsReducer(undefined, setAccounts(mockAccounts));

    expect(actual.accounts).toEqual(mockAccounts);
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(null);
  });

  it('should handle setLoading to true', () => {
    const actual = accountsReducer(undefined, setLoading(true));

    expect(actual.loading).toBe(true);
  });

  it('should handle setLoading to false', () => {
    const loadingState = {
      accounts: [],
      loading: true,
      error: null,
    };

    const actual = accountsReducer(loadingState, setLoading(false));

    expect(actual.loading).toBe(false);
  });

  it('should handle setError', () => {
    const loadingState = {
      accounts: [],
      loading: true,
      error: null,
    };

    const actual = accountsReducer(loadingState, setError('Test error'));

    expect(actual.error).toBe('Test error');
    expect(actual.loading).toBe(false);
  });

  it('should clear error when setAccounts is called', () => {
    const errorState = {
      accounts: [],
      loading: false,
      error: 'Previous error',
    };

    const actual = accountsReducer(errorState, setAccounts(mockAccounts));

    expect(actual.error).toBe(null);
    expect(actual.accounts).toEqual(mockAccounts);
  });
});
