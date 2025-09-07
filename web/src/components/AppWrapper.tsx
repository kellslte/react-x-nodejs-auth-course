import React from 'react';
import { Outlet } from 'react-router';
import { AuthProvider } from '@/lib/contexts/AuthContext';

/**
 * App wrapper that provides the AuthProvider context
 * This needs to be inside the Router context to use useLocation
 */
const AppWrapper: React.FC = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default AppWrapper;
