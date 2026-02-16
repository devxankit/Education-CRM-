import React from 'react';
import { Navigate } from 'react-router-dom';
import StudentAuthGuard from './components/auth/StudentAuthGuard';

// Placeholder Lazy loading components
import StudentDashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
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
import NotesPage from './pages/Notes';
import NotificationsPage from './pages/Notifications';
import EditProfilePage from './pages/EditProfile';

const StudentAttendance = AttendancePage;
const StudentAcademics = Academics;
const StudentHomework = HomeworkPage;
const StudentFees = FeesPage;
const StudentDocuments = DocumentsPage;
const StudentNotices = Notices;
const StudentHelp = HelpSupportPage;
const StudentSettings = SettingsPage;
const StudentExams = ExamsResultsPage;
const StudentNotes = NotesPage;
const StudentNotifications = NotificationsPage;


import StudentLayout from './layouts/StudentLayout';

const studentRoutes = [
    {
        path: 'student',
        children: [
            { path: 'login', element: <Login /> },
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                element: <StudentAuthGuard />,
                children: [
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
                                path: 'homework/:id',
                                element: <StudentHomework />,
                            },
                            {
                                path: 'notices',
                                element: <StudentNotices />,
                            },
                            {
                                path: 'notices/:id',
                                element: <StudentNotices />,
                            },
                            {
                                path: 'exams',
                                element: <StudentExams />,
                            },
                            {
                                path: 'exams/:id',
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
                                path: 'notes',
                                element: <StudentNotes />,
                            },
                            {
                                path: 'notifications',
                                element: <StudentNotifications />,
                            },
                            {
                                path: 'profile',
                                element: <ProfilePage />,
                            },
                            {
                                path: 'profile/edit',
                                element: <EditProfilePage />,
                            },
                            {
                                path: 'help',
                                element: <StudentHelp />,
                            },
                        ],
                    },
                    { path: 'settings', element: <StudentSettings /> },
                ]
            },
        ],
    },
];

export default studentRoutes;
