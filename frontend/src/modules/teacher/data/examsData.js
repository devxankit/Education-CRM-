
export const examsData = {
    list: [
        {
            id: 'EX-101',
            title: 'Unit Test 1',
            subject: 'Mathematics',
            class: 'Class 10-A',
            date: '2026-02-15',
            totalMarks: 25,
            passingMarks: 9,
            status: 'Upcoming', // Upcoming, Active, Submitted, Locked
            studentsCount: 42,
            evaluatedCount: 0
        },
        {
            id: 'EX-102',
            title: 'Mid-Term Examination',
            subject: 'Science',
            class: 'Class 9-B',
            date: '2026-01-20',
            totalMarks: 50,
            passingMarks: 18,
            status: 'Active',
            studentsCount: 38,
            evaluatedCount: 12
        },
        {
            id: 'EX-103',
            title: 'Practical Assessment',
            subject: 'Physics',
            class: 'Class 11-A',
            date: '2026-01-10',
            totalMarks: 30,
            passingMarks: 12,
            status: 'Submitted',
            studentsCount: 35,
            evaluatedCount: 35
        },
        {
            id: 'EX-104',
            title: 'Final Term',
            subject: 'English',
            class: 'Class 9-B',
            date: '2025-12-15',
            totalMarks: 100,
            passingMarks: 33,
            status: 'Locked',
            studentsCount: 38,
            evaluatedCount: 38
        }
    ],
    students: {
        'EX-102': [
            { id: 'ST-001', roll: 1, name: 'Aarav Patel', marks: 45, grade: 'A', remarks: 'Excellent', status: 'Evaluated' },
            { id: 'ST-002', roll: 2, name: 'Aditi Sharma', marks: null, grade: null, remarks: '', status: 'Pending' },
            { id: 'ST-003', roll: 3, name: 'Arjun Singh', marks: 12, grade: 'D', remarks: 'Needs improvement', status: 'Evaluated' },
            // ... more students
        ]
    }
};
