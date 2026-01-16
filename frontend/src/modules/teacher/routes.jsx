import React from 'react';
import { Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/Dashboard';
import ClassesPage from './pages/Classes';
import AttendancePage from './pages/Attendance';
import HomeworkPage from './pages/Homework';
import ProfilePage from './pages/Profile';

const teacherRoutes = [
    {
        path: 'teacher',
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                element: <TeacherLayout />,
                children: [
                    { path: 'dashboard', element: <TeacherDashboard /> },
                    { path: 'classes', element: <ClassesPage /> },
                    { path: 'attendance', element: <AttendancePage /> },
                    { path: 'homework', element: <HomeworkPage /> },
                    { path: 'profile', element: <ProfilePage /> },
                ]
            }
        ]
    }
];

export default teacherRoutes;
