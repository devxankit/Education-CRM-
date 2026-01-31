// parent.api.js - Parent Module API Service
// This service will be used for backend integration

import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Get parent dashboard data
 * @returns {Promise<Object>} Parent dashboard data
 */
export const getDashboard = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_PARENT_DATA), 300);
    });
};

/**
 * Get parent profile
 * @returns {Promise<Object>} Parent profile data
 */
export const getProfile = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_PARENT_DATA.user), 300);
    });
};

/**
 * Update parent profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (profileData) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: profileData }), 300);
    });
};

/**
 * Get parent settings
 * @returns {Promise<Object>} Settings data
 */
export const getSettings = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            notifications: { attendance: true, homework: true, fees: true, notices: true },
            privacy: { showPhone: true, showEmail: true },
            appearance: { darkMode: false, language: 'English' }
        }), 300);
    });
};

/**
 * Update parent settings
 * @param {Object} settings - Updated settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateSettings = async (settings) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: settings }), 300);
    });
};

export const ParentService = {
    getDashboard,
    getProfile,
    updateProfile,
    getSettings,
    updateSettings,
};

export default ParentService;
