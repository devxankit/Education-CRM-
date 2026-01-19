
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

const StaffRoleGuard = () => {
    const { isAuthenticated, user } = useStaffAuth();
    const location = useLocation();

    // 1. If not logged in, force to login
    if (!isAuthenticated) {
        return <Navigate to="/staff/login" state={{ from: location }} replace />;
    }

    // 2. (Optional) We could add specific role checks per route here if we had a comprehensive permission map.
    // For now, if they are authenticated as a staff member, we allow them into the protected layout.
    // The Dashboard itself handles what they *see*.

    // Strict Safety: If user has no role (data corruption), force logout/login
    if (!user?.role) {
        return <Navigate to="/staff/login" replace />;
    }

    return <Outlet />;
};

export default StaffRoleGuard;
