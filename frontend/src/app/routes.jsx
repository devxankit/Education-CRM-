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
            { index: true, element: <Navigate to="/staff/login" replace /> },
            { path: 'login', element: <Navigate to="/staff/login" replace /> },
            ...studentRoutes,
            ...teacherRoutes,
            ...parentRoutes,
            ...staffRoutes,
            ...adminRoutes,
            { path: '*', element: <Navigate to="/staff/login" replace /> },
        ],
    },
]);

export default router;
