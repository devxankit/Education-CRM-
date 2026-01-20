
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

const StaffRoleGuard = () => {
    const { isAuthenticated, user, logout } = useStaffAuth();
    const location = useLocation();

    // 1. If not logged in, force to login
    if (!isAuthenticated) {
        return <Navigate to="/staff/login" state={{ from: location }} replace />;
    }

    // 2. Data Integrity Check: If user exists but role is missing
    React.useEffect(() => {
        if (isAuthenticated && !user?.role) {
            console.warn("Invalid user session detected (missing role). Logging out.");
            logout();
        }
    }, [isAuthenticated, user, logout]);

    if (isAuthenticated && !user?.role) {
        return null; // Show nothing while logging out
    }

    return <Outlet />;
};

export default StaffRoleGuard;
