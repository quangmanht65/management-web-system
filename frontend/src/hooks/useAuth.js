import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    isAdmin: user?.role === 'admin',
    logout: () => {
      localStorage.removeItem('user');
      setUser(null);
    }
  };
} 