import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
// Import module routes
import studentRoutes from '../modules/student/routes';
import teacherRoutes from '../modules/teacher/routes';
import parentRoutes from '../modules/parent/routes';
import staffRoutes from '../modules/staff/routes';
import adminRoutes from '../modules/admin/routes';

const getPersistedToken = (storageKey, tokenKey = 'token') => {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.state?.token) return parsed.state.token;
        }
    } catch {
        // Ignore malformed storage
    }
    return localStorage.getItem(tokenKey);
};

const getInitialRoute = () => {
    if (typeof window === 'undefined') return '/admin/login';

    if (getPersistedToken('teacher-storage', 'teacher_token')) return '/teacher/dashboard';
    if (getPersistedToken('student-storage')) return '/student/dashboard';
    if (getPersistedToken('parent-storage')) return '/parent/dashboard';
    if (localStorage.getItem('staff_user') && (localStorage.getItem('staff_token') || localStorage.getItem('token'))) return '/staff/dashboard';
    if (localStorage.getItem('token')) return '/admin/dashboard';

    return '/admin/login';
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            // Default: open last authenticated module when hitting root or /login
            { index: true, element: <Navigate to={getInitialRoute()} replace /> },
            { path: 'login', element: <Navigate to={getInitialRoute()} replace /> },
            ...studentRoutes,
            ...teacherRoutes,
            ...parentRoutes,
            ...staffRoutes,
            ...adminRoutes,
            // Fallback: send unknown routes to admin login
            { path: '*', element: <Navigate to="/admin/login" replace /> },
        ],
    },
]);

export default router;
