// fees.api.js - Staff Module Fees API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_FEE_RECORDS = [
    { id: 'FEE-001', studentId: 'STU-2024-001', studentName: 'Aarav Gupta', total: 125000, paid: 75000, pending: 50000, status: 'Partial' },
    { id: 'FEE-002', studentId: 'STU-2024-002', studentName: 'Ishita Sharma', total: 125000, paid: 50000, pending: 75000, status: 'Due' },
    { id: 'FEE-003', studentId: 'STU-2024-003', studentName: 'Rohan Mehta', total: 110000, paid: 30000, pending: 80000, status: 'Overdue' },
];

/**
 * Fetch all fee records
 * @returns {Promise<Array>} List of fee records
 */
export const fetchFeeRecords = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_FEE_RECORDS), 300);
    });
};

/**
 * Fetch fee record by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object|null>} Fee record or null
 */
export const fetchFeeByStudentId = async (studentId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const record = MOCK_FEE_RECORDS.find(f => f.studentId === studentId);
            resolve(record || null);
        }, 300);
    });
};

/**
 * Record payment
 * @param {string} studentId - Student ID
 * @param {number} amount - Payment amount
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Updated fee record
 */
export const recordPayment = async (studentId, amount, paymentDetails) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                studentId,
                amount,
                transactionId: `TXN-${Date.now()}`,
                ...paymentDetails
            });
        }, 300);
    });
};

/**
 * Get fee summary statistics
 * @returns {Promise<Object>} Fee summary stats
 */
export const getFeeSummary = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalCollected: 155000,
                totalPending: 205000,
                overdueCount: 1,
                partialCount: 1,
            });
        }, 300);
    });
};

export default {
    fetchFeeRecords,
    fetchFeeByStudentId,
    recordPayment,
    getFeeSummary,
};