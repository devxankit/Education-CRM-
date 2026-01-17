import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
// Import module routes
import studentRoutes from '../modules/student/routes';
import teacherRoutes from '../modules/teacher/routes';
import parentRoutes from '../modules/parent/routes';
import staffRoutes from '../modules/staff/routes';

// Placeholder components for other modules
const AdminDashboard = () => <div>Admin Dashboard</div>;
const StaffDashboard = () => <div>Staff Dashboard</div>;
const Login = () => <div>Login Page</div>;

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            ...studentRoutes, // Merge student routes
            ...teacherRoutes, // Merge teacher routes
            ...parentRoutes,  // Merge parent routes
            ...staffRoutes,   // Merge staff routes
            {
                path: 'admin/*',
                element: <AdminDashboard />,
            },
            {
                path: '/',
                element: <div>Landing Page / Redirect</div>,
            },
        ],
    },
]);

export default router;
