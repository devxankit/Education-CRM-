import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useParentStore } from '../../store/parentStore';

const ParentAuthGuard = () => {
    const { isAuthenticated, token } = useParentStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const finish = () => setHydrated(true);
        if (useParentStore.persist?.hasHydrated?.()) {
            finish();
            return;
        }
        const unsub = useParentStore.persist?.onFinishHydration?.(finish);
        const fallback = setTimeout(finish, 150);
        return () => {
            clearTimeout(fallback);
            if (typeof unsub === 'function') unsub();
        };
    }, []);

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const hasToken = token || !!localStorage.getItem('token') || !!JSON.parse(localStorage.getItem('parent-storage') || '{}')?.state?.token;
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/parent/login" replace />;
    }

    return <Outlet />;
};

export default ParentAuthGuard;
