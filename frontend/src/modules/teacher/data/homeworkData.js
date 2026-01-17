
export const homeworkData = {
    list: [
        {
            id: 'HW-001',
            title: 'Quadratic Equations Exercise 4.2',
            subject: 'Mathematics',
            class: 'Class 10-A',
            postedDate: '2026-01-16',
            dueDate: '2026-01-18',
            submissionCount: 38,
            totalStudents: 42,
            status: 'Active', // Active, Closed, Draft
            description: 'Solve Q1 to Q10 from NCERT textbook Exercise 4.2. Submit photos of your notebook.',
            attachments: ['Exercise_4.2.pdf'],
            config: {
                allowLate: true,
                maxAttempts: 1,
                fileType: 'image/pdf'
            }
        },
        {
            id: 'HW-002',
            title: 'Physics Chapter 1 Notes',
            subject: 'Physics',
            class: 'Class 9-B',
            postedDate: '2026-01-15',
            dueDate: '2026-01-17',
            submissionCount: 20,
            totalStudents: 40,
            status: 'Active',
            description: 'Read Chapter 1 and make concise notes.',
            attachments: [],
            config: {
                allowLate: false,
                maxAttempts: 1,
                fileType: 'pdf'
            }
        },
        {
            id: 'HW-003',
            title: 'Algebra Quiz Prep',
            subject: 'Mathematics',
            class: 'Class 11-C',
            postedDate: '2026-01-10',
            dueDate: '2026-01-12',
            submissionCount: 35,
            totalStudents: 35,
            status: 'Closed',
            description: 'Practice questions for upcoming quiz.',
            attachments: ['Quiz_Prep.pdf'],
            config: {
                allowLate: false,
                maxAttempts: 1,
                fileType: 'pdf'
            }
        },
        {
            id: 'HW-DRAFT-1',
            title: 'Trigonometry Introduction',
            subject: 'Mathematics',
            class: 'Class 10-A',
            postedDate: null,
            dueDate: null,
            submissionCount: 0,
            totalStudents: 42,
            status: 'Draft',
            description: 'Draft version of trigonometry intro.',
            attachments: [],
            config: {
                allowLate: true,
                maxAttempts: 1,
                fileType: 'pdf'
            }
        }
    ],
    submissions: [
        { id: 'SUB-1', studentName: 'Aarav Patel', roll: 1, status: 'Submitted', date: '2026-01-16 14:30', late: false, files: ['hw_page1.jpg'], feedback: null },
        { id: 'SUB-2', studentName: 'Bhavya Singh', roll: 2, status: 'Pending', date: null, late: false, files: [], feedback: null },
        { id: 'SUB-3', studentName: 'Chirag Mehta', roll: 5, status: 'Submitted', date: '2026-01-18 10:00', late: true, files: ['hw_chirag.pdf'], feedback: 'Good effort, but handwriting needs improvement.' },
    ],
    classes: [
        { id: 'CLS-10A', name: 'Class 10-A', subject: 'Mathematics' },
        { id: 'CLS-9B', name: 'Class 9-B', subject: 'Physics' }
    ]
};
