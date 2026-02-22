// useFees.js - Parent Module Fees Hook
// Uses parentStore for dynamic data

import { useEffect } from 'react';
import { useParentStore } from '../../../store/parentStore';

/**
 * Hook for fetching child's fee data (uses parentStore)
 * @param {string} childId - Child ID
 * @returns {Object} Fee data and loading state
 */
export const useFees = (childId) => {
    const fees = useParentStore(state => state.fees);
    const fetchFees = useParentStore(state => state.fetchFees);
    const isLoading = useParentStore(state => state.isLoading);

    useEffect(() => {
        if (childId) fetchFees(childId);
    }, [childId, fetchFees]);

    const feeData = fees?.summary ? fees : null;
    const paymentHistory = fees?.receipts || [];

    const isOverdue = () => {
        if (!feeData?.summary?.pending || feeData.summary.pending <= 0) return false;
        const nextDue = feeData.summary?.nextDue;
        if (!nextDue) return false;
        return new Date(nextDue) < new Date();
    };

    return {
        feeData,
        paymentHistory,
        isOverdue: isOverdue(),
        loading: isLoading,
        error: null,
    };
};

export default useFees;
