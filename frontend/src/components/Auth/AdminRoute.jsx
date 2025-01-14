import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user?.role || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
} 