// notices.api.js - Parent Module Notices API Service
// This service will be used for backend integration

import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Get all notices
 * @param {Object} filters - Optional filters (type, read status)
 * @returns {Promise<Array>} List of notices
 */
export const getNotices = async (filters = {}) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PARENT_DATA.notices);
        }, 300);
    });
};

/**
 * Get notice by ID
 * @param {string} noticeId - Notice ID
 * @returns {Promise<Object|null>} Notice details
 */
export const getNoticeById = async (noticeId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const notice = MOCK_PARENT_DATA.notices.find(n => n.id === parseInt(noticeId));
            resolve(notice || null);
        }, 300);
    });
};

/**
 * Mark notice as read
 * @param {string} noticeId - Notice ID
 * @returns {Promise<Object>} Success response
 */
export const markNoticeAsRead = async (noticeId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, noticeId });
        }, 300);
    });
};

export default {
    getNotices,
    getNoticeById,
    markNoticeAsRead,
};
