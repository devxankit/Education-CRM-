// useFees.js - Parent Module Fees Hook
// Provides fee data and loading state

import { useState, useEffect } from 'react';
import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Hook for fetching child's fee data
 * @param {string} childId - Child ID
 * @returns {Object} Fee data and loading state
 */
export const useFees = (childId) => {
    const [feeData, setFeeData] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFees = async () => {
            if (!childId) return;

            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 400));

                const child = MOCK_PARENT_DATA.children.find(c => c.id === childId);

                if (child) {
                    setFeeData({
                        ...child.fees,
                        breakdown: [
                            { type: 'Tuition Fee', amount: 35000 },
                            { type: 'Lab Fee', amount: 5000 },
                            { type: 'Sports Fee', amount: 5000 }
                        ]
                    });

                    setPaymentHistory([
                        { id: 'PAY001', date: '2024-07-15', amount: 15000, mode: 'Online', status: 'Success', receiptNo: 'REC-2024-001' },
                        { id: 'PAY002', date: '2024-08-15', amount: 15000, mode: 'Online', status: 'Success', receiptNo: 'REC-2024-002' },
                    ]);
                } else {
                    setError('Child not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load fee data');
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [childId]);

    /**
     * Check if fee is overdue
     * @returns {boolean}
     */
    const isOverdue = () => {
        if (!feeData?.dueDate) return false;
        return new Date(feeData.dueDate) < new Date();
    };

    return {
        feeData,
        paymentHistory,
        isOverdue: isOverdue(),
        loading,
        error,
    };
};

export default useFees;
