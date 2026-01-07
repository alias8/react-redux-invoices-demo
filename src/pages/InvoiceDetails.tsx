import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IInvoice } from '../../server/serverData.js';
import Navigation from '../components/Navigation';
import '../App.css';

function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/invoices/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setInvoice(null);
          } else {
            throw new Error('Failed to fetch invoice');
          }
        } else {
          const data = await response.json();
          setInvoice(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>;
  }

  if (!invoice) {
    return (
      <>
        <Navigation />
        <h1>Invoice Not Found</h1>
        <div className="card">
          <p>Invoice with ID {id} not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <h1>Invoice Details</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{invoice.description}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>Invoice ID:</div>
            <div>{invoice.id}</div>

            <div style={{ fontWeight: 'bold' }}>Description:</div>
            <div>{invoice.description}</div>

            <div style={{ fontWeight: 'bold' }}>Purchased Date:</div>
            <div>{new Date(invoice.purchasedDate).toLocaleDateString()}</div>

            <div style={{ fontWeight: 'bold' }}>Price:</div>
            <div>${invoice.purchasedPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceDetails;