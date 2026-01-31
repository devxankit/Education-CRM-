// children.api.js - Parent Module Children API Service
// This service will be used for backend integration

import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Get all children of the parent
 * @returns {Promise<Array>} List of children
 */
export const getChildren = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_PARENT_DATA.children), 300);
    });
};

/**
 * Get child by ID
 * @param {string} childId - Child ID
 * @returns {Promise<Object|null>} Child data or null
 */
export const getChildById = async (childId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const child = MOCK_PARENT_DATA.children.find(c => c.id === childId);
            resolve(child || null);
        }, 300);
    });
};

/**
 * Get child's academic summary
 * @param {string} childId - Child ID
 * @returns {Promise<Object>} Academic data
 */
export const getChildAcademics = async (childId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const child = MOCK_PARENT_DATA.children.find(c => c.id === childId);
            resolve(child?.academics || null);
        }, 300);
    });
};

/**
 * Get child's fee summary
 * @param {string} childId - Child ID
 * @returns {Promise<Object>} Fee data
 */
export const getChildFees = async (childId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const child = MOCK_PARENT_DATA.children.find(c => c.id === childId);
            resolve(child?.fees || null);
        }, 300);
    });
};

export default {
    getChildren,
    getChildById,
    getChildAcademics,
    getChildFees,
};
