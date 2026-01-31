
export const initialTeachers = [
    {
        id: 'TCH-2024-001',
        name: 'Suresh Kumar',
        employeeId: 'EMP-T-001',
        subjects: ['Mathematics', 'Physics'],
        type: 'Permanent',
        status: 'Active',
        doj: '2019-06-15',
        contact: { phone: '9876543210', email: 'suresh.k@example.com', address: '45, Shastri Nagar, Delhi' },
        academics: { subjects: ['Mathematics', 'Physics'], classes: ['10-A', '9-B', '12-A'] },
        payroll: { salary: 45000, type: 'Monthly', deductions: 2000, status: 'Paid' },
        documents: [
            { name: 'M.Sc Degree', status: 'Verified' },
            { name: 'B.Ed Certificate', status: 'Verified' },
            { name: 'Aadhaar Card', status: 'Pending' }
        ]
    },
    {
        id: 'TCH-2024-002',
        name: 'Meera Iyer',
        employeeId: 'EMP-T-002',
        subjects: ['English', 'History'],
        type: 'Permanent',
        status: 'Active',
        doj: '2020-04-01',
        contact: { phone: '9876543211', email: 'meera.i@example.com', address: '23, Model Town, Delhi' },
        academics: { subjects: ['English', 'History'], classes: ['8-A', '7-B', '9-C'] },
        payroll: { salary: 42000, type: 'Monthly', deductions: 1500, status: 'Paid' },
        documents: [
            { name: 'M.A Degree', status: 'Verified' },
            { name: 'B.Ed Certificate', status: 'Verified' }
        ]
    },
    {
        id: 'TCH-2024-003',
        name: 'Rajesh Verma',
        employeeId: 'EMP-T-003',
        subjects: ['Computer Science'],
        type: 'Contract',
        status: 'On Leave',
        doj: '2023-01-10',
        contact: { phone: '9876543212', email: 'rajesh.v@example.com', address: '67, Rajouri Garden, Delhi' },
        academics: { subjects: ['Computer Science'], classes: ['11-A', '12-B'] },
        payroll: { salary: 38000, type: 'Monthly', deductions: 1000, status: 'Pending' },
        documents: [
            { name: 'M.Sc Degree', status: 'Verified' }
        ]
    }
];
