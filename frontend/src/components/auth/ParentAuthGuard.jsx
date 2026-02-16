
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useParentStore } from '../../store/parentStore';

const ParentAuthGuard = () => {
    const { isAuthenticated, token } = useParentStore();

    // Robust check for refresh: check both store and multiple localStorage locations
    const hasToken = token || !!localStorage.getItem('token') || !!JSON.parse(localStorage.getItem('parent-storage') || '{}')?.state?.token;
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/parent/login" replace />;
    }

    return <Outlet />;
};

export default ParentAuthGuard;
