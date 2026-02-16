import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../../../store';

const AdminAuthGuard = () => {
    const { isAuthenticated, user, token } = useAppStore();

    // Robust check for refresh
    const hasToken = token || !!localStorage.getItem('token');
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/admin/login" replace />;
    }

    // Check if user has admin privileges (institute or staff)
    // If logged in as student/teacher, redirect to login
    if (user?.role && user.role !== 'institute' && user.role !== 'staff' && user.role !== 'super_admin' && user.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminAuthGuard;
