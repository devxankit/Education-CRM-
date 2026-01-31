/**
 * Dashboard Mock Data for Admin Module
 */

export const dashboardStats = [
    { id: 1, label: 'Total Students', value: '4,285', trend: '+12%', trendUp: true, color: 'indigo' },
    { id: 2, label: 'Active Teachers', value: '184', trend: '+2', trendUp: true, color: 'blue' },
    { id: 3, label: 'Fee Collection', value: '₹1.2M', trend: '92%', trendUp: true, color: 'green' },
    { id: 4, label: 'Pending Tickets', value: '15', trend: '-3', trendUp: false, color: 'amber' },
];

export const recentActivities = [
    { id: 1, user: 'Admin', action: 'New student admission', target: 'Rahul Sharma', time: '2 hours ago', type: 'admission' },
    { id: 2, user: 'Suresh Kumar', action: 'Updated marks for', target: 'Class 10-A', time: '4 hours ago', type: 'academic' },
    { id: 3, user: 'System', action: 'Automatic fee reminder sent', target: '245 parents', time: 'Yesterday', type: 'finance' },
];

export const systemHealth = {
    server: 'Stable',
    database: 'Synced',
    uptime: '99.98%',
    lastBackup: '02:00 AM Today'
};

export default {
    dashboardStats,
    recentActivities,
    systemHealth
};
