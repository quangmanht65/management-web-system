import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by looking for access token
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}; 