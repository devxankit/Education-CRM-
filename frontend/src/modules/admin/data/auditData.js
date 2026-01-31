/**
 * Audit Mock Data for Admin Module
 */

export const financialLogs = [
    { id: 'FA-1001', timestamp: '2025-01-26 18:45:00', user: 'Finance Admin', action: 'Fee Collection', amount: 25000, type: 'credit', module: 'Fees', status: 'completed', reference: 'FEE-2025-1234' },
    { id: 'FA-1002', timestamp: '2025-01-26 17:30:00', user: 'Accountant', action: 'Salary Disbursement', amount: 150000, type: 'debit', module: 'Payroll', status: 'completed', reference: 'SAL-2025-001' },
    { id: 'FA-1003', timestamp: '2025-01-26 16:15:00', user: 'Admin User', action: 'Refund Processed', amount: 5000, type: 'debit', module: 'Fees', status: 'pending', reference: 'REF-2025-089' },
    { id: 'FA-1004', timestamp: '2025-01-26 15:00:00', user: 'Finance Admin', action: 'Vendor Payment', amount: 45000, type: 'debit', module: 'Expenses', status: 'completed', reference: 'VEN-2025-056' },
    { id: 'FA-1005', timestamp: '2025-01-26 14:20:00', user: 'System', action: 'Late Fee Applied', amount: 500, type: 'credit', module: 'Fees', status: 'completed', reference: 'LF-2025-234' },
    { id: 'FA-1006', timestamp: '2025-01-26 12:00:00', user: 'Finance Admin', action: 'Budget Adjustment', amount: 100000, type: 'adjustment', module: 'Budget', status: 'flagged', reference: 'BUD-2025-012' },
];

export const dataChanges = [
    { id: 'DH-1001', timestamp: '2025-01-26 19:30:00', user: 'Admin User', entity: 'Student', entityId: 'STU-2024-1234', entityName: 'Rahul Sharma', field: 'Email', oldValue: 'rahul.old@email.com', newValue: 'rahul.new@email.com', module: 'Students', action: 'update' },
    { id: 'DH-1002', timestamp: '2025-01-26 18:15:00', user: 'HR Manager', entity: 'Employee', entityId: 'EMP-2024-056', entityName: 'Priya Verma', field: 'Department', oldValue: 'Science', newValue: 'Mathematics', module: 'Employees', action: 'update' },
    { id: 'DH-1003', timestamp: '2025-01-26 17:00:00', user: 'System', entity: 'Fee Structure', entityId: 'FEE-STR-001', entityName: 'Class 10 Tuition', field: 'Amount', oldValue: '₹45,000', newValue: '₹48,000', module: 'Finance', action: 'update' },
];

export const securityEvents = [
    { id: 'SEC-1001', timestamp: '2025-01-26 21:45:00', eventType: 'failed_login', severity: 'medium', user: 'unknown@email.com', ip: '203.110.4.55', location: 'Mumbai, India', details: 'Failed login attempt - Invalid password (3rd attempt)', status: 'monitored' },
    { id: 'SEC-1002', timestamp: '2025-01-26 20:30:00', eventType: 'permission_change', severity: 'high', user: 'Admin User', ip: '192.168.1.5', location: 'Office Network', details: 'Role permissions modified for ROLE_TEACHER', status: 'reviewed' },
];

export default {
    financialLogs,
    dataChanges,
    securityEvents
};
