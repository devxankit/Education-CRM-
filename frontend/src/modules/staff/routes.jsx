
import React from 'react';
import { Navigate } from 'react-router-dom';
import StaffLayout from './layouts/StaffLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Fees from './pages/Fees';
import Documents from './pages/Documents';
import Transport from './pages/Transport';
import Notices from './pages/Notices';
import Support from './pages/Support';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const staffRoutes = [
    {
        path: 'staff',
        children: [
            // Public/Auth Routes
            { path: 'login', element: <Login /> },

            // Protected Layout Routes
            {
                element: <StaffLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'students', element: <Students /> },
                    { path: 'students/:studentId', element: <StudentDetail /> },

                    // Task Modules
                    { path: 'fees', element: <Fees /> },
                    { path: 'documents', element: <Documents /> },
                    { path: 'transport', element: <Transport /> },
                    { path: 'notices', element: <Notices /> },
                    { path: 'support', element: <Support /> },

                    // Core Apps
                    { path: 'reports', element: <Reports /> },
                    { path: 'profile', element: <Profile /> },
                    { path: 'settings', element: <Settings /> },
                ]
            }
        ]
    }
];

export default staffRoutes;