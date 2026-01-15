import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth'; // Placeholder

const ProtectedRoute = ({ allowedRoles = [] }) => {
    // const { user, isAuthenticated } = useAuth();
    const isAuthenticated = true; // Mock
    const user = { role: 'student' }; // Mock

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
