import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStudentStore } from '../../../../store/studentStore';

const StudentAuthGuard = () => {
    const { isAuthenticated, token } = useStudentStore();

    if (!token || !isAuthenticated) {
        return <Navigate to="/student/login" replace />;
    }

    return <Outlet />;
};

export default StudentAuthGuard;
