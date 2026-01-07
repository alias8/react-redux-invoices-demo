import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard.tsx'
import Customers from './pages/Customers.tsx'
import CustomerDetails from './pages/CustomerDetails.tsx'
import Accounts from './pages/Accounts.tsx'
import AccountDetails from './pages/AccountDetails.tsx'
import InvoiceDetails from './pages/InvoiceDetails.tsx'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/accounts" element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        } />

        <Route path="/account-details/:id" element={
          <ProtectedRoute>
            <AccountDetails />
          </ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />

        <Route path="/customer-details/:id" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        } />

          <Route path="/invoice-details/:id" element={
              <ProtectedRoute>
                  <InvoiceDetails />
              </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
