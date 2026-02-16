
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useParentStore } from '../../store/parentStore';

const ParentAuthGuard = () => {
    const { isAuthenticated, token } = useParentStore();

    if (!isAuthenticated || !token) {
        return <Navigate to="/parent/login" replace />;
    }

    return <Outlet />;
};

export default ParentAuthGuard;
