import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setAccounts, setLoading as setAccountsLoading, setError as setAccountsError } from '../store/accountsSlice'
import { setCustomers, setLoading as setCustomersLoading, setError as setCustomersError } from '../store/customersSlice'
import { setUsers, setLoading as setUsersLoading, setError as setUsersError } from '../store/usersSlice'
import { setInvoices, setLoading as setInvoicesLoading, setError as setInvoicesError } from '../store/invoicesSlice'
import Navigation from '../components/Navigation'
import '../App.css'

function Dashboard() {
  const dispatch = useAppDispatch();
  const { accounts, loading: accountsLoading, error: accountsError } = useAppSelector((state) => state.accounts);
  const { customers, loading: customersLoading, error: customersError } = useAppSelector((state) => state.customers);
  const { users, loading: usersLoading, error: usersError } = useAppSelector((state) => state.users);
  const { invoices, loading: invoicesLoading, error: invoicesError } = useAppSelector((state) => state.invoices);

  const loading = accountsLoading || customersLoading || usersLoading || invoicesLoading;
  const error = accountsError || customersError || usersError || invoicesError;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setAccountsLoading(true));
        dispatch(setCustomersLoading(true));
        dispatch(setUsersLoading(true));
        dispatch(setInvoicesLoading(true));

        const [accountsRes, customersRes, usersRes, invoicesRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/customers'),
          fetch('/api/users'),
          fetch('/api/invoices'),
        ]);

        if (!accountsRes.ok || !customersRes.ok || !usersRes.ok || !invoicesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const accountsData = await accountsRes.json();
        const customersData = await customersRes.json();
        const usersData = await usersRes.json();
        const invoicesData = await invoicesRes.json();

        dispatch(setAccounts(accountsData));
        dispatch(setCustomers(customersData));
        dispatch(setUsers(usersData));
        dispatch(setInvoices(invoicesData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setAccountsError(errorMessage));
        dispatch(setCustomersError(errorMessage));
        dispatch(setUsersError(errorMessage));
        dispatch(setInvoicesError(errorMessage));
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navigation />
      <h1>Dashboard</h1>
      {accounts.length > 0 && (
        <div className="card">
            <div>Accounts:</div>
          <h2>{accounts[0].id}</h2>
            <div>Accounts end</div>
        </div>
      )}
    </>
  )
}

export default Dashboard