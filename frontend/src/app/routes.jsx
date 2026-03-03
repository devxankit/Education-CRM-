import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
// Import module routes
import studentRoutes from '../modules/student/routes';
import teacherRoutes from '../modules/teacher/routes';
import parentRoutes from '../modules/parent/routes';
import staffRoutes from '../modules/staff/routes';
import adminRoutes from '../modules/admin/routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            // Default: open admin login when hitting root or /login
            { index: true, element: <Navigate to="/admin/login" replace /> },
            { path: 'login', element: <Navigate to="/admin/login" replace /> },
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
