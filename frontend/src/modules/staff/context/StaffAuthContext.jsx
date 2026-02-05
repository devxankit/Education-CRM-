
import React, { createContext, useContext, useState, useEffect } from 'react';
import { STAFF_ROLES } from '../config/roles';
import { getMyPermissions } from '../services/auth.api';

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

    // Sync Permissions on User Change
    useEffect(() => {
        if (user) {
            fetchPermissions();
        } else {
            setPermissions({});
        }
    }, [user, fetchPermissions]);

    // 2. Login function: sets the role ONCE.
    const login = React.useCallback((userData) => {
        // Enforce user structure
        if (!userData || !userData.role) {
            console.error("Invalid login data: Role is missing");
            return;
        }

        // Strict Role Check: Ensure role is valid
        if (!Object.values(STAFF_ROLES).includes(userData.role)) {
            console.error("Invalid role detected");
            return;
        }

        setUser(userData);
        localStorage.setItem('staff_user', JSON.stringify(userData));
    }, []);

    // 3. Logout function: clears everything
    const logout = React.useCallback(() => {
        setUser(null);
        setPermissions({});
        localStorage.removeItem('staff_user');
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
