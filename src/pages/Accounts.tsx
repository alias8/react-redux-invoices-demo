import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAccounts, setLoading, setError } from '../store/accountsSlice';
import Navigation from '../components/Navigation';
import '../App.css';

function Accounts() {
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector((state) => state.accounts);
  const { id: userId } = useAppSelector((state) => state.auth);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        const response = await fetch('/api/accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accountsData = await response.json();
        dispatch(setAccounts(accountsData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setError(errorMessage));
      }
    };

    fetchData();
  }, [dispatch]);

  const userAccounts = accounts.filter(account => account.ownedBy === userId);

  const handleEdit = (accountId: string, currentName: string, currentDescription: string) => {
    setEditingId(accountId);
    setEditName(currentName);
    setEditDescription(currentDescription);
  };

  const handleSaveEdit = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      const updatedAccounts = accounts.map(account =>
        account.id === accountId ? { ...account, name: editName, description: editDescription } : account
      );
      dispatch(setAccounts(updatedAccounts));
      setEditingId(null);
      setEditName('');
      setEditDescription('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account';
      alert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDelete = async (accountId: string, accountName: string) => {
    if (!confirm(`Are you sure you want to delete account "${accountName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      const updatedAccounts = accounts.filter(account => account.id !== accountId);
      dispatch(setAccounts(updatedAccounts));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <h1>Accounts</h1>

      <div className="card">
        {userAccounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #646cff' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Customers</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Revenue</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userAccounts.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px' }}>
                    {editingId === account.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{
                          padding: '5px',
                          fontSize: '14px',
                          border: '1px solid #646cff',
                          borderRadius: '4px',
                          backgroundColor: '#1a1a1a',
                          color: 'white',
                          width: '200px'
                        }}
                      />
                    ) : (
                      <Link to={`/account-details/${account.id}`} style={{ color: '#646cff', textDecoration: 'none' }}>
                        {account.name}
                      </Link>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingId === account.id ? (
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{
                          padding: '5px',
                          fontSize: '14px',
                          border: '1px solid #646cff',
                          borderRadius: '4px',
                          backgroundColor: '#1a1a1a',
                          color: 'white',
                          width: '300px'
                        }}
                      />
                    ) : (
                      account.description
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {account.customerIDs.length}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {account.revenue ? `$${account.revenue.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {editingId === account.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(account.id)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(account.id, account.name, account.description)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(account.id, account.name)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Accounts;
