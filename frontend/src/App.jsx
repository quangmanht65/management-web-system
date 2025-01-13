import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token')
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
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
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token')
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default App
