
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { STAFF_ROLES } from '../config/roles';
import { getMyPermissions } from '../services/auth.api';
import { API_URL } from '../../../app/api';

const StaffAuthContext = createContext(null);

export const StaffAuthProvider = ({ children }) => {
    // 1. Initialize from localStorage to persist immutable role across unmounts/refreshes
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('staff_user');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("Failed to parse staff user", e);
            return null;
        }
    });

    const [permissions, setPermissions] = useState({});

    // Fetch Permissions Logic
    const fetchPermissions = React.useCallback(async () => {
        const perms = await getMyPermissions();
        setPermissions(perms || {});
    }, []);

    // Sync Permissions on User Change & Socket Connection
    useEffect(() => {
        if (!user) {
            setPermissions({});
            return;
        }

        // Initial Fetch
        fetchPermissions();

        // Socket Connection for Real-time Updates
        const SOCKET_URL = API_URL.replace('/api/v1', '');
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('🔌 Staff Socket Connected');
        });

        socket.on('role_updated', (data) => {
            // Check if match
            const myRoleId = user?.roleId?._id || (typeof user?.roleId === 'string' ? user.roleId : null);

            if (myRoleId && data.roleId === myRoleId) {
                console.log('🔔 Permission Updated Real-time', data);
                fetchPermissions();
            }
        });

        return () => {
            socket.disconnect();
        };

    }, [user, fetchPermissions]);

    // 2. Login function: sets the role ONCE.
    const login = React.useCallback((userData) => {
        // Enforce user structure
        if (!userData) {
            console.error("Invalid login data");
            return;
        }

        // Map custom backend role codes (e.g. ROLE_TRASPORT_CORDINATOR) to STAFF_ROLES
        const roleCode = (userData.roleId?.code || userData.role || '').toUpperCase();
        let frontendRole = userData.role;
        if (!Object.values(STAFF_ROLES).includes(frontendRole)) {
            if (roleCode.includes('TRANSPORT') || roleCode.includes('TRASPORT')) frontendRole = STAFF_ROLES.TRANSPORT;
            else if (roleCode.includes('ACCOUNTS')) frontendRole = STAFF_ROLES.ACCOUNTS;
            else if (roleCode.includes('FRONT') || roleCode.includes('RECEPTION')) frontendRole = STAFF_ROLES.FRONT_DESK;
            else if (roleCode.includes('DATA')) frontendRole = STAFF_ROLES.DATA_ENTRY;
            else if (roleCode.includes('SUPPORT')) frontendRole = STAFF_ROLES.SUPPORT;
            else if (roleCode.includes('PRINCIPAL') || roleCode.includes('HEAD')) frontendRole = STAFF_ROLES.PRINCIPAL;
            else if (roleCode.includes('TEACHER')) frontendRole = STAFF_ROLES.TEACHER;
            else if (roleCode.includes('ADMIN')) frontendRole = STAFF_ROLES.ADMIN;
        }
        const normalizedUser = { ...userData, role: frontendRole || userData.role };

        setUser(normalizedUser);
        localStorage.setItem('staff_user', JSON.stringify(normalizedUser));
    }, []);

    // 3. Logout function: clears everything
    const logout = React.useCallback(() => {
        setUser(null);
        setPermissions({});
        localStorage.removeItem('staff_user');
        localStorage.removeItem('token');
    }, []);

    const value = React.useMemo(() => ({
        user, login, logout, isAuthenticated: !!user,
        permissions, fetchPermissions
    }), [user, login, logout, permissions, fetchPermissions]);

    return (
        <StaffAuthContext.Provider value={value}>
            {children}
        </StaffAuthContext.Provider>
    );
};

// Hook for easy usage
export const useStaffAuth = () => {
    const context = useContext(StaffAuthContext);
    if (!context) {
        throw new Error('useStaffAuth must be used within a StaffAuthProvider');
    }
    return context;
};
