
export const reportsData = {
    filters: {
        academicYears: ['2025-2026', '2024-2025'],
        classes: [
            { id: 'CLS-10A', name: 'Class 10-A', subject: 'Mathematics' },
            { id: 'CLS-9B', name: 'Class 9-B', subject: 'Science' }
        ]
    },
    metrics: {
        attendance: { value: 88, trend: 'up', insight: '+2% from last month' },
        homework: { value: 76, trend: 'down', insight: 'Needs attention' },
        exams: { value: 68, trend: 'stable', insight: 'Class average stable' },
        atRisk: { value: 5, trend: 'up', insight: 'Urgent intervention needed' }
    },
    analytics: {
        attendanceTrend: [
            { label: 'Week 1', value: 85 },
            { label: 'Week 2', value: 88 },
            { label: 'Week 3', value: 82 },
            { label: 'Week 4', value: 90 }
        ],
        homeworkStats: {
            completed: 76,
            late: 12,
            pending: 12
        },
        examPerformance: [
            { exam: 'UT1', avg: 65, passing: 80 },
            { exam: 'Mid-Term', avg: 72, passing: 85 },
            { exam: 'UT2', avg: 68, passing: 78 }
        ]
    },
    atRiskStudents: [
        { id: 'ST-002', name: 'Aditi Sharma', riskFactors: ['Low Attendance', 'Recurring late homework'] },
        { id: 'ST-005', name: 'Rahul Verma', riskFactors: ['Failing Grades'] },
        { id: 'ST-012', name: 'Kavita Singh', riskFactors: ['Absent for 3 exams'] }
    ]
};
