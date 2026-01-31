
export const initialStudents = [
    {
        id: 'STU-2024-001',
        name: 'Aarav Gupta',
        class: 'X-A',
        status: 'Active',
        contact: '9876543210',
        feeStatus: 'Paid',
        route: 'Route-A',
        docsStatus: 'Verified',
        parentName: 'Rajiv Gupta',
        email: 'rajiv.g@example.com',
        address: '12, Park Street, Kolkata',
        fees: { total: 45000, paid: 45000, pending: 0 },
        installments: [
            { id: 1, title: 'Term 1 Fee', amount: 15000, dueDate: '2024-04-10', status: 'Paid', receipt: 'REC-101' },
            { id: 2, title: 'Term 2 Fee', amount: 15000, dueDate: '2024-08-10', status: 'Paid', receipt: 'REC-205' },
            { id: 3, title: 'Term 3 Fee', amount: 15000, dueDate: '2024-12-10', status: 'Paid', receipt: 'REC-401' },
        ]
    },
    {
        id: 'STU-2024-002',
        name: 'Ishita Sharma',
        class: 'X-A',
        status: 'Active',
        contact: '9876543211',
        feeStatus: 'Partial',
        route: 'Route-B',
        docsStatus: 'Pending',
        parentName: 'Sanjay Sharma',
        email: 'sanjay.s@example.com',
        address: '45, MG Road, Pune',
        fees: { total: 45000, paid: 25000, pending: 20000 },
        installments: [
            { id: 1, title: 'Term 1 Fee', amount: 15000, dueDate: '2024-04-10', status: 'Paid', receipt: 'REC-102' },
            { id: 2, title: 'Term 2 Fee', amount: 15000, dueDate: '2024-08-10', status: 'Partial', receipt: 'REC-208' },
            { id: 3, title: 'Term 3 Fee', amount: 15000, dueDate: '2024-12-10', status: 'Due' },
        ]
    },
    {
        id: 'STU-2024-003',
        name: 'Rohan Mehta',
        class: 'IX-B',
        status: 'Inactive',
        contact: '9876543212',
        feeStatus: 'Overdue',
        route: 'Unassigned',
        docsStatus: 'Missing',
        parentName: 'Vikram Mehta',
        email: 'vikram.m@example.com',
        address: '88, Lake View, Bangalore',
        fees: { total: 42000, paid: 0, pending: 42000 },
        installments: [
            { id: 1, title: 'Annual Fee', amount: 42000, dueDate: '2024-05-10', status: 'Overdue' }
        ]
    },
];
