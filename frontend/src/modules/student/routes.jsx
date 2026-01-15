import React from 'react';
import { Navigate } from 'react-router-dom';

// Placeholder Lazy loading components
import StudentDashboard from './pages/Dashboard';
import Academics from './pages/Academics';
import Homework from './pages/Homework';
import BottomNav from './components/Dashboard/BottomNav';

const StudentAttendance = () => <div>Student Attendance</div>;
const StudentAcademics = Academics;
const StudentHomework = Homework;


const studentRoutes = [
    {
        path: 'student',
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
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
            // Add other student routes here
        ],
    },
];

export default studentRoutes;
