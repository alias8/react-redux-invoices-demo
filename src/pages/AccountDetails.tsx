import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAccounts, setLoading, setError } from '../store/accountsSlice';
import { setCustomers, setLoading as setCustomersLoading, setError as setCustomersError } from '../store/customersSlice';
import { setInvoices, setLoading as setInvoicesLoading, setError as setInvoicesError } from '../store/invoicesSlice';
import Navigation from '../components/Navigation';
import '../App.css';

function AccountDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector((state) => state.accounts);
  const { customers, loading: customersLoading, error: customersError } = useAppSelector((state) => state.customers);
  const { invoices, loading: invoicesLoading, error: invoicesError } = useAppSelector((state) => state.invoices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts if not already loaded
        if (accounts.length === 0) {
          dispatch(setLoading(true));
          const accountsResponse = await fetch('/api/accounts');
          if (!accountsResponse.ok) {
            throw new Error('Failed to fetch accounts');
          }
          const accountsData = await accountsResponse.json();
          dispatch(setAccounts(accountsData));
        }

        // Fetch customers
        dispatch(setCustomersLoading(true));
        const customersResponse = await fetch('/api/customers');
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        dispatch(setCustomers(customersData));

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
        dispatch(setCustomersError(errorMessage));
        dispatch(setInvoicesError(errorMessage));
      }
    };

    fetchData();
  }, [dispatch, accounts.length]);

  const account = accounts.find(a => a.id === id);

  // Filter customers for this account
  const accountCustomers = account
    ? customers.filter(customer => account.customerIDs.includes(customer.id))
    : [];

  // Get all invoice IDs for all customers in this account
  const allInvoiceIDs = accountCustomers.flatMap(customer => customer.invoiceIDs);

  // Filter invoices for all customers in this account
  const accountInvoices = invoices.filter(invoice => allInvoiceIDs.includes(invoice.id));

  // Calculate total of all invoices
  const invoicesTotal = accountInvoices.reduce((sum, invoice) => sum + invoice.purchasedPrice, 0);

  if (loading || customersLoading || invoicesLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error || customersError || invoicesError) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error || customersError || invoicesError}</div>;
  }

  if (!account) {
    return (
      <>
        <Navigation />
        <h1>Account Not Found</h1>
        <div className="card">
          <p>Account with ID {id} not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <h1>Account Details</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{account.name}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>

            <div style={{ fontWeight: 'bold' }}>Description:</div>
            <div>{account.description}</div>

            <div style={{ fontWeight: 'bold' }}>Total Sales:</div>
            <div>${invoicesTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Customers</h2>

        {accountCustomers.length === 0 ? (
          <p>No customers found for this account.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #646cff' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Created Date</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Invoices</th>
              </tr>
            </thead>
            <tbody>
              {accountCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px' }}>
                    <Link to={`/customer-details/${customer.id}`} style={{ color: '#646cff', textDecoration: 'none' }}>
                      {customer.name}
                    </Link>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(customer.createdDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {customer.invoiceIDs.length}
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

export default AccountDetails;