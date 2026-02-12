import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherAuthGuard = () => {
    const isAuthenticated = useTeacherStore(state => state.isAuthenticated);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token || !isAuthenticated) {
        return <Navigate to="/teacher/login" replace />;
    }

    return <Outlet />;
};

export default TeacherAuthGuard;
