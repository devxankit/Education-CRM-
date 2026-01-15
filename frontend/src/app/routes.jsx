
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
// Import module routes
import studentRoutes from '../modules/student/routes';

// Placeholder components for other modules
const TeacherDashboard = () => <div>Teacher Dashboard</div>;
const ParentDashboard = () => <div>Parent Dashboard</div>;
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
            {
                path: 'teacher/*',
                element: <TeacherDashboard />,
            },
            {
                path: 'parent/*',
                element: <ParentDashboard />,
            },
            {
                path: 'admin/*',
                element: <AdminDashboard />,
            },
            {
                path: 'staff/*',
                element: <StaffDashboard />,
            },
            {
                path: '/',
                element: <div>Landing Page / Redirect</div>,
            },
        ],
    },
]);

export default router;
