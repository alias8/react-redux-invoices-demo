import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCustomers, setLoading, setError } from '../store/customersSlice';
import Navigation from '../components/Navigation';
import '../App.css';

function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state) => state.customers);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        dispatch(setCustomers(data));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setError(errorMessage));
      }
    };

    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [dispatch, customers.length]);

  const customer = customers.find(c => c.id === id);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>;
  }

  if (!customer) {
    return (
      <>
        <Navigation />
        <h1>Customer Not Found</h1>
        <div className="card">
          <p>Customer with ID {id} not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <h1>Customer Details</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{customer.name}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>Customer ID:</div>
            <div>{customer.id}</div>

            <div style={{ fontWeight: 'bold' }}>Created Date:</div>
            <div>{new Date(customer.createdDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerDetails;
