'use client'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { PublicRoute } from './components/auth/PublicRoute'
import { Toaster } from './components/ui/sonner.tsx'
import { CustomersPage } from './pages/Customers'
import { CustomerDetail } from './pages/CustomerDetail'
import { BoardPage } from './pages/Board'
import { QueryProvider } from './providers/query-provider'
import { AppLayout } from './components/ui/layout.tsx'
import { DeclarationsPage } from './pages/Declarations'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <AppLayout>{children}</AppLayout>
}

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/declarations"
            element={
              <ProtectedRoute>
                <DeclarationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster richColors closeButton position="top-right" />
    </QueryProvider>
  )
}

export default App
