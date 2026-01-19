
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StaffLayout from './layouts/StaffLayout';
import { StaffAuthProvider } from './context/StaffAuthContext';
import StaffRoleGuard from './components/auth/StaffRoleGuard';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import NewAdmission from './pages/NewAdmission';
import Fees from './pages/Fees';
import Documents from './pages/Documents';
import Transport from './pages/Transport';
import Notices from './pages/Notices';
import Support from './pages/Support';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Helper to render Outlet for the provider wrapper
const OutletWrapper = () => <Outlet />;

const staffRoutes = [
    {
        path: 'staff',
        element: <StaffAuthProvider><OutletWrapper /></StaffAuthProvider>, // Wrap entire section in Auth Provider
        children: [
            // Public Route
            { path: 'login', element: <Login /> },

            // Protected Routes
            {
                element: <StaffRoleGuard />,
                children: [
                    {
                        element: <StaffLayout />,
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: 'dashboard', element: <Dashboard /> },
                            { path: 'students', element: <Students /> },
                            { path: 'students/new', element: <NewAdmission /> },
                            { path: 'students/:studentId', element: <StudentDetail /> },
                            { path: 'fees', element: <Fees /> },
                            { path: 'documents', element: <Documents /> },
                            { path: 'transport', element: <Transport /> },
                            { path: 'notices', element: <Notices /> },
                            { path: 'support', element: <Support /> },
                            { path: 'reports', element: <Reports /> },
                            { path: 'profile', element: <Profile /> },
                            { path: 'settings', element: <Settings /> },
                        ]
                    }
                ]
            }
        ]
    }
];

export default staffRoutes;