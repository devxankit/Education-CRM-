// useChildren.js - Parent Module Children Hook
// Provides children data and selection logic

import { useState, useEffect } from 'react';
import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Hook for managing children data and selection
 * @returns {Object} Children data and utilities
 */
export const useChildren = () => {
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize with persisted selection
    useEffect(() => {
        const fetchChildren = async () => {
            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 300));

                setChildren(MOCK_PARENT_DATA.children);

                // Restore persisted selection or default to first child
                const persistedId = localStorage.getItem('selectedChildId');
                const validId = MOCK_PARENT_DATA.children.find(c => c.id === persistedId)?.id;
                setSelectedChildId(validId || MOCK_PARENT_DATA.children[0]?.id);
            } catch (err) {
                setError(err.message || 'Failed to load children');
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, []);

    /**
     * Select a child and persist the selection
     * @param {string} childId - Child ID to select
     */
    const selectChild = (childId) => {
        setSelectedChildId(childId);
        localStorage.setItem('selectedChildId', childId);
    };

    /**
     * Get currently selected child's data
     * @returns {Object|null} Selected child data
     */
    const getSelectedChild = () => {
        return children.find(c => c.id === selectedChildId) || null;
    };

    return {
        children,
        selectedChildId,
        selectedChild: getSelectedChild(),
        selectChild,
        loading,
        error,
    };
};

export default useChildren;
