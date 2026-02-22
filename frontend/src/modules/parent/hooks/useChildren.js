// useChildren.js - Parent Module Children Hook
// Uses parentStore for dynamic data

import { useEffect } from 'react';
import { useParentStore } from '../../../store/parentStore';

/**
 * Hook for managing children data and selection (uses parentStore)
 * @returns {Object} Children data and utilities
 */
export const useChildren = () => {
    const children = useParentStore(state => state.children);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const setSelectedChild = useParentStore(state => state.setSelectedChild);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);
    const isLoading = useParentStore(state => state.isLoading);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const selectChild = (childId) => setSelectedChild(childId);
    const selectedChild = children?.find(c => (c._id || c.id) === selectedChildId) || null;

    return {
        children: children || [],
        selectedChildId,
        selectedChild,
        selectChild,
        loading: isLoading,
        error: null,
    };
};

export default useChildren;
