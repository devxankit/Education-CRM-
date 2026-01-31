// usePermissions.js - Staff Permissions Hook
// Provides role-based permission checking

import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES, STAFF_PERMISSIONS } from '../config/roles';

/**
 * Hook for checking staff permissions
 * @returns {Object} Permission utilities
 */
export const usePermissions = () => {
    const { user } = useStaffAuth();
    const currentRole = user?.role;

    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission to check
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
        if (!currentRole || !STAFF_PERMISSIONS[currentRole]) {
            return false;
        }
        return STAFF_PERMISSIONS[currentRole].includes(permission);
    };

    /**
     * Check if user has any of the specified permissions
     * @param {Array<string>} permissions - Permissions to check
     * @returns {boolean}
     */
    const hasAnyPermission = (permissions) => {
        return permissions.some(p => hasPermission(p));
    };

    /**
     * Check if user has all specified permissions
     * @param {Array<string>} permissions - Permissions to check
     * @returns {boolean}
     */
    const hasAllPermissions = (permissions) => {
        return permissions.every(p => hasPermission(p));
    };

    /**
     * Check if user has a specific role
     * @param {string} role - Role to check
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return currentRole === role;
    };

    /**
     * Check if user has any of the specified roles
     * @param {Array<string>} roles - Roles to check
     * @returns {boolean}
     */
    const hasAnyRole = (roles) => {
        return roles.includes(currentRole);
    };

    /**
     * Check if user can edit based on allowed roles
     * @param {Array<string>} allowedRoles - Roles allowed to edit
     * @returns {boolean}
     */
    const canEdit = (allowedRoles) => {
        return allowedRoles.includes(currentRole);
    };

    return {
        currentRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        canEdit,
        roles: STAFF_ROLES,
    };
};

export default usePermissions;