import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherAuthGuard = () => {
    const { isAuthenticated, token } = useTeacherStore();

    // Robust check for refresh: check both store and multiple localStorage locations
    const hasToken = token || !!localStorage.getItem('token') || !!JSON.parse(localStorage.getItem('teacher-storage') || '{}')?.state?.token;
    const isAuth = isAuthenticated || hasToken;

    if (!isAuth) {
        return <Navigate to="/teacher/login" replace />;
    }

    return <Outlet />;
};

export default TeacherAuthGuard;
