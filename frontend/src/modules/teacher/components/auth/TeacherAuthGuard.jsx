import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherAuthGuard = () => {
    const { isAuthenticated, token } = useTeacherStore();

    if (!token || !isAuthenticated) {
        return <Navigate to="/teacher/login" replace />;
    }

    return <Outlet />;
};

export default TeacherAuthGuard;
