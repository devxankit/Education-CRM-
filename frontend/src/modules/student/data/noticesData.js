
export const notices = [
    {
        id: 1,
        title: 'Mid-Term Examination Schedule Released',
        date: '2026-01-14',
        time: '10:00 AM',
        type: 'Academic',
        priority: 'Important',
        read: false,
        content: `Dear Students,

The Mid-Term Examination schedule for Class 10 has been released. The exams will commence from February 5th, 2026.

Key Instructions:
1. Exams will be held in the Morning Shift (9:00 AM - 12:00 PM).
2. Admit cards will be distributed next week.
3. No electronic gadgets are allowed in the examination hall.

Please find the detailed timetable attached below.`,
        issuedBy: 'Principal Office',
        attachments: [
            { name: 'Exam_Schedule_2026.pdf', type: 'pdf', size: '1.2 MB' }
        ],
        requiresAcknowledgement: true,
        acknowledged: false
    },
    {
        id: 2,
        title: 'Republic Day Celebration',
        date: '2026-01-12',
        time: '02:30 PM',
        type: 'General',
        priority: 'Normal',
        read: true,
        content: `This is to inform all students that Republic Day will be celebrated on January 26th. Attendance is mandatory.`,
        issuedBy: 'Admin Department',
        attachments: [],
        requiresAcknowledgement: false,
        acknowledged: false
    },
    {
        id: 3,
        title: 'Physics Lab Manual Submission',
        date: '2026-01-10',
        time: '11:15 AM',
        type: 'Academic',
        priority: 'Normal',
        read: true,
        content: `All students of Class 10-A must submit their Physics Lab Manuals by Friday, 20th Jan.`,
        issuedBy: 'Mr. Verma (Physics Dept)',
        attachments: [],
        requiresAcknowledgement: false,
        acknowledged: false
    },
    {
        id: 4,
        title: 'Urgent: Fee Payment Reminder',
        date: '2026-01-08',
        time: '09:00 AM',
        type: 'Fee',
        priority: 'Important',
        read: false,
        content: `Dear Parent/Student,
    
Your tuition fee for the current quarter is pending. Please clear the dues before 15th Jan to avoid a late fee penalty.`,
        issuedBy: 'Accounts Office',
        attachments: [],
        requiresAcknowledgement: false,
        acknowledged: false
    },
    {
        id: 5,
        title: 'Winter Vacation Assignment',
        date: '2025-12-20',
        time: '01:00 PM',
        type: 'Academic',
        priority: 'Normal',
        read: true,
        content: `The winter vacation assignment list has been uploaded directly to the Study Material section.`,
        issuedBy: 'Academic Coordinator',
        attachments: [],
        requiresAcknowledgement: false,
        acknowledged: false
    }
];
