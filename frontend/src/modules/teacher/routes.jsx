import React from 'react';
import { Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import TeacherAuthGuard from './components/auth/TeacherAuthGuard';
import Login from './pages/auth/Login';
import TeacherDashboard from './pages/Dashboard';
import MyAttendance from './pages/MyAttendance';
import ClassesPage from './pages/Classes';

import AttendancePage from './pages/Attendance';
import HomeworkPage from './pages/Homework';
import ExamsPage from './pages/Exams';
import ReportsPage from './pages/Reports';
import ProfilePage from './pages/Profile';
import NoticesPage from './pages/Notices';
import NoticeDetail from './pages/NoticeDetail';
import SupportPage from './pages/Support';
import TeacherHelpPage from './pages/TeacherHelp';
import HomeworkDetailPage from './pages/HomeworkDetail';
import SubmissionsPage from './pages/Submissions';
import ClassDetailPage from './pages/ClassDetail';
import StudentDetailPage from './pages/StudentDetail';
import ExamDetailPage from './pages/ExamDetail';
import TeacherPayroll from './pages/Payroll';

const teacherRoutes = [
    {
        path: 'teacher',
        children: [
            { path: 'login', element: <Login /> },
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                element: <TeacherAuthGuard />,
                children: [
                    {
                        element: <TeacherLayout />,
                        children: [
                            { path: 'dashboard', element: <TeacherDashboard /> },
                            { path: 'my-attendance', element: <MyAttendance /> },
                            { path: 'classes', element: <ClassesPage /> },

                            { path: 'classes/:id/student/:studentId', element: <StudentDetailPage /> },
                            { path: 'classes/:id', element: <ClassDetailPage /> },
                            { path: 'attendance', element: <AttendancePage /> },
                            { path: 'homework', element: <HomeworkPage /> },
                            { path: 'homework/:id', element: <HomeworkDetailPage /> },
                            { path: 'homework/:id/submissions', element: <SubmissionsPage /> },
                            { path: 'homework/submissions', element: <SubmissionsPage /> },
                            { path: 'exams', element: <ExamsPage /> },
                            { path: 'exams/:id', element: <ExamDetailPage /> },
                            { path: 'reports', element: <ReportsPage /> },
                            { path: 'profile', element: <ProfilePage /> },
                            { path: 'payroll', element: <TeacherPayroll /> },
                            { path: 'notices', element: <NoticesPage /> },
                            { path: 'notices/:id', element: <NoticeDetail /> },
                            { path: 'support', element: <SupportPage /> },
                            { path: 'help', element: <TeacherHelpPage /> },
                        ]
                    }
                ]
            }
        ]
    }
];

export default teacherRoutes;
