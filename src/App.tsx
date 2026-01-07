import { useState, useEffect } from 'react'
import './App.css'
import {IAccount} from "../server.ts";

function App() {
  const [accounts, setProfile] = useState<IAccount[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accountsRes] = await Promise.all([
          fetch('/api/accounts'),
        ]);

        if (!accountsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const profileData = await accountsRes.json();

        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Resume</h1>
      {accounts && (
        <div className="card">
          <h2>{accounts[0].customerIDs}</h2>
        </div>
      )}
    </>
  )
}

export default App
