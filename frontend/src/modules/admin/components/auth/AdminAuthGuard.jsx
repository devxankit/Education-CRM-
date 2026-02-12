import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../../../store';

const AdminAuthGuard = () => {
    const isAuthenticated = useAppStore(state => state.isAuthenticated);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token || !isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminAuthGuard;
