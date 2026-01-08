import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import Customers from './pages/Customers.tsx'
import CustomerDetails from './pages/CustomerDetails.tsx'
import Accounts from './pages/Accounts.tsx'
import AccountDetails from './pages/AccountDetails.tsx'
import InvoiceDetails from './pages/InvoiceDetails.tsx'
import ProtectedRoute from './components/ProtectedRoute'
import { ViewContainer } from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<ViewContainer><LoginPage /></ViewContainer>} />

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

        <Route path="*" element={
          <ProtectedRoute>
            <Navigate to="/accounts" replace />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
