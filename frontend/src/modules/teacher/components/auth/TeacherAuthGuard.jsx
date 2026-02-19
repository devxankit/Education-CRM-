import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherAuthGuard = () => {
    const { isAuthenticated, token } = useTeacherStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const finish = () => setHydrated(true);
        
        // Check if Zustand persist has hydrated
        if (useTeacherStore.persist?.hasHydrated?.()) {
            finish();
            return;
        }
        
        // Wait for hydration - increased timeout for Flutter WebView compatibility
        const unsub = useTeacherStore.persist?.onFinishHydration?.(finish);
        const fallback = setTimeout(finish, 500); // Increased from 150ms to 500ms for Flutter WebView
        
        return () => {
            clearTimeout(fallback);
            if (typeof unsub === 'function') unsub();
        };
    }, []);

    // While checking hydration, show loading (don't redirect yet)
    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    // After hydration, check authentication
    // For Flutter WebView compatibility, check multiple sources
    let hasToken = false;
    try {
        // Check Zustand store token
        hasToken = !!token;
        
        // Fallback to localStorage directly (for Flutter WebView)
        if (!hasToken && typeof window !== 'undefined') {
            hasToken = !!localStorage.getItem('token');
        }
        
        // Also check persisted Zustand storage
        if (!hasToken && typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('teacher-storage');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    hasToken = !!parsed?.state?.token;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    } catch (e) {
        console.error('Error checking token:', e);
    }

    // Check authentication status
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/teacher/login" replace />;
    }

    return <Outlet />;
};

export default TeacherAuthGuard;
