import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';

const DashboardPage: React.FC = () => {
    return (
        <ProtectedRoute>
            <div>
                {/* Your dashboard content */}
                <h1>Dashboard</h1>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardPage; 