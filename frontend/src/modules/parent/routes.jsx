
import React from 'react';
import { Navigate } from 'react-router-dom';

// Layout
import ParentLayout from './layouts/ParentLayout';

// Pages
import Login from './pages/auth/Login';
import ParentDashboard from './pages/Dashboard';
import ChildrenPage from './pages/Children';
import AttendancePage from './pages/Attendance';
import HomeworkPage from './pages/Homework';
import HomeworkDetailPage from './pages/HomeworkDetail';
import ResultDetailPage from './pages/ResultDetail';
import ExamsResultsPage from './pages/ExamsResults';
import FeesPaymentsPage from './pages/FeesPayments';
import NoticesPage from './pages/Notices';
import NoticeDetailPage from './pages/NoticeDetail';
import TeachersPage from './pages/Teachers';
import DocumentsPage from './pages/Documents';
import ParentSupportPage from './pages/Support';
import NewTicketPage from './pages/NewTicket';
import ParentProfilePage from './pages/Profile';
import ParentSettingsPage from './pages/Settings';

const parentRoutes = [
    {
        path: 'parent',
        children: [
            { path: 'login', element: <Login /> },
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                element: <ParentLayout />,
                children: [
                    { path: 'dashboard', element: <ParentDashboard /> },
                    { path: 'children', element: <ChildrenPage /> },
                    { path: 'attendance', element: <AttendancePage /> },
                    { path: 'homework', element: <HomeworkPage /> },
                    { path: 'homework/:homeworkId', element: <HomeworkDetailPage /> },
                    { path: 'exams', element: <ExamsResultsPage /> },
                    { path: 'results', element: <ExamsResultsPage /> },
                    { path: 'results/:examId', element: <ResultDetailPage /> },
                    { path: 'fees', element: <FeesPaymentsPage /> },
                    { path: 'notices', element: <NoticesPage /> },
                    { path: 'notices/:noticeId', element: <NoticeDetailPage /> },
                    { path: 'teachers', element: <TeachersPage /> },
                    { path: 'documents', element: <DocumentsPage /> },
                    { path: 'support', element: <ParentSupportPage /> },
                    { path: 'support/new', element: <NewTicketPage /> },
                    { path: 'support/:ticketId', element: <ParentSupportPage /> }, // Re-using for now as placeholder for detail
                    { path: 'profile', element: <ParentProfilePage /> },
                    { path: 'settings', element: <ParentSettingsPage /> },
                ]
            }
        ]
    }
];

export default parentRoutes;
