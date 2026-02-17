import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherAuthGuard = () => {
    const { isAuthenticated, token } = useTeacherStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const finish = () => setHydrated(true);
        if (useTeacherStore.persist?.hasHydrated?.()) {
            finish();
            return;
        }
        const unsub = useTeacherStore.persist?.onFinishHydration?.(finish);
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

    const hasToken = token || !!localStorage.getItem('token') || !!JSON.parse(localStorage.getItem('teacher-storage') || '{}')?.state?.token;
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/teacher/login" replace />;
    }

    return <Outlet />;
};

export default TeacherAuthGuard;
