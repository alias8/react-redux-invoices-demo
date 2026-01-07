import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCustomers, setLoading, setError } from '../store/customersSlice';
import { setInvoices, setLoading as setInvoicesLoading, setError as setInvoicesError } from '../store/invoicesSlice';
import Navigation from '../components/Navigation';
import '../App.css';

function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state) => state.customers);
  const { invoices, loading: invoicesLoading, error: invoicesError } = useAppSelector((state) => state.invoices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers if not already loaded
        if (customers.length === 0) {
          dispatch(setLoading(true));
          const customersResponse = await fetch('/api/customers');
          if (!customersResponse.ok) {
            throw new Error('Failed to fetch customers');
          }
          const customersData = await customersResponse.json();
          dispatch(setCustomers(customersData));
        }

        // Fetch invoices
        dispatch(setInvoicesLoading(true));
        const invoicesResponse = await fetch('/api/invoices');
        if (!invoicesResponse.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const invoicesData = await invoicesResponse.json();
        dispatch(setInvoices(invoicesData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setError(errorMessage));
        dispatch(setInvoicesError(errorMessage));
      }
    };

    fetchData();
  }, [dispatch, customers.length]);

  const customer = customers.find(c => c.id === id);

  // Filter invoices for this customer
  const customerInvoices = customer
    ? invoices.filter(invoice => customer.invoiceIDs.includes(invoice.id))
    : [];

  // Calculate total of all invoices
  const invoicesTotal = customerInvoices.reduce((sum, invoice) => sum + invoice.purchasedPrice, 0);

  if (loading || invoicesLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error || invoicesError) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error || invoicesError}</div>;
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

            <div style={{ fontWeight: 'bold' }}>Total Spent:</div>
            <div>${invoicesTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Invoices</h2>

        {customerInvoices.length === 0 ? (
          <p>No invoices found for this customer.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #646cff' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Description</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Purchased Date</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {customerInvoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px' }}>
                    <Link to={`/invoice-details/${invoice.id}`} style={{ color: '#646cff', textDecoration: 'none' }}>
                      {invoice.description}
                    </Link>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(invoice.purchasedDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    ${invoice.purchasedPrice.toFixed(2)}
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

export default CustomerDetails;
