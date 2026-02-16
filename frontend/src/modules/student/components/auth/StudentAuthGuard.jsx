import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStudentStore } from '../../../../store/studentStore';

const StudentAuthGuard = () => {
    const { isAuthenticated, token } = useStudentStore();

    // Robust check for refresh: check both store and multiple localStorage locations
    const hasToken = token || !!localStorage.getItem('token') || !!JSON.parse(localStorage.getItem('student-storage') || '{}')?.state?.token;
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/student/login" replace />;
    }

    return <Outlet />;
};

export default StudentAuthGuard;
