import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCustomers, setLoading, setError } from '../store/customersSlice';
import { setAccounts } from '../store/accountsSlice';
import Navigation from '../components/Navigation';
import '../App.css';

function Customers() {
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state) => state.customers);
  const { accounts } = useAppSelector((state) => state.accounts);
  const { id: userId } = useAppSelector((state) => state.auth);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        // Fetch accounts to determine which customers belong to the logged-in user
        const accountsResponse = await fetch('/api/accounts');
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accountsData = await accountsResponse.json();
        dispatch(setAccounts(accountsData));

        // Fetch all customers
        const customersResponse = await fetch('/api/customers');
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        dispatch(setCustomers(customersData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setError(errorMessage));
      }
    };

    fetchData();
  }, [dispatch]);

  // Filter customers that belong to the logged-in user
  const userAccounts = accounts.filter(account => account.ownedBy === userId);
  const userCustomerIds = new Set(
    userAccounts.flatMap(account => account.customerIDs)
  );
  const userCustomers = customers.filter(customer => userCustomerIds.has(customer.id));

  const handleEdit = (customerId: string, currentName: string) => {
    setEditingId(customerId);
    setEditName(currentName);
  };

  const handleSaveEdit = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      // Update local state
      const updatedCustomers = customers.map(customer =>
        customer.id === customerId ? { ...customer, name: editName } : customer
      );
      dispatch(setCustomers(updatedCustomers));
      setEditingId(null);
      setEditName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      alert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = async (customerId: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Update local state
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      dispatch(setCustomers(updatedCustomers));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer';
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>;
  }

  return (
    <>
      <Navigation />
      <h1>Customers</h1>

      <div className="card">
        {userCustomers.length === 0 ? (
          <p>No customers found for your account.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #646cff' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Created Date</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px' }}>
                    {editingId === customer.id ? (
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
                      <Link
                        to={`/customer-details/${customer.id}`}
                        style={{
                          color: '#646cff',
                          textDecoration: 'none'
                        }}
                      >
                        {customer.name}
                      </Link>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(customer.createdDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {editingId === customer.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(customer.id)}
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
                          onClick={() => handleEdit(customer.id, customer.name)}
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
                          onClick={() => handleDelete(customer.id, customer.name)}
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

export default Customers;
