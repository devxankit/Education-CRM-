/**
 * Report API Service for Teacher Module
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPerformanceReports = async (filters) => {
    await delay(500);
    return {
        success: true,
        data: [
            { id: 1, title: 'Class 10-A Math Performance', date: '2026-01-20', type: 'Progress' },
            { id: 2, title: 'Weekly Attendance Summary', date: '2026-01-15', type: 'Attendance' }
        ]
    };
};

export const exportReport = async (reportId, format = 'pdf') => {
    await delay(1000);
    return { success: true, downloadUrl: '#' };
};

export default {
    getPerformanceReports,
    exportReport
};
