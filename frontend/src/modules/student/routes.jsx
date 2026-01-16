import React from 'react';
import { Navigate } from 'react-router-dom';

// Placeholder Lazy loading components
import StudentDashboard from './pages/Dashboard';
import Academics from './pages/Academics';
import Homework from './pages/Homework';
import Notices from './pages/Notices';
import BottomNav from './components/Dashboard/BottomNav';

import AttendancePage from './pages/Attendance';
import ProfilePage from './pages/Profile';
import ExamsResultsPage from './pages/ExamsResults';
import HomeworkPage from './pages/Homework';
import FeesPage from './pages/Fees';
import DocumentsPage from './pages/Documents';
import HelpSupportPage from './pages/HelpSupport';
import SettingsPage from './pages/Settings';
import ProfileCorrection from './pages/ProfileCorrection';

const StudentAttendance = AttendancePage;
const StudentAcademics = Academics;
const StudentHomework = HomeworkPage;
const StudentFees = FeesPage;
const StudentDocuments = DocumentsPage;
const StudentNotices = Notices;
const StudentHelp = HelpSupportPage;
const StudentSettings = SettingsPage;
const StudentExams = ExamsResultsPage;


import StudentLayout from './layouts/StudentLayout';

const studentRoutes = [
    {
        path: 'student',
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                element: <StudentLayout />,
                children: [
                    {
                        path: 'dashboard',
                        element: <StudentDashboard />,
                    },
                    {
                        path: 'attendance',
                        element: <StudentAttendance />,
                    },
                    {
                        path: 'academics',
                        element: <StudentAcademics />,
                    },
                    {
                        path: 'homework',
                        element: <StudentHomework />,
                    },
                    {
                        path: 'notices',
                        element: <StudentNotices />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'exams',
                        element: <StudentExams />,
                    },
                    {
                        path: 'fees',
                        element: <StudentFees />,
                    },
                    {
                        path: 'documents',
                        element: <StudentDocuments />,
                    },
                    {
                        path: 'help',
                        element: <StudentHelp />,
                    },
                ],
            },
            {
                path: 'settings',
                element: <StudentSettings />,
            },
            {
                path: 'profile/correction',
                element: <ProfileCorrection />,
            },
            // Add other student routes here
        ],
    },
];

export default studentRoutes;
