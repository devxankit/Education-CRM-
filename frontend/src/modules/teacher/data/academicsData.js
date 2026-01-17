
export const academicsData = {
    subjects: [
        {
            id: 'SUB-MATH-10',
            name: 'Mathematics',
            code: 'MATH101',
            icon: 'Calculator', // Mapping to lucide icon name
            year: '2025-2026',
            classCount: 3,
            classes: [
                { id: 'CLS-10A', name: 'Class 10-A', students: 42, sessions: 5, schedule: 'Mon, Wed, Fri' },
                { id: 'CLS-10B', name: 'Class 10-B', students: 38, sessions: 4, schedule: 'Tue, Thu' },
                { id: 'CLS-9C', name: 'Class 9-C', students: 35, sessions: 5, schedule: 'Daily' }
            ],
            status: 'Active'
        },
        {
            id: 'SUB-PHY-11',
            name: 'Physics',
            code: 'PHY202',
            icon: 'Atom',
            year: '2025-2026',
            classCount: 2,
            classes: [
                { id: 'CLS-11SCI', name: '11 Science', students: 50, sessions: 6, schedule: 'Daily' },
                { id: 'CLS-12SCI', name: '12 Science', students: 48, sessions: 6, schedule: 'Daily' }
            ],
            status: 'Active'
        }
    ],
    students: {
        'CLS-10A': [
            { id: 'ST-001', name: 'Aarav Patel', roll: 1, attendance: 95, homework: 'Submitted', performance: 'Excellent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav' },
            { id: 'ST-002', name: 'Bhavya Singh', roll: 2, attendance: 88, homework: 'Pending', performance: 'Good', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bhavya' },
            // ... more students
        ]
    }
};
