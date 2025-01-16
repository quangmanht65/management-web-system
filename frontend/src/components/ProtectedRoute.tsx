import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    return <>{children}</>;
}; 