// useStaffRole.js - Staff Role Hook
// Provides role information and utilities

import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';

/**
 * Hook for accessing staff role information
 * @returns {Object} Role information and utilities
 */
export const useStaffRole = () => {
    const { user } = useStaffAuth();
    const currentRole = user?.role;

    /**
     * Get role display name
     * @param {string} role - Role key
     * @returns {string} Display name
     */
    const getRoleDisplayName = (role) => {
        const roleNames = {
            [STAFF_ROLES.FRONT_DESK]: 'Front Desk',
            [STAFF_ROLES.DATA_ENTRY]: 'Data Entry',
            [STAFF_ROLES.ACCOUNTS]: 'Accounts',
            [STAFF_ROLES.TRANSPORT]: 'Transport',
            [STAFF_ROLES.SUPPORT]: 'Support',
            [STAFF_ROLES.ADMIN]: 'Admin',
        };
        return roleNames[role] || role || 'Unknown';
    };

    /**
     * Get role color for badges
     * @param {string} role - Role key
     * @returns {string} Tailwind color classes
     */
    const getRoleColor = (role) => {
        const roleColors = {
            [STAFF_ROLES.FRONT_DESK]: 'bg-blue-100 text-blue-700',
            [STAFF_ROLES.DATA_ENTRY]: 'bg-purple-100 text-purple-700',
            [STAFF_ROLES.ACCOUNTS]: 'bg-green-100 text-green-700',
            [STAFF_ROLES.TRANSPORT]: 'bg-amber-100 text-amber-700',
            [STAFF_ROLES.SUPPORT]: 'bg-indigo-100 text-indigo-700',
            [STAFF_ROLES.ADMIN]: 'bg-red-100 text-red-700',
        };
        return roleColors[role] || 'bg-gray-100 text-gray-700';
    };

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    const isAdmin = () => {
        return currentRole === STAFF_ROLES.ADMIN;
    };

    /**
     * Check if current user can access accounts features
     * @returns {boolean}
     */
    const canAccessAccounts = () => {
        return [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN].includes(currentRole);
    };

    /**
     * Check if current user can access transport features
     * @returns {boolean}
     */
    const canAccessTransport = () => {
        return [STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN].includes(currentRole);
    };

    /**
     * Check if current user can edit data
     * @returns {boolean}
     */
    const canEditData = () => {
        return [STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ADMIN].includes(currentRole);
    };

    /**
     * Get all available roles
     * @returns {Object} All role constants
     */
    const getAllRoles = () => {
        return STAFF_ROLES;
    };

    return {
        currentRole,
        currentRoleDisplayName: getRoleDisplayName(currentRole),
        currentRoleColor: getRoleColor(currentRole),
        getRoleDisplayName,
        getRoleColor,
        isAdmin,
        canAccessAccounts,
        canAccessTransport,
        canEditData,
        getAllRoles,
        STAFF_ROLES,
    };
};

export default useStaffRole;