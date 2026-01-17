
export const MOCK_PARENT_DATA = {
    user: {
        id: 'P001',
        name: 'Mr. Rajesh Verma',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Verma&background=0D8ABC&color=fff'
    },
    children: [
        {
            id: 'S001',
            name: 'Arav Verma',
            class: '10th',
            section: 'A',
            avatar: null, // use placeholder
            rollNo: '24',
            status: 'On Track', // On Track, Attention Needed, Action Required
            alerts: [
                { id: 1, type: 'homework', icon: 'BookOpen', title: 'Math Homework Due', message: 'Chapter 4 Exercises due tomorrow', cta: 'View' },
                { id: 2, type: 'fee', icon: 'CreditCard', title: 'Fee Due Soon', message: 'Q3 Tuition Fee is due in 5 days', cta: 'Pay Now' }
            ],
            academics: {
                attendance: 88,
                homeworkPending: 2,
                lastResult: { subject: 'Physics', marks: '42/50', grade: 'A' }
            },
            fees: {
                total: 45000,
                paid: 30000,
                pending: 15000,
                dueDate: '2023-10-30'
            }
        },
        {
            id: 'S002',
            name: 'Sneha Verma',
            class: '6th',
            section: 'B',
            avatar: null,
            rollNo: '12',
            status: 'Attention Needed',
            alerts: [
                { id: 3, type: 'attendance', icon: 'Clock', title: 'Low Attendance', message: 'Attendance dropped below 75%', cta: 'Check' }
            ],
            academics: {
                attendance: 72,
                homeworkPending: 0,
                lastResult: { subject: 'English', marks: '35/50', grade: 'B' }
            },
            fees: {
                total: 45000,
                paid: 45000,
                pending: 0,
                dueDate: null
            }
        }
    ],
    notices: [
        { id: 1, title: 'Annual Sports Day', date: '2023-10-25', description: 'Annual sports day will be held on 15th Nov.' },
        { id: 2, title: 'Diwali Holidays', date: '2023-10-20', description: 'School closed from Nov 10 to Nov 15.' }
    ]
};
