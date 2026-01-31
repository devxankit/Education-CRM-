// useStaffNavigation.js - Staff Navigation Hook
// Provides navigation utilities and route helpers

import { useNavigate, useLocation } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';

/**
 * Hook for staff navigation utilities
 * @returns {Object} Navigation utilities
 */
export const useStaffNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useStaffAuth();

    /**
     * Navigate to a staff module page
     * @param {string} path - Relative path within staff module
     */
    const goTo = (path) => {
        const fullPath = path.startsWith('/staff') ? path : `/staff${path.startsWith('/') ? path : `/${path}`}`;
        navigate(fullPath);
    };

    /**
     * Navigate to student detail page
     * @param {string} studentId - Student ID
     */
    const goToStudent = (studentId) => {
        navigate(`/staff/students/${studentId}`);
    };

    /**
     * Navigate to teacher detail page
     * @param {string} teacherId - Teacher ID
     */
    const goToTeacher = (teacherId) => {
        navigate(`/staff/teachers/${teacherId}`);
    };

    /**
     * Navigate to employee detail page
     * @param {string} employeeId - Employee ID
     */
    const goToEmployee = (employeeId) => {
        navigate(`/staff/employees/${employeeId}`);
    };

    /**
     * Navigate to ticket detail page
     * @param {string} ticketId - Ticket ID
     */
    const goToTicket = (ticketId) => {
        navigate(`/staff/support/${ticketId}`);
    };

    /**
     * Navigate to route detail page
     * @param {string} routeId - Route ID
     */
    const goToRoute = (routeId) => {
        navigate(`/staff/transport/routes/${routeId}`);
    };

    /**
     * Navigate to asset detail page
     * @param {string} assetId - Asset ID
     */
    const goToAsset = (assetId) => {
        navigate(`/staff/assets/${assetId}`);
    };

    /**
     * Navigate to notice detail page
     * @param {string} noticeId - Notice ID
     */
    const goToNotice = (noticeId) => {
        navigate(`/staff/notices/${noticeId}`);
    };

    /**
     * Go back to previous page
     */
    const goBack = () => {
        navigate(-1);
    };

    /**
     * Get current active path
     * @returns {string}
     */
    const getCurrentPath = () => {
        return location.pathname;
    };

    /**
     * Check if current path matches
     * @param {string} path - Path to check
     * @returns {boolean}
     */
    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return {
        navigate,
        goTo,
        goToStudent,
        goToTeacher,
        goToEmployee,
        goToTicket,
        goToRoute,
        goToAsset,
        goToNotice,
        goBack,
        getCurrentPath,
        isActive,
        currentPath: location.pathname,
    };
};

export default useStaffNavigation;